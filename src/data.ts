import { number } from "zod"
import { store } from "./store"

class JData {

    cacheList: {
        files: JFileType[],
        folders: JFileType[]
        name: string,
        tag: string[],
        firstTag: string
        baseDir: string
    }[] = []

    fileList: string[] = []

    async initList() {
        let list: { data: string[] } = await fetch(store.serverHost + '/list').then(res => res.json())
        this.fileList = list.data
    }

    decodeFile(str: string, name: string) {
        let tag = name.split(".")[0].split("_")
        let cache: (typeof this.cacheList)[number] = {
            files: [],
            folders: [],
            name: name,
            tag: tag,
            firstTag: tag[0],
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
                let file: JFileType = {
                    name: arr[1],
                    size: Number(arr[2]),
                    atime: Number(arr[3]) * 1000,
                    ctime: Number(arr[4]) * 1000,
                    mtime: Number(arr[5]) * 1000,
                }
                if (arr[0] == "0") {
                    cache.folders.push(file)
                }
                else if (arr[0] == "1") {
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
}

export const jData = new JData()