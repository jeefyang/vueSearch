import express from "express"
import fileupload from "express-fileupload"
import cors from "cors"
import fs from "fs"
import path from "path"


const app = express()
app.use(cors())
app.use(fileupload({ "createParentPath": true }))
const saveDir = "./test"



app.post("/upload-avatar", async (req, res) => {
    console.log("upload")

    if (req.files) {
        let files: fileupload.FileArray = req.files
        let file: fileupload.UploadedFile = <any>files['file']
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
if (import.meta.env.PROD) {
    app.listen(3008)
}

export const viteNodeApp = app;