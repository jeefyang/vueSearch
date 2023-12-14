import express from "express"
import fileupload from "express-fileupload"
import cors from "cors"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"


const app = express()
app.use(cors())
app.use(fileupload({ "createParentPath": true }))
const saveDir = "./uploadFile"
let josnUrl = "./public/config.jsonc"
if (import.meta.env.PROD) {
    josnUrl = path.join(path.dirname(fileURLToPath(import.meta.url)), "config.jsonc")
}
const jsonStr = fs.readFileSync(josnUrl, "utf-8")
const configjson: JConfigType = eval(`(${jsonStr})`)


/** 上传文件 */
app.post("/uploadfile", async (req, res) => {
    console.log("upload")

    if (req.files) {
        let files: fileupload.FileArray = req.files
        let file: fileupload.UploadedFile = <any>files['file']
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true })
        }
        let saveUrl = path.join(saveDir, file.name)
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
    let files = fs.readdirSync(saveDir)

    let statsList = files.map(c => {
        return fs.statSync(path.join(saveDir, c))
    })
    res.send({
        status: true,
        data: files,
        statsList: statsList
    })
})

/** 下载代码 */
app.get("/downloadcodepy", async (_req, res) => {
    let code = fs.readFileSync('./upload.py')
    res.send(code)
})

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
    let fileUrl = path.join(saveDir, filename)
    try {
        let file = fs.readFileSync(fileUrl)
        res.send(file)
    }
    catch {
        console.log("没有找到文件", fileUrl)
        res.send(null)
    }
})



if (import.meta.env.PROD) {
    app.listen(configjson.node_build_post)
    console.log(configjson.node_build_host)
}

export const viteNodeApp = app;