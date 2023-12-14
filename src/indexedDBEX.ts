
export class JIndexDBEX {
    /** 连接对象 */
    request: IDBOpenDBRequest
    /** 连接失败回调 */
    onerror: (ev: Event) => void
    /** 连接成功回调 */
    onsuccess: (ev: Event) => void
    /** 关闭回调 */
    onclose: (ev: Event) => void
    /**
     * 关闭回调,一般用来防止在版本升级中其他窗口的使用数据库不一致的问题
     */
    onblocked: (ev: Event) => void
    /**
     * 升级回调,只有在版本升级才会触发,比success提前,一般用于创建仓库,给仓库增加索引
     * @param transaction 一般用来获取仓库以此创建索引
     */
    onupgradeneeded: (ev: IDBVersionChangeEvent, transaction: IDBTransaction) => void
    /**
     * 版本升级回调,只有在版本升级才会触发,在success后触发,一般用来调整仓库字段
     */
    onversionchange: (ev: IDBVersionChangeEvent) => void
    /** 数据库基础对象 */
    base: IDBDatabase

    /**
     * 
     * @param dbName 
     * @param version 只能使用整数,使用小数会自动取整,且必须>=原来的版本
     */
    constructor(public dbName: string, public version: number) {

    }

    /** 初始化 */
    async init(): Promise<Event> {
        return new Promise((res, rej) => {
            this.request = indexedDB.open(this.dbName, this.version)
            this.request.addEventListener("error", (ev) => {
                console.log("连接失败")
                if (this.onerror) {
                    this.onerror(ev)
                }
                rej(ev)
            })
            this.request.addEventListener("success", (ev) => {
                console.log("连接成功")
                // @ts-ignore
                this.base = ev.target.result
                if (this.onsuccess) {
                    this.onsuccess(ev)
                }
                // 版本升级监听
                this.base.addEventListener("versionchange", (ev) => {
                    if (this.onversionchange) {
                        this.onversionchange(ev)
                    }
                })
                // 关闭监听
                this.base.addEventListener("close", (ev) => {
                    if (this.onclose) {
                        this.onclose(ev)
                    }
                })
                res(ev)
            })
            this.request.addEventListener("upgradeneeded", (ev) => {
                console.log("更新成功")
                // @ts-ignore
                this.base = ev.target.result
                // @ts-ignore
                let transaction: IDBTransaction = ev.target.transaction
                if (this.onupgradeneeded) {
                    this.onupgradeneeded(ev, transaction)
                }
            })
            this.request.addEventListener("blocked", (ev) => {
                if (this.onblocked) {
                    this.onblocked(ev)
                }
            })
        })

    }

    /** 删除自己本身 */
    async deleteDB() {
        return new Promise((res, rej) => {
            this.request = indexedDB.deleteDatabase(this.dbName)
            this.request.onerror = (ev) => {
                console.log("删除失败")
                if (this.onerror) {
                    this.onerror(ev)
                }
                rej(ev)
            }
            this.request.onsuccess = (ev) => {
                console.log("删除成功")
                if (this.onsuccess) {
                    this.onsuccess(ev)
                }
                res(ev)
            }
            this.request.onblocked= (ev) => {
                console.log("删除成功,触发block")
                if (this.onsuccess) {
                    this.onsuccess(ev)
                }
                res(ev)
            }

        })
    }

    /** 删除仓库 */
    async deleteStore(name: string) {
        this.base.deleteObjectStore(name)
    }

    /**
     * 创建仓库
     * @param name 仓库名 
     * @param options 
     * @returns 0为base都没有无法创建,1为没有创建,-1为已经有了不用创建
     */
    createStore(name: string, options?: IDBObjectStoreParameters): -1 | 1 | 0 {
        if (!this.base) {
            return 0
        }
        if (!this.base.objectStoreNames.contains(name)) {
            this.base.createObjectStore(name, options)
            return 1
        }
        return -1
    }
    /** 获取仓库 */
    getStore(storeName: string, mode?: IDBTransactionMode, transaction?: IDBTransaction) {
        if (!transaction) {
            transaction = this.base.transaction([storeName], mode);
        }
        /** 连接仓库 */
        let store = transaction.objectStore(storeName)
        return store
    }

    /** 获取改造后的仓库 */
    getJStore<T = any>(storeName: string, mode?: IDBTransactionMode, transaction?: IDBTransaction,) {
        let store = this.getStore(storeName, mode, transaction)
        return new JIndexDBStoreEX<T>({ store, parent: this })
    }


