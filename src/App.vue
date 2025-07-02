<script setup lang="ts">
import { onMounted } from "vue";
import { store } from "./store";
import { jData } from "./data";
import PopoverSelectButton from "./components/PopoverSelectButton.vue";
import PopoverCodeButton from "./components/PopoverCodeButton.vue";
import Search from "./components/Search.vue";
import FileList from "./components/FileList.vue";

onMounted(async () => {
    await jData.initList();

    jData.loadData();

    store.fileTagList = jData.getFileTags();
    store.otherTagList = jData.getOtherTags();
    store.videoTagList = "mp4,wmv,avi,webm,mkv";
    store.musicTagList = "mp3,aac,flac,m4a";
    store.zipTagList = "zip,7z,7,rar,gz";
    store.officeTagList = "xls,ppt,doc,docx,txt";
    store.picTagList = "bmp,png,jpg,jpeg,webp,anpg";
    store.codeTagList = "js,ts,py,html";
    store.delFileList = jData.getFileTool.tagList.map((c) => c.fileName).join(",");
    store.selectDelFileTag = "";
    store.isloaded = true;

    let o = new URL(location.href);
    let headname = o.searchParams.get("headname");
    if (headname) {
        jData.setHeadname(headname);
    }
    let path = o.searchParams.get("path");
    if (path) {
        jData.setPath(path);
    }
});

const rebackPathFunc = () => {
    jData.rebackPath();
};

const clearChildPathFunc = () => {
    jData.setPath("");
};

const clearHeadPathFunc = () => {
    jData.setHeadname("");
};

const clearCacheFunc = async () => {
    localStorage.clear();
    await jData.getFileTool.clearDB();
    let check = window.confirm("是否刷新?");
    if (check) {
        window.location.reload();
    }
};

const delFileFunc = async () => {
    console.log(store.selectDelFileTag);
    if (!store.selectDelFileTag) {
        return;
    }
    let check = confirm("是否要删除文件?");
    if (!check) return;
    check = confirm("真的要删除文件吗?");
    if (!check) return;
    check = confirm("最后确定真的要删除文件吗?");
    if (!check) return;
    check = confirm(`确定要删除${store.selectDelFileTag}.请确认?`);
    if (!check) return;
    let list = store.selectDelFileTag.split(",");
    for (let i = 0; i < list.length; i++) {
        let c = list[i];
        await jData.delFile(c);
    }
    check = confirm(`已经完全删除,是否刷新`);
    if (check) {
        window.location.reload();
    }
};
</script>

<template>
    <van-config-provider theme="dark" class="theme">
        <div class="main" v-if="store.isloaded">
            <div>
                <Search></Search>
                <div class="line">
                    <PopoverSelectButton class="interval" list-tag="fileTagList" state-watch select-tag="selectFileTag" name="文件" pos="bottom"> </PopoverSelectButton>
                    <PopoverSelectButton class="interval" list-tag="otherTagList" select-tag="selectOtherTag" name="标签" pos="bottom"> </PopoverSelectButton>
                    <PopoverSelectButton class="interval" list-tag="videoTagList" select-tag="selectExTag" name="影视" pos="bottom"> </PopoverSelectButton>
                    <PopoverSelectButton class="interval" list-tag="codeTagList" select-tag="selectExTag" name="代码" pos="bottom"> </PopoverSelectButton>
                    <PopoverSelectButton class="interval" list-tag="picTagList" select-tag="selectExTag" name="图片" pos="bottom"> </PopoverSelectButton>
                    <PopoverSelectButton class="interval" list-tag="zipTagList" select-tag="selectExTag" name="压缩包" pos="bottom"> </PopoverSelectButton>
                    <PopoverSelectButton class="interval" list-tag="officeTagList" select-tag="selectExTag" name="文档" pos="bottom"> </PopoverSelectButton>
                    <PopoverSelectButton class="interval" list-tag="musicTagList" select-tag="selectExTag" name="音乐" pos="bottom"> </PopoverSelectButton>
                    <PopoverSelectButton class="interval" list-tag="delFileList" select-tag="selectDelFileTag" name="删除" pos="bottom" @onclose="delFileFunc"> </PopoverSelectButton>
                </div>
                <div class="line">
                    <van-button class="interval" type="default" @click="clearChildPathFunc()">清路径</van-button>
                    <van-button class="interval" type="default" @click="clearHeadPathFunc()">清文件头</van-button>
                    <van-button class="interval" type="default" @click="rebackPathFunc()">后退路径</van-button>
                    <PopoverCodeButton class="interval"></PopoverCodeButton>
                    <van-button class="interval" type="default" @click="clearCacheFunc()">清除缓存</van-button>
                </div>
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
    width: 100%;
}

.bigFileList {
    flex-grow: 1;
}
</style>
