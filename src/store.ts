import { reactive } from "vue"

export const store = reactive({
    /** 服务路径 */
    serverHost: <string>"",
    /** 文件标签 */
    fileTagList: <string>"",
    /** 选中的文件标签 */
    selectFileTag: <string>"",
    /** 其他标签 */
    otherTagList: <string>"",
    /** 选中的其他标签 */
    selectOtherTag: <string>"",
    /** 是否已经加载完了 */
    isloaded: <boolean>false,
    /** 搜索 */
    search: <string>"",
    /** 是否正则 */
    isReg: <boolean>false,
    /** 是否有文件夹搜索 */
    haveFolder: <boolean>false
})
