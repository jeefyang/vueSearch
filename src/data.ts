
import { JGetFileTool } from "./getFileTool";
import { runtimeStore, staticStore, store } from "./store"
import { showToast, type ButtonType } from 'vant';

class JData {

    getFileTool = new JGetFileTool('')

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
        let list = await this.getFileTool.getFileList()
        this.fileList = list.data
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
        return this.getFileTool.tagList.map(c => c.firstTag).join(',')
    }

    getOtherTags() {
        let list: string[] = []
        for (let i = 0; i < this.getFileTool.tagList.length; i++) {
            list.push(... this.getFileTool.tagList[i].otherTags)
        }
        return list.join(',')
    }

    async getFile(name: string) {

        let cache = await this.getFileTool.getFile(name,
            () => {

            },
            () => {
                showToast({
                    message: `直接读取数据库:${name}`,
                    position: 'bottom',
                    duration: 2000
                });
            },
            () => {
                showToast({
                    message: `开始下载:${name}`,
                    position: 'bottom',
                    duration: 2000
                });
            },
            () => {
                showToast({
                    message: `下载完成:${name}`,
                    position: 'bottom',
                    duration: 2000
                });
            },
            () => {
                showToast({
                    message: `更新数据库完成:${name}`,
                    position: 'bottom',
                    duration: 2000
                });
            }
        )

        return cache
    }

    async delFile(name: string) {
        return await this.getFileTool.delFile(name,
            () => {
                showToast({
                    message: `开始删除:${name}`,
                    position: 'bottom',
                    duration: 2000
                });
            },
            () => {
                showToast({
                    message: `删除完成:${name}`,
                    position: 'bottom',
                    duration: 2000
                });
            }
        )
    }

    async getFileList() {
        let data = await this.getFile(this.getFileTool.tagList[0].name)
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
            store.searchInclude = "file"
        }
        console.log(fileArr)
        console.log(staticStore.path)
        for (let i = 0; i < this.getFileTool.tagList.length; i++) {
            if (!fileArr.includes(this.getFileTool.tagList[i].firstTag)) {
                runtimeStore.btnState = `${<keyof typeof store>'fileTagList'},${this.getFileTool.tagList[i].firstTag},${<ButtonType>'primary'}`
                continue
            }
            if (tagArr.length > 0 && !this.getFileTool.tagList[i].otherTags.some(c => tagArr.some(cc => cc == c))) {
                continue
            }
            let data = await this.getFile(this.getFileTool.tagList[i].fileName);

            runtimeStore.btnState = `${<keyof typeof store>'fileTagList'},${this.getFileTool.tagList[i].firstTag},${<ButtonType>'success'}`;

            [{ type: <"file" | "folder">"file", data: data.files }, { type: <"file" | "folder">"folder", data: data.folders }].forEach(c => {
                if (c.type == "folder" && store.searchInclude == "file") {
                    return
                }
                else if (c.type == "file" && store.searchInclude == "folder") {
                    return
                }
                for (let i = 0; i < c.data.length; i++) {
                    if (!store.isDisplayHidden && (c.data[i].isHideFile || c.data[i].isHideFolder)) {
                        continue
                    }
                    if (exArr.length > 0 && (!c.data[i].ex || !exArr.includes(c.data[i].ex))) {
                        continue
                    }
                    if (staticStore.headname && c.data[i].headname != staticStore.headname) {
                        continue
                    }
                    if (staticStore.path && c.data[i].path.slice(0, staticStore.path.length) != staticStore.path) {
                        continue
                    }
                    if (store.isCur && c.data[i].path != staticStore.path) {
                        continue
                    }
                    this.conditionList.push(c.data[i])
                }
            })
        }
        switch (store.sortType) {
            case "名称":
                this.conditionList = this.conditionList.sort((a, b) => {
                    if (a.name == b.name) {
                        return a.path > b.path ? 1 : -1
                    }
                    return a.name > b.name ? 1 : -1
                })
                break
            case "大小":
                this.conditionList = this.conditionList.sort((a, b) => {
                    if (a.size == b.size) {
                        if (a.path == b.path) {
                            return a.name > b.name ? 1 : -1
                        }
                        return a.path > b.path ? 1 : -1
                    }
                    return a.size > b.size ? 1 : -1
                })
                break
            case "日期":
                this.conditionList = this.conditionList.sort((a, b) => {
                    if (a.mtime == b.mtime) {
                        if (a.path == b.path) {
                            return a.name > b.name ? 1 : -1
                        }
                        return a.path > b.path ? 1 : -1
                    }
                    return a.mtime > b.mtime ? 1 : -1
                })
                break
            case "路径":
                this.conditionList = this.conditionList.sort((a, b) => {
                    if (a.path == b.path) {
                        return a.name > b.name ? 1 : -1
                    }
                    return a.path > b.path ? 1 : -1
                })
                break
        }
        if (store.isReverseSort) {
            this.conditionList = this.conditionList.reverse()
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
                (!store.isReg && this.conditionList[i].name.indexOf(store.search) != -1)
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

    setPath(path?: string) {
        let url = new URL(document.location.href)
        if (!path) {
            url.searchParams.delete("path")
            staticStore.path = ""
        }
        else {
            url.searchParams.set("path", path)
            staticStore.path = path
        }
        history.pushState("", "", url.href)
    }

    setHeadname(headname: string) {
        let url = new URL(document.location.href)
        if (!headname) {
            url.searchParams.delete("headname")
            staticStore.headname = ""
        }
        else {
            url.searchParams.set("headname", headname)
            staticStore.headname = headname
        }
        history.pushState("", "", url.href)
    }

    rebackPath() {
        let p = staticStore.path
        if (!p) {
            console.log('没有后退')
            return
        }
        let arrpath = p.split(/\\|\//)
        if (arrpath.length == 1 && !arrpath[0]) {
            console.log('没有后退')
            return
        }
        arrpath = arrpath.slice(0, -1)
        let newPath = arrpath.join('/')
        this.setPath(newPath)
    }

}

export const jData = new JData()