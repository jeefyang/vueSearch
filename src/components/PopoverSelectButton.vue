<script setup lang="ts">

import { ref, defineEmits } from "vue"
import { store, runtimeStore } from "../store";
import { PopoverPlacement, type ButtonType } from "vant";
import { jData } from "../data";
import { onMounted } from "vue";
import { watch } from "vue";

const props = defineProps<{ listTag: "fileTagList" | "otherTagList" | "videoTagList" | "musicTagList" | "officeTagList" | "zipTagList" | "picTagList" | "codeTagList" | "delFileList", selectTag: "selectFileTag" | "selectOtherTag" | "selectExTag" | "selectDelFileTag", name: string, pos: PopoverPlacement, stateWatch?: boolean }>()

const emit = defineEmits(["onclose"])


const btnList = ref(<{ name: string, v: boolean, status?: ButtonType }[]>[])
let list = store[props.listTag].split(',')
let select = store[props.selectTag].split(',')
for (let i = 0; i < list.length; i++) {
    btnList.value.push({ name: list[i], v: select.includes(list[i]) })
}

const showPopover = ref(false);

const selectTag = (item: (typeof btnList.value)[number]) => {
    item.v = !item.v
    resetSelect()
}

const selectAll = () => {
    btnList.value.forEach(c => c.v = true)
    resetSelect()
}

const selectClear = () => {
    btnList.value.forEach(c => c.v = false)
    resetSelect()
}

const selectReverse = () => {
    btnList.value.forEach(c => c.v = !c.v)
    resetSelect()
}

const resetSelect = () => {
    store[props.selectTag] = btnList.value.filter(c => c.v).map(c => c.name).join(',')
    jData.saveData()
}

const closeDiv = () => {
    emit("onclose")
}

onMounted(() => {
    if (props.stateWatch) {
        watch([() => runtimeStore.btnState], () => {
            let s = runtimeStore.btnState
            let l = s.split(',')
            if (l[0] != props.listTag) {
                return
            }
            let f = btnList.value.find(c => c.name == l[1])
            if (!f) {
                return
            }
            f.status = <any>l[2]
        })
    }
})


</script>
<template>
    <div>
        <van-popup v-model:show="showPopover" position="top" :style="{ padding: '64px' }" @closed="closeDiv">
            <div class="big">
                <div class="btn_parent tag">
                    <van-button v-for="(item, index) in btnList" :key="index" class="btn_child" :plain="!item.v"
                        :type="item.status || 'primary'" @click="selectTag(item)">{{
                            item.name }}</van-button>
                </div>
                <div class="br"></div>
                <div class="btn_parent all">
                    <van-button class="btn_child" @click="showPopover = false">关闭</van-button>
                    <van-button class="btn_child" type="success" @click="selectAll">全选</van-button>
                    <van-button class="btn_child" type="success" @click="selectReverse">反选</van-button>
                    <van-button class="btn_child" type="success" @click="selectClear">清空</van-button>

                </div>
            </div>

        </van-popup>
        <van-button type="primary" @click="showPopover = !showPopover">{{ props.name }}</van-button>

    </div>
</template>
<style scoped>
.btn_parent {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* justify-content: space-around; */
}

.btn_child {
    margin: 3px 5px;
}

.big {
    display: flex;
    flex-direction: column;

}

.br {
    height: 10px;
}
</style>
