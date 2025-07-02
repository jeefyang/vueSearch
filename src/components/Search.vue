<script setup lang="ts">
import { jData } from "../data";
import { store } from "../store";
import { ref } from "vue";

const searchRef = ref(<string>store.search);

const setReg = () => {
    store.isReg = !store.isReg;
    jData.saveData();
};

const setCur = () => {
    store.isCur = !store.isCur;
    jData.saveData();
};

const includeList: { key: (typeof store)["searchInclude"]; name: string }[] = [
    { key: "file", name: "仅文件" },
    { key: "fileFoloder", name: "文件文件夹" },
    { key: "folder", name: "仅文件夹" }
];

const setInclude = () => {
    let index = includeList.findIndex((c) => c.key == store.searchInclude);
    index++;
    if (index >= includeList.length) {
        index = 0;
    }
    store.searchInclude = includeList[index].key;
    // console.log(store.haveFolder)
    jData.saveData();
};

const setLow = () => {
    store.isLow = !store.isLow;
    jData.saveData();
};

const setDisplayHidden = () => {
    store.isDisplayHidden = !store.isDisplayHidden;
    jData.saveData();
};

const setSearch = () => {
    setTimeout(() => {
        if (store.search == searchRef.value) {
            return;
        }
        store.search = searchRef.value;
        jData.saveData();
    }, 1000);
};
</script>
<template>
    <div class="big line">
        <input class="search_input interval" type="text" v-model="searchRef" placeholder="请搜索" @change="setSearch" />
        <span
            v-if="searchRef"
            class="clear"
            @click="
                searchRef = '';
                setSearch();
            "
            >X</span
        >
        <van-button class="interval" type="primary" @click="setInclude">{{ includeList[includeList.findIndex((c) => c.key == store.searchInclude)]?.name || includeList[0].name }}</van-button>
        <van-button class="interval" :plain="!store.isCur" type="primary" @click="setCur">当前</van-button>
        <van-button class="interval" :plain="!store.isReg" type="primary" @click="setReg" title="正则不受大小写影响">正则</van-button>
        <van-button class="interval" :plain="store.isLow" type="primary" @click="setLow">大小写敏感</van-button>
        <van-button class="interval" :plain="!store.isDisplayHidden" type="primary" @click="setDisplayHidden">隐藏</van-button>

        <!-- <van-field v-model="searchRef" placeholder="请搜索" @change="setSearch"></van-field> -->
    </div>
</template>
<style scoped>
.search_input {
    height: var(--van-button-default-height);
    padding-right: 15px;
    width: 45vw;
}
.clear {
    position: absolute;
    background: #1d1c1c;
    width: 25px;
    height: 25px;
    text-align: center;
    border-radius: 50%;
    font-size: 20px;
    line-height: 25px;
    left: 45vw;
    cursor: pointer;
}

.br {
    width: 5px;
    height: 5px;
}
</style>
