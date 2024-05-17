import { reactive } from "vue"

export const store = reactive({

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
    /** 搜索是否包括文件夹 */
    haveFolder: <boolean>false,
    /** 显示隐藏文件 */
    isDisplayHidden: <boolean>false,
    /** 可选影视后缀名 */
    videoTagList: <string>"",
    /** 可选音乐后缀名 */
    musicTagList: <string>"",
    /** 可选办公后缀名 */
    officeTagList: <string>"",
    /** 可选压缩包后缀名 */
    zipTagList: <string>"",
    /** 可选图片后缀名 */
    picTagList: <string>"",
    /** 可选代码后缀名 */
    codeTagList: <string>"",
    /** 选中的后缀名 */
    selectExTag: <string>"",
    /** 删除的文件标签 */
    delFileList: <string>"",
    /** 选中的要删除的文件夹标签 */
    selectDelFileTag: <string>"",
    /** 排列顺序 */
    sortType: <"名称" | "大小" | "路径" | "日期">"名称",
    /** 是否反序 */
    isReverseSort: <boolean>false
})

/** 运行时的store */
export const runtimeStore = reactive({
    /** 按钮状态 */
    btnState: <string>""
})

export const staticStore = reactive({
    path: <string>"",
    headname: <string>""
})
