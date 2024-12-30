<template>
  <div class="row q-pa-md q-gutter-md">
    <div class="col-12 group-title">视频源文件夹</div>
    <div style="width: 415px">
      <q-input v-model="src_folders" outlined type="textarea" placeholder="输入媒体源文件夹, 每行一个"></q-input>
    </div>
    <div class="q-justify-end items-end" style="width: 160px">
      <q-btn push class="btn-blue" icon="mdi-content-save" label="保存" @click="saveSourceList" />
    </div>
  </div>
  <div class="row q-pa-md q-gutter-md">
    <div class="col-12 group-title">跳过片头片尾</div>
    <div class="number-input">
      <q-input v-model.number="play_position.start" type="number" outlined label="跳过片头(秒)" placeholder="此处为空表示禁用采集延迟">
        <template v-slot:prepend>
          <q-icon name="mdi-sort-clock-ascending"></q-icon>
        </template>
      </q-input>
    </div>
    <div class="number-input">
      <q-input v-model.number="play_position.end" type="number" outlined label="跳过片尾(秒)">
        <template v-slot:prepend>
          <q-icon name="mdi-sort-clock-descending"></q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-4 right">
      <q-btn push color="orange" icon="mdi-content-save" label="保存" @click="savePlayPosition" />
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
const play_position = ref<{ start: number; end: number }>({ start: 0, end: 0 });

function savePlayPosition() {
  if (typeof play_position.value.start !== 'number' || typeof play_position.value.end !== 'number') {
    notifyError($q, '请输入有效的数字');
    return;
  }
  const data = {
    start: play_position.value.start,
    end: play_position.value.end,
  };
  api.post('play/position/save', data).then((rsp) => {
    const rd = rsp.data;
    if (rd.error) {
      notifyError($q, rd.error);
    } else {
      notifyOk($q, '保存成功');
    }
  });
}

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
  api.post('play/position').then((rsp) => {
    play_position.value = rsp.data.play_position;
  });
}
onMounted(() => {
  reqSourceList();
});
</script>

<style scoped>
.number-input {
  width: 200px;
}
</style>
