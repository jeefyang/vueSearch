# vue开发的一个搜索小工具

vue3和trpc混合开发的例子的,可以参考改装,也可以直接`clone`下来`npm i`使用

## 命令使用

- `dev:vue` 启动vue的开发调试
- `dev:node` 启动node服务的开发调试
- `build:all` 同时打包`vue`和`node`的项目代码,打包目录分别是`build_vue`和`build_node`
## 其他文件使用

- `./public/config.jsonc`:
  - 用于配置服务器相关,触发`build`打包会自动分发到`build_node`和`build_vue`
- `./express.js`:
  - vue生产环境的js,方便调用,也可以自备方案
- './upload.py':
  - 用于遍历文件夹信息并上传的功能,有三个接口
  - `--basedir`:遍历的文件夹,默认`./`
  - `--outfile`:收集信息文件输出的文件名,默认`index.txt`,名字含有`_`将会自动分类,切记名字不能带中文
  - `--httpurl`:上传的网络路径,默认`http://localhost:3008/uploadfile` 
- `upload.bat`:
  - 用于触发`upload.py`的批处理,需要根据需求修改
  - `%~dp0`:是为了兼容网络路径