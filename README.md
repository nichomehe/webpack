### 打包流程

#### 根据配置的entry，递归找出依赖集（从entry出发，将代码转化为ast，遍历ast找出import节点，放入依赖集，每个依赖集再作为entry重复上面的步骤 得到依赖全集），放入全集的webpack_modules（一个map，路径：代码块，代码块经过babel处理 import会转换成require（'./*'）的形式）执行代码块时require('./*1')其他模块的时候从webpack_modules中取出来执行代码块




  初始化compile实例，从入口开始将模块内容转化成ast，遍历ast，递归找到所有依赖的模块，按照 路径：模块代码 的形式放进 一个全集依赖对象webpack_modules里面，
  递归解析的过程中调用相应的loader对模块进行处理，
  在这个过程中webpack会emit出一些事件，根据不同的节点调用相应的plugin对处理后的模块进行集中处理（分包等），
  处理完成后将内容（一般是个自执行函数，参数是全集依赖对象）通过fs模块写入指定的文件中去


  初始化参数
  初始化compile对象
  从入口开始调用相应loader处理模块，递归找到所有的依赖并调用相应的loader处理依赖模块，最终会生成一个依赖对象，存放所有处理后的模块以及模块间的依赖关系
  通过一些plugin的配置，将模块进行划分整合生成相应的chunk，最终输出到指定文件中


eg: import('./a.js').then(()=>{
  
})

webpack_require.e : jsonp的方式 创建一个script标签，设置async，src为这个异步文件的地址