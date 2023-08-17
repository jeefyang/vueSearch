<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { jData } from '../data';

const fileList = ref(<JFileType[]>[])

onMounted(async () => {
    fileList.value = await jData.getFileList()
})

const getsize = (size: number) => {
    return (size / 1024 / 1024).toFixed(2) + 'MB'
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
    <div>
        <table class="styled-table">
            <thead>
                <tr>
                    <th>path</th>
                    <th>size</th>
                    <th>date</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in fileList" :key="index">
                    <td>{{ item.name }}</td>
                    <td>{{ getsize(item.size) }}</td>
                    <td>{{ gettime(item.atime) }}</td>
                </tr>
                <!-- and so on... -->
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
    background-color: #009879;
    color: #ffffff;
    text-align: left;
}

.styled-table th,
.styled-table td {
    padding: 12px 15px;
}

.styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:hover {
    font-weight: bold;
    color: #987200;
    background-color: #1c7292;
}


.styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
    font-weight: bold;
    color: #009879;
}

.styled-table tbody tr:nth-of-type(even):hover {
    font-weight: bold;
    color: #987200;
    background-color: #1c7292;
}

.styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}

.styled-table tbody tr.active-row {
    font-weight: bold;
    color: #009879;
}
</style>