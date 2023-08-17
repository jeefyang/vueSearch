<script setup lang="ts">
import { store } from '../store';


const setReg = () => {
    store.isReg = !store.isReg
}

</script>
<template>
    <div class="big">
        <van-field v-model="store.search" placeholder="请搜索"></van-field>
        <van-button :plain="!store.isReg" type="primary" @click="setReg">正则</van-button>
    </div>
</template>
<style scoped>
.big {
    display: flex;
    flex-direction: row;
    position: relative;
}
</style>