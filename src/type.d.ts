type JConfigType = {
    serverHost: string
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
}