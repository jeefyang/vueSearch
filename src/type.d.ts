type JConfigType = {
    /** 监听端口 */
    listen: number
    /** 上传的文件夹 */
    uploadFolder: string
    /** https监听端口 */
    httpsListen?: number
    /** https密钥路径 */
    httpsKeyUrl?: string
    /** https证书路径 */
    httpsCrtUrl?: string
}

type JFileType = {
    path: string
    size: number
    atime: number
    ctime: number
    mtime: number
    name?: string
    ex?: string
    type: "file" | 'folder'
    isHideFolder?: boolean
    isHideFile?: boolean
    headname: string
}

type JDataTagType = {
    name: string,
    tags: string[],
    otherTags: string[],
    firstTag: string,
    fileName: string
    mtime: string,
    size: number
}

interface EventTarget {
    result: IDBDatabase
}

type fileDBType = {
    name: string
    mtime: string
    size: number
    content: string
}