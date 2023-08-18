<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { jData } from '../data';
import { store } from '../store';

const fileList = ref(<JFileType[]>[])
const divRef = ref(<HTMLDivElement>null)


onMounted(async () => {
    watch([() => store.search, () => store.isReg, () => store.haveFolder, () => store.isDisplayHidden, () => store.selectFileTag, () => store.selectOtherTag, () => store.selectExTag], () => {
        resetData()
    })
    resetData()
})

const resetData = async () => {
    await jData.resetFileList()
    console.log(jData.conditionList)
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
</script>
<template>
    <div class="fileList" @scroll="scrollLazyLoad" ref="divRef">
        <table class="styled-table">
            <thead>
                <tr>
                    <th>name</th>
                    <th>size</th>
                    <th>date</th>
                    <th>path</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in fileList" :key="index">
                    <td>{{ item.name }}</td>
                    <td>{{ getsize(item.size) }}</td>
                    <td>{{ gettime(item.atime) }}</td>
                    <td>{{ item.path }}</td>
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

.styled-table tbody tr:nth-of-type(even):hover,.styled-table tbody tr:hover {
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