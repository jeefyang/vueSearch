# vue开发的一个搜索小工具

vue3和trpc混合开发的例子的,可以参考改装,也可以直接`clone`下来`npm i`使用

## 命令使用

- `dev:vue` 启动vue的开发调试
- `dev:node` 启动node服务的开发调试
- `build:all` 同时打包`vue`和`node`的项目代码,打包目录分别是`build_vue`和`build_node`
## 其他文件使用

- `./public/config.jsonc`:
  - 用于配置服务器相关,触发`build`打包会自动分发到`build_node`和`build_vue`,此文件仅在开发时使用,生产模式后,`nodejs`一律只读`build_node`文件夹下的,均以触发`js`为当前文件夹,`vue`则只读`build_vue`,均以触发`index.html`为当前文件夹
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

## 网络路径
本质是为了能够区分本地或者在线
- `nodedomain`:域名,由于url原因,不带`http://`
- `nodessl`:区分`https://`|`http://`,只要有值就默认`https://`
- `nodeport`:端口,由于url原因,域名很难带上端口,故在这里增加端口