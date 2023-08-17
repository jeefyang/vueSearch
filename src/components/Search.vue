<script setup lang="ts">
import { store } from '../store';


const setReg = () => {
    store.isReg = !store.isReg
}

const setHaveFolder = () => {
    store.haveFolder = !store.haveFolder
}

</script>
<template>
    <div class="big">
        <van-button :plain="!store.isReg" type="primary" @click="setReg">正则</van-button>
        <van-button :plain="!store.haveFolder" type="primary" @click="setHaveFolder">文件夹</van-button>
        <van-field v-model="store.search" placeholder="请搜索"></van-field>
    </div>
</template>
<style scoped>
.big {
    display: flex;
    flex-direction: row;
}
</style>