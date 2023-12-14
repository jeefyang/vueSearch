type JConfigType = {
    /** vue调试用的端口 */
    vue_dev_port: string | number
    /** vue生产用的端口 */
    vue_build_port: string | number
    /** node服务调试用的域名(域名为是用于可能会手机调试,可以输入ip地址,否则localhost) */
    node_dev_domain: string
    /** node调试用的端口 */
    node_dev_port: number
    /** node服务生产用的链接(用于vue连接) */
    node_build_host: string
    /** node服务生产用的端口(用于服务器启动) */
    node_build_post: number

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