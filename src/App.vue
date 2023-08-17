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

  store.fileTagList = jData.getFileTags()
  store.otherTagList = jData.getOtherTags()
  // store.fileTagList = "aaaa,bbbb,cccc,dddd,eeee,ffff,gggg,hhhh,iiii,jjjj,kkkk,llll, mmmm,nnnn,oooo,pppp,qqqq,rrrr,ssss,tttt,uuuu,vvvv,wwww,xxxx,yyyy,zzzz"
  // store.otherTagList = "aaaa,bbbb,cccc,dddd,eeee,ffff,gggg,hhhh,iiii,jjjj,kkkk,llll, mmmm,nnnn,oooo,pppp,qqqq,rrrr,ssss,tttt,uuuu,vvvv,wwww,xxxx,yyyy,zzzz"



  for (let i = 0; i < jData.fileList.length; i++) {
    let data = await jData.getFile(jData.fileList[i])
    console.log(data)
  }

  store.isloaded = true

})

</script>

<template>
  <van-config-provider theme="dark" class="big">
    <div class="main" v-if="store.isloaded">
      <Search></Search>
      <div class="select">
        <PopoverSelectButton list-tag="fileTagList" select-tag="selectFileTag" name="文件" pos="bottom">
        </PopoverSelectButton>
        <PopoverSelectButton list-tag="otherTagList" select-tag="selectOtherTag" name="标签" pos="bottom">
        </PopoverSelectButton>
      </div>
      <div class="fileList">
        <FileList></FileList>
      </div>
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

.big {
  height: 100%;
}

.main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.select {
  display: flex;
  flex-direction: row;
  /* justify-content: space-around; */
}

.fileList {
  flex-grow: 1;
  overflow: scroll;
}
</style>
