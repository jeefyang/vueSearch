<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { jData } from "../data";
import { staticStore, store } from "../store";
import { showToast } from "vant";

const fileList = ref(<JFileType[]>[]);
const divRef = ref(<HTMLDivElement>null);

onMounted(async () => {
    // let time: NodeJS.Timeout
    watch(
        [
            () => store.isLow,
            () => store.search,
            () => store.isReg,
            () => store.searchInclude,
            () => store.isDisplayHidden,
            () => store.selectFileTag,
            () => store.selectOtherTag,
            () => store.selectExTag,
            () => store.sortType,
            () => store.isReverseSort,
            () => staticStore.path,
            () => staticStore.headname,
            () => store.isCur
        ],
        () => {
            // if (time) {
            //     clearTimeout(time)
            // }
            // time = setTimeout(() => {
            //     resetData()
            //     clearTimeout(time)
            // }, 200);
            resetData();
            // console.log("111")
        }
    );
    resetData();
});

const resetData = async () => {
    await jData.resetFileList();
    fileList.value = [];
    await new Promise((res, _rej) => {
        setTimeout(() => {
            scrollLazyLoad(undefined, divRef.value);
            res(undefined);
        }, 100);
    });
};

const getsize = (size: number) => {
    return (size / 1024 / 1024).toFixed(2) + "MB";
};

const scrollLazyLoad = async (event?: MouseEvent | TouchEvent, div?: HTMLDivElement) => {
    let delta = 200;
    if (!div) {
        div = <any>event.target;
    }
    let v = div.clientHeight + div.scrollTop - div.scrollHeight;
    if (v + delta < 0) {
        return;
    }
    fileList.value.push(...jData.scrollList());
    await new Promise((res, _rej) => {
        setTimeout(() => {
            scrollLazyLoad(event, div);
            res(undefined);
        }, 100);
    });
    return;
};

const gettime = (ms: number) => {
    let date = new Date(ms);
    let y = date.getFullYear();
    y = y >= 2000 ? y - 2000 : y;
    let m = date.getMonth() + 1;
    let mstr = m >= 10 ? m : `0${m}`;
    let d = date.getDate();
    let dstr = d >= 10 ? d : `0${d}`;
    let h = date.getHours();
    let apm = h >= 12 ? "pm" : "am";
    if (h > 12) {
        h -= 12;
    }
    let hstr = h >= 10 ? h : `0${h}`;
    let min = date.getMinutes();
    let minstr = min >= 10 ? min : `0${min}`;
    return `${y}-${mstr}-${dstr} ${apm}:${hstr}:${minstr}`;
};

const setSortType = (type: typeof store.sortType) => {
    if (store.sortType == type) {
        store.isReverseSort = !store.isReverseSort;
    } else {
        store.sortType = type;
    }
};

const setPathFunc = (item: JFileType, folderName?: string) => {
    let path = item.path;
    if (folderName) {
        path = `${path}/${folderName}`;
    }
    jData.setPath(path);
};

const setHeadnameFunc = (item: JFileType) => {
    jData.setHeadname(item.headname);
};

const setSearchNameFunc = (item: JFileType) => {
    store.search = item.name;
    jData.saveData();
    location.reload();
};

const copyFunc = async (str: string) => {
    try {
        await navigator.clipboard.writeText(str);
        showToast("复制成功");
    } catch (err) {
        showToast("复制失败");
    }
};

const searchNameFunc = (name: string, p: -1 | 0 | 1) => {
    if (!store.search) {
        if (p == -1) {
            return name;
        }
        return "";
    }
    let start = 0;
    let end = 0;
    if (store.isReg) {
        let d = name.match(RegExp(store.search, "i"));
        start = d?.["index"] || 0;
        end = start + (d?.[0]?.length || 0);
    } else {
        let index = store.isLow ? name.toLocaleLowerCase().indexOf(store.search.toLocaleLowerCase()) : name.indexOf(store.search);
        if (index != -1) {
            start = index;
            end = start + store.search.length;
        }
    }
    if (p == -1) {
        return name.slice(0, start);
    } else if (p == 0) {
        return name.slice(start, end);
    } else if (p == 1) {
        return name.slice(end, name.length);
    }
};

