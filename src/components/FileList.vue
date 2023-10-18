<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { jData } from '../data';
import { staticStore, store } from '../store';

const fileList = ref(<JFileType[]>[])
const divRef = ref(<HTMLDivElement>null)


onMounted(async () => {
    // let time: NodeJS.Timeout
    watch([() => store.search, () => store.isReg, () => store.haveFolder, () => store.isDisplayHidden, () => store.selectFileTag, () => store.selectOtherTag, () => store.selectExTag, () => store.sortType, () => store.isReverseSort, () => staticStore.path, () => staticStore.headname], () => {
        // if (time) {
        //     clearTimeout(time)
        // }
        // time = setTimeout(() => {
        //     resetData()
        //     clearTimeout(time)
        // }, 200);
        resetData()
        // console.log("111")
    })
    resetData()
})

const resetData = async () => {
    await jData.resetFileList()
    fileList.value = []
    await new Promise((res, _rej) => {
        setTimeout(() => {
            scrollLazyLoad(undefined, divRef.value)
            res(undefined)
        }, 100);
    })
}

const getsize = (size: number) => {
    return (size / 1024 / 1024).toFixed(2) + 'MB'
}

const scrollLazyLoad = async (event?: MouseEvent | TouchEvent, div?: HTMLDivElement) => {
    let delta = 200
    if (!div) {
        div = <any>event.target
    }
    let v = div.clientHeight + div.scrollTop - div.scrollHeight
    if (v + delta < 0) {
        return
    }
    fileList.value.push(...jData.scrollList())
    await new Promise((res, _rej) => {
        setTimeout(() => {
            scrollLazyLoad(event, div)
            res(undefined)
        }, 100);
    })
    return
}

const gettime = (ms: number) => {
    let date = new Date(ms)
    let y = date.getFullYear()
    y = y >= 2000 ? (y - 2000) : y
    let m = date.getMonth() + 1
    let mstr = m >= 10 ? m : `0${m}`
    let d = date.getDate()
    let dstr = d >= 10 ? d : `0${d}`
    let h = date.getHours()
    let apm = h >= 12 ? "pm" : "am"
    if (h > 12) {
        h -= 12
    }
    let hstr = h >= 10 ? h : `0${h}`
    let min = date.getMinutes()
    let minstr = min >= 10 ? min : `0${min}`
    return `${y}-${mstr}-${dstr} ${apm}:${hstr}:${minstr}`
}

const setSortType = (type: typeof store.sortType) => {
    if (store.sortType == type) {
        store.isReverseSort = !store.isReverseSort
    }
    else {
        store.sortType = type
    }
}



const setPathFunc = (item: JFileType, folderName?: string) => {
    let path = item.path
    if (folderName) {
        if (item.type == "file") {
            console.warn(folderName, "不是文件夹")
            return
        }
        path += `/${folderName}`
    }
    jData.setHeadname(item.headname)
    jData.setPath(path)
}

const searchNameFunc = (name: string, p: -1 | 0 | 1) => {
    if (!store.search) {
        if (p == -1) {
            return name
        }
        return ""
    }
    let start = 0
    let end = 0
    if (store.isReg) {
        let d = name.match(RegExp(store.search, "i"))
        start = (d?.["index"]) || 0
        end = start + (d?.[0]?.length || 0)
    }
    else {
        let index = name.indexOf(store.search)
        if (index != -1) {
            start = index
            end = start + store.search.length
        }
    }
    if (p == -1) {
        return name.slice(0, start)
    }
    else if (p == 0) {
        return name.slice(start, end)
    }
    else if (p == 1) {
        return name.slice(end, name.length)
    }
}



</script>
<template>
    <div class="fileList" @scroll="scrollLazyLoad" ref="divRef">
        <table class="styled-table">
            <thead>
                <tr>
                    <th :style="{ 'background-color': store.sortType == '名称' ? (store.isReverseSort ? '#a566ed' : '#d35c5e') : undefined }"
                        @click="setSortType('名称')">name</th>
                    <th :style="{ 'background-color': store.sortType == '大小' ? (store.isReverseSort ? '#a566ed' : '#d35c5e') : undefined }"
                        @click="setSortType('大小')">size</th>
                    <th :style="{ 'background-color': store.sortType == '日期' ? (store.isReverseSort ? '#a566ed' : '#d35c5e') : undefined }"
                        @click="setSortType('日期')">date</th>
                    <th :style="{ 'background-color': store.sortType == '路径' ? (store.isReverseSort ? '#a566ed' : '#d35c5e') : undefined }"
                        @click="setSortType('路径')">path</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in fileList" :key="index">
                    <td :class="item.type == 'folder' ? 'folderColor' : 'fileColor'"
                        @dblclick="setPathFunc(item, item.name)">
                        <p>{{ searchNameFunc(item.name, -1) }}</p>
                        <p class="searchHigh">{{ searchNameFunc(item.name, 0) }}</p>
                        <p>{{ searchNameFunc(item.name, 1) }}</p>
                    </td>
                    <td :class="item.type == 'folder' ? 'folderColor' : 'fileColor'">{{ getsize(item.size) }}</td>
                    <td :class="item.type == 'folder' ? 'folderColor' : 'fileColor'">{{ gettime(item.atime) }}</td>
                    <td @dblclick="setPathFunc(item)">
                        <p class="headnameColor">{{ item.headname }}:</p>
                        <p>{{ item.path }}</p>
                    </td>
                </tr>

            </tbody>
        </table>

    </div>
</template>
<style scoped>
.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.folderColor {
    color: goldenrod
}

tr:hover .folderColor {
    color: #000000;
}

.headnameColor {
    color: goldenrod
}

.searchHigh {
    color: #c54948;
}

tr:hover .searchHigh {
    color: #c58a98;
}


.styled-table thead tr {
    background-color: #c54948;
    color: #ffffff;
    text-align: left;
}

.styled-table th,
.styled-table td {
    padding: 12px 15px;
}

.styled-table tbody tr td {
    white-space: nowrap;
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
}

.styled-table tbody tr td p {
    display: inline-block;
}

.styled-table tbody tr:hover td .headnameColor {
    color: #b22135;
}


.styled-table tbody tr {
    background-color: #5ba350;
    font-weight: bold;
    color: #ffffff;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: #4889f8;
    font-weight: bold;
    color: #ffffff;
}

.styled-table tbody tr:nth-of-type(even):hover,
.styled-table tbody tr:hover {
    color: #000000;
}

.styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}

.styled-table tbody tr.active-row {
    font-weight: bold;
    color: #009879;
}

.fileList {
    flex-grow: 1;
    overflow: auto;
}
</style>