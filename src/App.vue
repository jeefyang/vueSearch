<script setup lang="ts">
import { onMounted, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import { store } from "./store"
import { jData } from './data';


const trpcTest = ref("")

onMounted(async () => {

  let json: JConfigType = await fetch("./config.jsonc").then(res => res.json())

  if (import.meta.env.DEV) {
    store.serverHost = "http://localhost:3008"
  }
  else if (import.meta.env.PROD) {
    store.serverHost = json.serverHost
  }

  await jData.initList()



  for (let i = 0; i < jData.fileList.length; i++) {
    let data = await jData.getFile(jData.fileList[i])
    console.log(data)
  }

})

</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <div class="trpc">{{ trpcTest }}</div>
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

.trpc {
  color: red;
}
</style>
