# Vue 3 + TypeScript + Vite + Trpc

vue3和trpc混合开发的例子的,可以参考改装,也可以直接`clone`下来`npm i`使用

## 命令使用

- `dev:vue` 启动vue的开发调试
- `dev:node` 启动node服务的开发调试
- `build:all` 同时打包`vue`和`node`的项目代码,打包目录分别是`build_vue`和`build_node`
## 注意事项

- 改动`vue`的`端口`,到`vite.config.vue.ts`
- 改动`node`的`端口`,到`vite.config.node.ts`,同时在`src/App.vue`里有引用`node端口`,也是需要修改.
- `node`的打包由于使用`VitePluginNode`插件,导出来是个方法,需要额外调用!
- 其实可以声明一份`json`共同读取同个`端口`,但是感觉给框架上了很多束缚,那就这样吧~~
- 可能我的做法不是最优解,最重要是玩得开心!!!
