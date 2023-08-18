<script setup lang="ts">
import { onMounted } from 'vue';
import { store } from "./store"
import { jData } from './data';
import PopoverSelectButton from './components/PopoverSelectButton.vue';
import Search from "./components/Search.vue"
import FileList from "./components/FileList.vue"


onMounted(async () => {

  let json: JConfigType = await fetch("./config.jsonc").then(res => res.json())

  if (import.meta.env.DEV) {
    store.serverHost = "http://localhost:3008"
  }
  else if (import.meta.env.PROD) {
    store.serverHost = json.serverHost
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
  /* justify-content: space-around; */
}

.bigFileList {
  flex-grow: 1;
}
</style>
