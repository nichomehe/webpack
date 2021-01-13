((allModules) => {
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
  })({"./src/index.js":{"entry":"./src/index.js","dep":{"./print.js":"./src/print.js","./add.js":"./src/add.js"},"transCode":"\"use strict\";\n\nvar _print = _interopRequireDefault(require(\"./print.js\"));\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar num = (0, _add[\"default\"])(1, 2);\nvar str = (0, _print[\"default\"])('index.js=====');\nalert(num, str);\nconsole.log(num, str);"},"./src/print.js":{"entry":"./src/print.js","dep":{},"transCode":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar print = function print(str) {\n  return 'print:' + str;\n};\n\nvar _default = print;\nexports[\"default\"] = _default;"},"./src/add.js":{"entry":"./src/add.js","dep":{"./utils/index.js":"./src/utils/index.js"},"transCode":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _index = _interopRequireDefault(require(\"./utils/index.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\n// require('./utils/index.js')\nvar add = function add(a, b) {\n  var name = (0, _index[\"default\"])();\n  return a + b;\n};\n\nvar _default = add; // module.exports ={\n//   add\n// }\n\nexports[\"default\"] = _default;"},"./src/utils/index.js":{"entry":"./src/utils/index.js","dep":{},"transCode":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar getName = function getName() {\n  return 'Nicole';\n};\n\nvar _default = getName;\nexports[\"default\"] = _default;"}})