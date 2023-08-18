import { store } from "./store"

class JData {

    cacheList: {
        files: JFileType[],
        folders: JFileType[]
        name: string,
        baseDir: string
    }[] = []

    tagList: {
        name: string,
        tags: string[],
        otherTags: string[],
        firstTag: string,
        fileName: string
    }[] = []

    fileList: string[] = []
    /** 条件列表 */
    conditionList: JFileType[] = []

    /** 一次产生多少个 */
    onceCount: number = 50
    /** 检查到第几个 */
    checkNum: number = 0
    /** 文件数量 */
    fileCount: number = 0

    saveKey: string = "vue_search_save"

    async initList() {
        let list: { data: string[] } = await fetch(store.serverHost + '/list').then(res => res.json())
        this.fileList = list.data
        for (let i = 0; i < this.fileList.length; i++) {
            let name = this.fileList[i].split(".")[0].split(".")[0]
            let tag = name.split("_")
            this.tagList.push({
                name: name,
                tags: tag,
                firstTag: tag[0],
                otherTags: tag.slice(1),
                fileName: this.fileList[i]
            })
        }
    }
    /** 保存数据 */
    saveData() {
        let str = JSON.stringify(store)
        localStorage.setItem(this.saveKey, str)
        console.log("保存数据成功")
    }

    /** 读取数据 */
    loadData() {
        let filterKeys: (keyof typeof store)[] = ['isloaded']
        let str = localStorage.getItem(this.saveKey)
        if (!str) {
            console.warn("读取不到数据")
            return
        }
        let obj = JSON.parse(str)
        for (let key in store) {
            if (obj[key] == undefined || filterKeys.includes(<any>key)) {
                continue
            }
            store[key] = obj[key]
        }
        console.log("读取数据成功")
    }

    getFileTags() {
        return jData.tagList.map(c => c.firstTag).join(',')
    }

    getOtherTags() {
        let list: string[] = []
        for (let i = 0; i < jData.tagList.length; i++) {
            list.push(...jData.tagList[i].otherTags)
        }
        return list.join(',')
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

    async getFile(name: string) {
        let index = this.cacheList.findIndex(c => c.name == name)
        if (index != -1) {
            return this.cacheList[index]
        }
        let url = `${store.serverHost}/getfile?filename=${name}`
        let file = await fetch(url).then(res => res.text())
        let cache = this.decodeFile(file, name)
        this.cacheList.push(cache)
        return cache
    }

    async getFileList() {
        let data = await this.getFile(this.tagList[0].name)
        let list: JFileType[] = [...data.files.filter(c => !c.isHideFile && !c.isHideFolder)]
        return list
    }

    /** 重新刷新文件列表数据 */
    async resetFileList() {
        this.conditionList = []
        let fileArr = !store.selectFileTag ? [] : store.selectFileTag.split(',')
        let tagArr = !store.selectOtherTag ? [] : store.selectOtherTag.split(",")
        let exArr = !store.selectExTag ? [] : store.selectExTag.split(",")
        // 强制
        if (exArr.length > 0) {
            store.haveFolder = false
        }
        for (let i = 0; i < this.tagList.length; i++) {
            if (!fileArr.includes(this.tagList[i].firstTag)) {
                continue
            }
            if (tagArr.length > 0 && !this.tagList[i].otherTags.some(c => tagArr.some(cc => cc == c))) {
                continue
            }
            let data = await this.getFile(this.tagList[i].fileName);
            [{ type: "file", data: data.files }, { type: "folder", data: data.folders }].forEach(c => {
                if (c.type == "folder" && store.haveFolder) {
                    return
                }
                for (let i = 0; i < c.data.length; i++) {
                    if (!store.isDisplayHidden && (c.data[i].isHideFile || c.data[i].isHideFolder)) {
                        continue
                    }
                    if (exArr.length > 0 && (!c.data[i].ex || !exArr.includes(c.data[i].ex))) {
                        continue
                    }
                    this.conditionList.push(c.data[i])
                }
            })
        }
        this.fileCount = this.conditionList.length
        this.checkNum = 0
    }

    /** 滚动加载列表 */
    scrollList() {
        if (this.checkNum == -1) {
            return []
        }
        let max = this.onceCount
        let list: JFileType[] = []
        let reg = store.isReg ? RegExp(store.search, "i") : undefined
        let isBreak = -1
        for (let i = this.checkNum; i < this.conditionList.length; i++) {
            if (!max) {
                isBreak = i
                break
            }
            if (
                !store.search ||
                (store.isReg && this.conditionList[i].name.match(reg)) ||
                (!store.isReg && this.conditionList[i].name.match(store.search))
            ) {
                list.push(this.conditionList[i])
                max--
                continue
            }
        }
        if (isBreak != -1) {
            this.checkNum = isBreak
            return list
        }
        else {
            this.checkNum = -1
        }
        return list
    }


}

export const jData = new JData()