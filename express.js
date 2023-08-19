import fs from 'fs'
// import { fileURLToPath } from "url"
import express from "express"

const jsonUrl = "./build_node/config.jsonc"
const jsonStr = fs.readFileSync(jsonUrl, "utf-8")
const configjson = eval(`(${jsonStr})`)

// 创建express 实例
const app = express();
// 当路由url匹配为'/'时，执行function，返回Hello World
app.get('/', function (req, res) {
    res.send('Hello World');
});
// 配置 静态资源文件 
app.use(express.static('./build_vue'))
// 监听端口号
app.listen(configjson["vue_build_port"], () => {
    console.log(`服务已启动:${configjson["vue_build_port"]}`)
})