const isReverseColor = "#491089";
const noReverseColor = "#8a2527";
const sortTypeList: (typeof store)["sortType"][] = ["名称", "大小", "日期", "路径"];
</script>
<template>
    <div class="fileList" @scroll="scrollLazyLoad" ref="divRef">
        <table class="styled-table">
            <thead>
                <tr>
                    <template v-for="item in sortTypeList" :key="item">
                        <th :style="{ 'background-color': store.sortType == item ? (store.isReverseSort ? isReverseColor : noReverseColor) : undefined }" @click="setSortType(item)">
                            <template v-if="item == '路径'">
                                <span>{{ item }}</span>
                                <span style="color: goldenrod">{{ staticStore.headname }}</span>
                                <span>:</span>
                                <span>{{ staticStore.path }}</span>
                            </template>
                            <template v-else>{{ item }}</template>
                        </th>
                    </template>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in fileList" :key="index">
                    <td :class="item.type == 'folder' ? 'folderColor' : 'fileColor'" :title="item.headname + ':' + item.path">
                        <div class="name">
                            <div style="cursor: pointer" @click="setSearchNameFunc(item)" class="interval">
                                <span>{{ searchNameFunc(item.name, -1) }}</span>
                                <span class="searchHigh">{{ searchNameFunc(item.name, 0) }}</span>
                                <span>{{ searchNameFunc(item.name, 1) }}</span>
                            </div>
                            <div>
                                <van-tag style="cursor: pointer" class="interval" type="warning" @click="setPathFunc(item, item.name)">路径</van-tag>

                                <van-tag style="cursor: pointer" class="interval" type="danger" @click="copyFunc(item.name)">复制</van-tag>
                            </div>
                        </div>
                    </td>
                    <td :class="item.type == 'folder' ? 'folderColor' : 'fileColor'">{{ getsize(item.size) }}</td>
                    <td :class="item.type == 'folder' ? 'folderColor' : 'fileColor'">{{ gettime(item.atime) }}</td>
                    <td :title="item.name">
                        <div class="name">
                            <div class="interval">
                                <span style="cursor: pointer" class="headnameColor" @click="setHeadnameFunc(item)">{{ item.headname }}:</span>
                                <span style="cursor: pointer" @click="setPathFunc(item)">{{ item.path }}</span>
                            </div>
                            <div>
                                <van-tag style="cursor: pointer" class="interval" type="danger" @click="copyFunc(item.path)">复制</van-tag>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped>
.name {
    display: flex;
    justify-content: space-between;
}

thead {
    position: sticky;
    top: 0;
    z-index: 999;
}

.styled-table {
    border-collapse: collapse;

    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.folderColor {
    color: goldenrod;
}

tr:hover .folderColor {
    color: #000000;
}

.headnameColor {
    color: goldenrod;
}

.searchHigh {
    color: #c54948;
}

tr:hover .searchHigh {
    color: #c58a98;
}

.styled-table thead tr {
    background-color: #c54948;
    color: #ffffff;
    text-align: left;
}

.styled-table th {
    position: sticky;
    top: 0;
}

.styled-table th,
.styled-table td {
    padding: 12px 15px;
}

.styled-table tbody tr td {
    white-space: nowrap;
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
}

.styled-table tbody tr td p {
    display: inline-block;
}

.styled-table tbody tr:hover td .headnameColor {
    color: #95302f;
}

.styled-table tbody tr {
    background-color: #498240;
    font-weight: bold;
    color: #ffffff;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: #063f9f;
    font-weight: bold;
    color: #ffffff;
}

.styled-table tbody tr:nth-of-type(even):hover,
.styled-table tbody tr:hover {
    color: #000000;
}

.styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}

.styled-table tbody tr.active-row {
    font-weight: bold;
    color: #009879;
}

.fileList {
    flex-grow: 1;
    overflow: auto;
}
</style>