    /** 存储情况
     * @returns percentageUsed 存储百分比 remaining最多可写空间
     */
    async storage() {
        if (!navigator.storage || !navigator.storage.estimate) {
            return undefined
        }
        const quota = await navigator.storage.estimate();
        // quota.usage -> 已用字节数。
        // quota.quota -> 最大可用字节数。
        const percentageUsed = (quota.usage / quota.quota) * 100;
        const remaining = quota.quota - quota.usage;
        return {
            quota,
            percentageUsed,
            remaining
        }
    }
    /** 快速打印存储情况 */
    async consoleStorage() {
        let data = await this.storage()
        if (!data) {
            return
        }
        console.log(`您已使用可用存储的 ${data.percentageUsed.toFixed(3)}%。`);
        console.log(`您最多可以再写入 ${Math.round(data.remaining / 1024 / 1024)} MB。`);
    }
}

class JIndexDBStoreEX<T = any> {
    /** 数据库仓库对象 */
    store: IDBObjectStore
    parent: JIndexDBEX

    constructor(o: {
        store: IDBObjectStore, parent: JIndexDBEX
    }) {
        this.store = o.store
        this.parent = o.parent
    }
    /** 添加数据数组 */
    async addList(dataList: T[]) {

        // 添加数据
        for (let i = 0; i < dataList.length; i++) {
            let child = dataList[i]
            await this.add(child)
        }
        return
    }

    /** 添加数据 */
    async add(data: T) {
        return new Promise((res, rej) => {
            let addRequest = this.store.add(data)
            addRequest.addEventListener("error", (e) => {
                rej(e)
            })
            addRequest.addEventListener("success", (e) => {
                res(e)
            })
        })
    }

    /** 删除数据 */
    async delete(query: IDBValidKey | IDBKeyRange) {
        // let store = this.getStore(storeName, "readwrite")
        return new Promise((res, rej) => {
            let deleteRequest = this.store.delete(query)
            deleteRequest.addEventListener("error", (ev) => {
                rej(ev)
            })
            deleteRequest.addEventListener("success", (ev) => {
                res(ev)
            })
        })
    }

    /** 创建索引 */
    createIndex(name: string, keyPath: string | Iterable<string>, options?: IDBIndexParameters) {
        return this.store.createIndex(name, keyPath, options)
    }

    /** 删除多余数组 */
    async deleteList(query: IDBValidKey | IDBKeyRange, cb: (val: T, target: IDBCursorWithValue) => boolean, index?: string) {
        let keyList: IDBValidKey[] = []
        await this.foreach((child) => {
            if (!cb || cb(child.value, child)) {
                keyList.push(child.primaryKey)
            }
        }, query, index)
        for (let i = 0; i < keyList.length; i++) {
            let child = keyList[i]
            await this.delete(child)
        }
        return
    }

    /** 修改数据 */
    async modify(data: T, key?: IDBValidKey) {
        return new Promise((res, rej) => {
            let modifyRequest = this.store.put(data, key)
            modifyRequest.addEventListener("error", (ev) => {
                rej(ev)
            })
            modifyRequest.addEventListener("success", (ev) => {
                res(ev)
            })
        })
    }

    /** 查找数据,(记得在创建数据仓库时,创建对应的索引,不然只能索引主键) */
    async find(query: IDBValidKey | IDBKeyRange, index?: string): Promise<T> {
        return new Promise((res, rej) => {
            let findRequest: IDBRequest<T>
            if (index != undefined) {
                findRequest = this.store.index(index).get(query)
            }
            else {
                findRequest = this.store.get(query)
            }
            findRequest.addEventListener("error", (ev) => {
                rej(ev)
            })
            findRequest.addEventListener("success", (_ev) => {
                res(findRequest.result)
            })
        })
    }

    /** 过滤数据 */
    async filter(query: IDBValidKey | IDBKeyRange, count?: number, index?: string): Promise<T[]> {
        return new Promise((res, rej) => {
            // let store = this.getStore(storeName, "readonly")
            let findRequest: IDBRequest<T[]>
            if (index != undefined) {
                findRequest = this.store.index(index).getAll(query, count)
            }
            else {
                findRequest = this.store.getAll(query, count)
            }
            findRequest.addEventListener("error", (ev) => {
                rej(ev)
            })
            findRequest.addEventListener("success", (_ev) => {
                res(findRequest.result)
            })
        })
    }

    /** 遍历 */
    async foreach(cb: (data: IDBCursorWithValue) => void, query?: IDBValidKey | IDBKeyRange, index?: string) {
        return new Promise((res, rej) => {
            // let store = this.getStore(storeName, "readonly")
            let result: IDBRequest<IDBCursorWithValue>
            if (index != undefined) {

                result = this.store.index(index).openCursor(query)
            }
            else {
                result = this.store.openCursor(query)
            }
            result.addEventListener("error", (ev) => {
                rej(ev)
            })
            result.addEventListener("success", (ev) => {
                // @ts-ignore
                let cursor: IDBCursorWithValue = ev.target.result
                if (cursor) {
                    cb(cursor)
                    cursor.continue()
                }
                else {
                    res(ev)
                }
            })
        })
    }
}

