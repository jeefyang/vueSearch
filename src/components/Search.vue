<script setup lang="ts">
import { jData } from '../data';
import { store } from '../store';
import { ref } from 'vue'


const searchRef = ref(<string>store.search)

const setReg = () => {
    store.isReg = !store.isReg
    jData.saveData()
}

const setHaveFolder = () => {
    store.haveFolder = !store.haveFolder
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
        <van-button :plain="!store.isReg" type="primary" @click="setReg">正则</van-button>
        <div class="br"></div>
        <van-button :plain="!store.haveFolder" type="primary" @click="setHaveFolder">文件夹</van-button>
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