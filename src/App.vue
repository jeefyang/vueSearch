<script setup lang="ts">
import { onMounted, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server/router';

const trpcTest = ref("")

onMounted(async () => {
  const client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3008/trpc',
      },),
    ]
  })
  const withoutInputQuery = await client.hello.greeting.query();
  trpcTest.value += withoutInputQuery + "\n"
  console.log(withoutInputQuery);

  const withInputQuery = await client.hello.greeting.query({ name: 'Alex' });
  trpcTest.value += withInputQuery + "\n"
  console.log(withInputQuery);
  console.log("aa")
 
  const xx = await client.hello.push.mutate({ file: { x: "a", y: "b", z: "c" }, name: "xx" })
  console.log(xx)
  console.log("qq")
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
