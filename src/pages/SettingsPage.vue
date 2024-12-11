<template>
  <div class="row q-pa-md q-gutter-md">
    <div class="col-12 group-title">视频源文件夹</div>
    <div class="col">
      <q-input v-model="src_folders" outlined type="textarea" placeholder="输入媒体源文件夹, 每行一个"></q-input>
    </div>
    <div class="q-justify-end items-end" style="width: 160px">
      <q-btn push class="btn-blue" label="保存" @click="saveSourceList" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api, notifyOk, notifyError, sha1 } from 'src/lib';
import { onMounted, ref } from 'vue';

document.title = '设置';

const $q = useQuasar();

const src_folders = ref('');

function saveSourceList() {
  const source = Array.from(
    new Set(
      src_folders.value
        .split('\n') // 按行分割
        .map((folder) => folder.trim()) // 去掉两端空白字符
        .filter((folder) => folder !== ''), // 过滤掉空字符
    ),
  ).map((folder) => ({
    path: folder,
    hash: sha1(folder), // 计算每个路径的哈希值
  }));

  const data = {
    source_list: source,
  };
  api.post('source/list/save', data).then((rsp) => {
    const rd = rsp.data;
    if (rd.error) {
      notifyError($q, rd.error);
    } else {
      notifyOk($q, '保存成功');
    }
  });
}
function reqSourceList() {
  api.post('source/list').then((rsp) => {
    src_folders.value = rsp.data.source_list.map((source: any) => source.path).join('\n');
  });
}
onMounted(() => {
  reqSourceList();
});
</script>

<style scoped></style>
