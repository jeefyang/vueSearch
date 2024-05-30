<script setup lang="ts">
import { jData } from '../data';
import { store } from '../store';
import { ref } from 'vue'


const searchRef = ref(<string>store.search)

const setReg = () => {
    store.isReg = !store.isReg
    jData.saveData()
}

const setCur = () => {
    store.isCur = !store.isCur
    jData.saveData()
}

const includeList: { key: typeof store["searchInclude"], name: string }[] = [
    { key: "file", name: "仅文件" },
    { key: "fileFoloder", name: "文件文件夹" },
    { key: "folder", name: "仅文件夹" }
]

const setInclude = () => {
    let index = includeList.findIndex(c => c.key == store.searchInclude)
    index++
    if (index >= includeList.length) {
        index = 0
    }
    store.searchInclude = includeList[index].key
    // console.log(store.haveFolder)
    jData.saveData()
}
const setDisplayHidden = () => {
    store.isDisplayHidden = !store.isDisplayHidden
    jData.saveData()
}

const setSearch = () => {
    setTimeout(() => {
        if (store.search == searchRef.value) {
            return
        }
        store.search = searchRef.value
        jData.saveData()
    }, 1000);
}





</script>
<template>
    <div class="big">
        <van-button type="primary" @click="setInclude">{{
            includeList[includeList.findIndex(c => c.key == store.searchInclude)]?.name || includeList[0].name
        }}</van-button>
        <div class="br"></div>
        <van-button :plain="!store.isCur" type="primary" @click="setCur">当前</van-button>
        <div class="br"></div>
        <van-button :plain="!store.isReg" type="primary" @click="setReg">正则</van-button>
        <div class="br"></div>
        <van-button :plain="!store.isDisplayHidden" type="primary" @click="setDisplayHidden">隐藏</van-button>
        <div class="br"></div>
        <input class="search_input" type="text" v-model="searchRef" placeholder="请搜索" @change="setSearch">
        <!-- <van-field v-model="searchRef" placeholder="请搜索" @change="setSearch"></van-field> -->
    </div>
</template>
<style scoped>
.big {
    display: flex;
    flex-direction: row;
}

.search_input {
    flex-grow: 1;
}

.br {
    width: 5px;
    height: 5px;
}
</style>