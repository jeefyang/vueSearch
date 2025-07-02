<script setup lang="ts">

import { ref, } from "vue"


const showPopover = ref(false);
const codeList = ref(<{ url: string, fileName: string, content: string }[]>[
    { url: "/downloadcodepy", fileName: "upload.py", content: "" },
    { url: "/downloadcodebat", fileName: "upload.bat", content: "" },
])

for (let i = 0; i < codeList.value.length; i++) {
    let code = codeList.value[i]
    if (!code.content) {
        let url = `${code.url}`
        fetch(url).then(res => res.text()).then(res => {
            code.content = res
        })
    }
}

const downFile = (str: string, fileName: string) => {
    const blob = new Blob([str])
    let b64 = window.URL.createObjectURL(blob)
    let a = document.createElement('a')
    a.href = b64
    a.download = fileName
    a.click()
}


</script>

<template>
    <div>
        <van-popup v-model:show="showPopover" position="top" :style="{ padding: '64px' }">
            <div v-for="(item, index) in codeList" :key="index" class="big">
                <textarea class="content">{{ item.content }}</textarea>
                <div class="small">
                    <span class="filename interval">{{ item.fileName }}</span>
                    <van-button class="btn_child" type="success" size="small"
                        @click="downFile(item.content, item.fileName)">下载</van-button>

                </div>
            </div>


        </van-popup>
        <van-button type="default" @click="showPopover = !showPopover">代码</van-button>

    </div>
</template>
<style scoped>

.small{
    margin-bottom: 10px;
}

.content{
    width: 100%;
}

.br {
    height: 10px;
}
</style>
