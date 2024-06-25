import express from "express"
import fileupload from "express-fileupload"
import cors from "cors"
import fs from "fs"
import path from "path"
import mime from "mime"
import { createProxyMiddleware } from "http-proxy-middleware"
import https from "https"

const app = express()
app.use(cors())
app.use(fileupload({ "createParentPath": true }))
let jsonUrl = "./config.jsonc"
let exampleJsonUrl = "./config.example.jsonc"
if (!fs.existsSync(jsonUrl)) {
    let buf = fs.readFileSync(exampleJsonUrl)
    fs.writeFileSync(jsonUrl, buf)
}

const jsonStr = fs.readFileSync(jsonUrl, "utf-8")
const configjson: JConfigType = eval(`(${jsonStr})`)
console.log(configjson)

if (!fs.existsSync(configjson.uploadFolder)) {
    fs.mkdirSync(configjson.uploadFolder, { "recursive": true })
}


/** 上传文件 */
app.post("/uploadfile", async (req, res) => {
    console.log("upload")

    if (req.files) {
        let files: fileupload.FileArray = req.files
        let file: fileupload.UploadedFile = <any>files['file']
        if (!fs.existsSync(configjson.uploadFolder)) {
            fs.mkdirSync(configjson.uploadFolder, { recursive: true })
        }
        let saveUrl = path.join(configjson.uploadFolder, file.name)
        fs.writeFileSync(saveUrl, file.data)
        console.log("success")
        res.send({
            status: true,
            message: 'no file upload'
        })

    }
    else {
        console.log("fail")
        res.send({
            status: false,
            message: 'no file upload'
        })
    }
})

/** 获取文件列表 */
app.get("/list", async (_req, res) => {
    let files = fs.readdirSync(configjson.uploadFolder)
    let statsList = files.map(c => {
        return fs.statSync(path.join(configjson.uploadFolder, c))
    })
    res.send({
        status: true,
        data: files,
        statsList: statsList
    })
})

/** 下载py代码 */
app.get("/downloadcodepy", async (_req, res) => {
    let code = fs.readFileSync('./upload.py')
    res.send(code)
})

/** 下载批处理文件 */
app.get("/downloadcodebat", async (_req, res) => {
    let code = fs.readFileSync('./upload.bat')
    res.send(code)
})

/** 获取文件 */
app.get("/getfile", async (req, res) => {
    let filename = <string>req?.query?.filename
    if (!filename) {
        console.log("文件参数找不到")
        res.send(null)
        return
    }
    let fileUrl = path.join(configjson.uploadFolder, filename)
    try {
        let file = fs.readFileSync(fileUrl)
        res.send(file)
    }
    catch {
        console.log("没有找到文件", fileUrl)
        res.send(null)
    }
})

/** 删除文件 */
app.get("/delfile", async (req, res) => {
    let filename = <string>req?.query?.filename
    if (!filename) {
        console.log("文件参数找不到")
        res.send(null)
        return
    }
    let fileUrl = path.join(configjson.uploadFolder, filename)
    try {
        fs.rmSync(fileUrl)
        res.send(`${fileUrl} was del!!!`)
    }
    catch {
        console.log("没有找到文件", fileUrl)
        res.send(null)
    }
})

app.get("*", async (req, res) => {

    let url = ""
    if (import.meta.env.MODE == "development") {
        url = `./dev_vue${req.path}`
    }
    else if (import.meta.env.MODE == "production") {
        url = `./build_vue${req.path}`
    }
    console.log(`加载文件:${url}`)
    if (!fs.existsSync(url)) {
        console.log(url, 404)
        res.sendStatus(404)
        return
    }
    res.setHeader("Content-Type", mime.getType(url))
    res.send(fs.readFileSync(url))

})

// let base = import.meta.env.MODE == "development" ? "./dev_vue" : "./build_vue"
// app.use("*", express.static(base))


app.listen(configjson.listen)
console.log(`监听启动:${configjson.listen}`)

// https监听
if (configjson.httpsListen && configjson.httpsCrtUrl && configjson.httpsKeyUrl) {
    try {
        let keydata = fs.readFileSync(configjson.httpsKeyUrl,)
        let crtdata = fs.readFileSync(configjson.httpsCrtUrl)
        const https_app = express()
        https_app.use("/", createProxyMiddleware({
            target: `http://127.0.0.1:${configjson.listen}`,
            changeOrigin: true
        }))
        // https_app.listen(configjson.httpsListen)
        // console.log(`ssl监听启动:${configjson.httpsListen}`)
        https.createServer({
            key: keydata,
            cert: crtdata

        }, https_app).listen(configjson.httpsListen)
        console.log(`ssl监听启动:${configjson.httpsListen}`)
    }
    catch {
        console.log('https的证书或密钥存在问题!')
    }



}

export const viteNodeApp = app;