const fs = require("fs");
const path = require('path');
const babel = require('@babel/core');
const parser = require("@babel/parser"); //将代码转化ast
const traverse = require("@babel/traverse").default; //遍历ast



//使用nodejs的fs模块来读取文件内容并创造出一个‘路径-代码块’的map（所有import的文件都会在这个map里 是个全集），然后写进一个js文件里，在用eval执行它。

//读取文件
const getCode = (filePath) => {
  const dirname = path.dirname(filePath);  // ./src
  const code = fs.readFileSync(filePath, "utf8");

  //会将你的代码转换成数据结构：对象的形式  代码内容会放在body中 body:[ImportDeclaration,ImportDeclaration,VariableDeclaration,FunctionDeclaration]
  const ast = parser.parse(code, {
    sourceType: "module",
  });
  const dep = {}    //存放所有import的依赖集  {相对src入口文件的路径：相对myPack打包入口的路径}

  //遍历ast 找出import节点 将其依赖模块路径添加至dep依赖集
  traverse(ast, {
    //遍历文件的ast 取出import节点，将其添加至依赖集
    ImportDeclaration(p) {
      //相对于入口文件的路径 ./add.js
      const importPath = p.get("source").node.value;
      //相对于myPack的路径  ./src/add.js
      const realPath = './' + path.join(dirname,importPath)
      //写进依赖集
      dep[importPath] = realPath
    }
  });
  // 获取当前文件被转化后的代码(转化为可执行代码)
  const { code:transCode } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  return {entry:filePath,dep,transCode}
}


const getAll = function(entry){
  let allInfo = {}
  let entryInfo = getCode(entry)
  allInfo[entryInfo.entry] = entryInfo
  const getDepsInfo = function(moduleItem){
    if(moduleItem.dep){
      for(let path in moduleItem.dep){
        let depItem = getCode(moduleItem.dep[path])
        allInfo[depItem.entry] = depItem
        //递归获取所有依赖集放入 allInfo
        getDepsInfo(depItem,allInfo)
      }
    }
  }
  getDepsInfo(entryInfo)
  return allInfo
}

const webpack = function(entry){
  //从入口开始获取所有依赖集
  const webpack_modules = getAll(entry)
  //比如我们打包的时候写入的app.js
  const writeFunc = `((allModules) => {
    const require = function (path) {
      const code = allModules[path].transCode
      let exports = {}
      // 执行代码时 将 ./add(相对于当前执行代码的路径) 转换为 ./src/add（相对于webpack入口文件 myPack.js的路径）
      const srcRequire = (p)=>{
        return require(allModules[path].dep[p])
      }
      ((require,exports)=>{
        eval(code)
      })(srcRequire,exports)
      return exports    
    }
    require('./src/index.js')
  })(${JSON.stringify(webpack_modules)})`

  //写入可执行文件（writeFileSync只可通过字符串的形式写入）
  fs.writeFileSync("./dist.js", writeFunc);
}

webpack('./src/index.js')






