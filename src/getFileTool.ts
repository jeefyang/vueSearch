import { JIndexDBEX } from "./indexedDBEX";

type CacheType = {
    files: JFileType[],
    folders: JFileType[]
    name: string,
    baseDir: string
}

export class JGetFileTool {

    dbVersion: number = 2
    dbName: string = "fileDB"
    dbStoreName: string = "fileList"

    cacheList: CacheType[] = []

    tagList: JDataTagType[] = []

    constructor(public baseUrl: string) {

    }

    decodeFile(str: string, name: string) {
        let cache: (typeof this.cacheList)[number] = {
            files: [],
            folders: [],
            name: name.split(".")[0],
            baseDir: ""
        }
        let start = 1
        let end = 2
        while (str[end] != "?") {
            end++
        }
        cache.baseDir = str.slice(start, end)
        start = end + 1
        let arr: string[] = []
        for (let i = start; i < str.length; i++) {
            if (str[i] == "*") {
                arr.push(str.slice(start, i))
                start = i + 1
                continue
            }
            if (str[i] == "|") {
                arr.push(str.slice(start, i))
                let pathUrl = arr[1]
                let arrpath = pathUrl.split(/\\|\//)
                let basePathArr = arrpath.slice(0, arrpath.length - 1)
                let isHideFolder = basePathArr.some(c => c[0] == "." && c.length > 1)
                let basePath = basePathArr.join('/')
                let fileName = arrpath[arrpath.length - 1]
                let file: JFileType = {
                    headname: cache.name.split("_")[0],
                    path: basePath,
                    size: Number(arr[2]),
                    atime: Number(arr[3]) * 1000,
                    ctime: Number(arr[4]) * 1000,
                    mtime: Number(arr[5]) * 1000,
                    name: fileName,
                    type: "file",
                    isHideFolder: isHideFolder,
                    isHideFile: fileName[0] == "."
                }
                if (arr[0] == "0") {
                    file.type = "folder"
                    cache.folders.push(file)
                }
                else if (arr[0] == "1") {
                    let arr = file.name.split('.')
                    file.ex = arr[arr.length - 1]
                    cache.files.push(file)
                }
                start = i + 1
                arr = []
                continue
            }
        }
        return cache
    }

    async getFile(name: string, cacheCB?: () => void, getDBCB?: () => void, startCB?: () => void, fetchCB?: () => void, updateDBCB?: () => void) {

        let index = this.cacheList.findIndex(c => c.name == name.split('.')[0])
        if (index != -1) {
            cacheCB && cacheCB()
            return this.cacheList[index]
        }

        let tag = this.tagList.find(c => c.fileName == name)
        let fileContent = ""
        let dbData = await this.getFileByDB(name)
        if (dbData && tag.mtime == dbData.mtime && tag.size == dbData.size) {
            fileContent = dbData.content
            getDBCB && getDBCB()
        }
        else {
            let url = this.baseUrl + `/getfile?filename=${name}`
            startCB && startCB()

            fileContent = await fetch(url).then(res => res.text())
            fetchCB && fetchCB()
            await this.updateFileDB(tag, fileContent)
            updateDBCB && updateDBCB()
        }
        let cache = this.decodeFile(fileContent, name)
        this.cacheList.push(cache)
        return cache
    }

    async delFile(name: string, startCB?: () => void, completeCB?: () => void) {
        let url = this.baseUrl + `/delfile?filename=${name}`
        startCB && startCB()
        let stat = await fetch(url)
        console.log(stat)
        completeCB && completeCB()
        return
    }

    async getFileByDB(name: string) {
        let db = await this.dbInit()
        let s = db.getJStore<fileDBType>('fileList', "readonly")
        try {
            let data = await s.find(name, "name")
            db.base.close()
            return data
        }
        catch {
            db.base.close()
            return undefined
        }
    }


    async dbInit() {
        // 需提供数据库命和版本
        let db = new JIndexDBEX(this.dbName, this.dbVersion)
        // 记得设置好八本升级用的回调,版本需要整数变化才能触发
        db.onupgradeneeded = (_e, t) => {
            // 我这边直接删除重建表,这样不要兼容
            db.deleteStore(this.dbStoreName)
            db.createStore(this.dbStoreName, { keyPath: "name" })
            // 需要添加索引才能去查找数据
            db.getJStore(this.dbStoreName, "readwrite", t).createIndex('name', "name", { 'unique': true })
            console.log("数据库版本更新", this.dbVersion)
        }
        // 设置回调后再初始化
        await db.init()

        return db
    }

    async updateFileDB(data: JDataTagType, content: string) {
        let db = await this.dbInit()
        db.createStore(this.dbStoreName, { keyPath: "name" })
        let s = db.getJStore<fileDBType>(this.dbStoreName, "readwrite")
        await s.modify({ name: data.fileName, mtime: data.mtime, size: data.size, content })
        db.base.close()
    }

    async clearDB() {
        let db = new JIndexDBEX("fileDB", this.dbVersion)
        await db.init()
        await db.deleteDB()
        db.base.close()
        return
    }

}
