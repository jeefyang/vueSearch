<script setup lang="ts">
import { onMounted } from 'vue';
import { staticStore, store } from "./store"
import { jData } from './data';
import PopoverSelectButton from './components/PopoverSelectButton.vue';
import Search from "./components/Search.vue"
import FileList from "./components/FileList.vue"


onMounted(async () => {
  const jsoncStr = await fetch("./config.jsonc").then(res => res.text())
  const configjson: JConfigType = eval(`(${jsoncStr})`)

  if (import.meta.env.DEV) {
    store.serverHost = `http://${configjson.node_dev_domain}:${configjson.node_dev_port}`
  }
  else if (import.meta.env.PROD) {
    store.serverHost = configjson.node_build_host
  }
  let url = new URL(document.location.href)
  if (url.searchParams.get('nodedomain')) {
    let host = `http${url.searchParams.get("nodessl") ? "s" : ''}://` + url.searchParams.get('nodedomain')
    if (url.searchParams.get('nodeport')) {
      host += `:${url.searchParams.get('nodeport')}`
    }
    store.serverHost = host
  }
  if (url.searchParams.get("path")) {
    staticStore.path = url.searchParams.get("path")
  }
  if (url.searchParams.get("headname")) {
    staticStore.headname = url.searchParams.get("headname")
  }
  await jData.initList()

  jData.loadData()

  store.fileTagList = jData.getFileTags()
  store.otherTagList = jData.getOtherTags()
  store.videoTagList = "mp4,wmv,avi,webm,mkv"
  store.musicTagList = "mp3,aac,flac,m4a"
  store.zipTagList = "zip,7z,7,rar,gz"
  store.officeTagList = "xls,ppt,doc,docx,txt"
  store.picTagList = "bmp,png,jpg,jpeg,webp,anpg"
  store.codeTagList = "js,ts,py,html"


  // for (let i = 0; i < jData.fileList.length; i++) {
  //   let data = await jData.getFile(jData.fileList[i])
  //   console.log(data)
  // }

  store.isloaded = true

})
const downloadFile = async (url: string, fileName: string) => {
  const str = await fetch(url).then(res => res.text())
  const blob = new Blob([str])
  let b64 = window.URL.createObjectURL(blob)
  let a = document.createElement('a')
  a.href = b64
  a.download = fileName
  a.click()
}

const downloadCodeFunc = async () => {
  await downloadFile(`${store.serverHost}/downloadcodepy`, 'upload.py')
  setTimeout(() => {
    downloadFile(`${store.serverHost}/downloadcodebat`, 'upload.bat')
  }, 2000);
}

const clearPathFunc = () => {
  jData.setHeadname("")
  jData.setPath("")
}

const rebackPathFunc = () => {
  jData.rebackPath()
}

const clearCacheFunc = async () => {
  localStorage.clear()
  await jData.clearDB()
  let check = window.confirm("是否刷新?")
  if (check) {
    window.location.reload()
  }
}

</script>

<template>
  <van-config-provider theme="dark" class="theme">
    <div class="main" v-if="store.isloaded">
      <Search></Search>
      <div class="br"></div>
      <div class="select">
        <PopoverSelectButton list-tag="fileTagList" select-tag="selectFileTag" name="文件" pos="bottom">
        </PopoverSelectButton>
        <div class="br"></div>
        <PopoverSelectButton list-tag="otherTagList" select-tag="selectOtherTag" name="标签" pos="bottom">
        </PopoverSelectButton>
        <div class="br"></div>
        <PopoverSelectButton list-tag="videoTagList" select-tag="selectExTag" name="影视" pos="bottom">
        </PopoverSelectButton>
        <div class="br"></div>
        <PopoverSelectButton list-tag="codeTagList" select-tag="selectExTag" name="代码" pos="bottom">
        </PopoverSelectButton>
        <div class="br"></div>
        <PopoverSelectButton list-tag="picTagList" select-tag="selectExTag" name="图片" pos="bottom">
        </PopoverSelectButton>
        <div class="br"></div>
        <PopoverSelectButton list-tag="zipTagList" select-tag="selectExTag" name="压缩包" pos="bottom">
        </PopoverSelectButton>
        <div class="br"></div>
        <PopoverSelectButton list-tag="officeTagList" select-tag="selectExTag" name="文档" pos="bottom">
        </PopoverSelectButton>
        <div class="br"></div>
        <PopoverSelectButton list-tag="musicTagList" select-tag="selectExTag" name="音乐" pos="bottom">
        </PopoverSelectButton>
        <div class="br"></div>
        <van-button type="default" @click="clearPathFunc()">重置路径</van-button>
        <div class="br"></div>
        <van-button type="default" @click="rebackPathFunc()">后退</van-button>
        <div class="br"></div>
        <van-button type="default" @click="downloadCodeFunc()">下载代码</van-button>
        <div class="br"></div>
        <van-button type="default" @click="clearCacheFunc()">清除缓存</van-button>
      </div>
      <FileList></FileList>
    </div>
  </van-config-provider>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.theme {
  height: 100%;
}

.main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.br {
  width: 5px;
  height: 5px;
}

.select {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* justify-content: space-around; */
}

.bigFileList {
  flex-grow: 1;
}
</style>
