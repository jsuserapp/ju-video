<template>
  <div class="row q-pa-md q-gutter-md">
    <q-btn v-for="(btn, i) in path_btns" :key="i" push :label="btn.name" color="orange" @click="selectPath(btn)" />
  </div>
  <div class="row q-pa-md q-gutter-md">
    <GroupVideo v-for="(vs, i) in items" :key="i" :data="vs" @click="selectItem(vs)"></GroupVideo>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api, notifyError } from 'src/lib';
import { onMounted, ref } from 'vue';
import { VideoInfo } from 'src/lib/types';
import GroupVideo from 'src/components/GroupVideo.vue';
import { useRouter } from 'vue-router';

interface BtnInfo {
  hash: string;
  path: string;
  name: string;
}

document.title = '视频列表';

const $q = useQuasar();
const router = useRouter();

const props = defineProps<{
  pathParams: string[];
}>();

const items = ref<VideoInfo[]>([]);
const root_btn = { path: '', name: '全部', hash: '' };
const path_btns = ref<BtnInfo[]>([root_btn]);

function selectPath(btn: BtnInfo) {
  reqVideoList(btn.hash, btn.path);
}
function selectItem(item: VideoInfo) {
  if (item.is_dir) {
    reqVideoList(item.hash, item.path);
  } else {
    const url = `/play/${item.hash}/${encodeURIComponent(item.path)}`;
    window.open(url, '_blank');
  }
}
function reqVideoList(hash: string, path: string) {
  api.post('video/list', { hash: hash, path: path }).then((rsp) => {
    const rd = rsp.data;
    if (rd.error) {
      notifyError($q, rd.error);
    } else if (rd.video_list) {
      path_btns.value = [{ hash: '', path: '', name: '全部' }];
      path.split('\\').forEach((p, i, arr) => {
        if (p === '') {
          return;
        } else {
          path_btns.value.push({ hash: hash, path: arr.slice(0, i + 1).join('\\'), name: p });
        }
      });
      let fullpath = '/home/' + hash;
      if (path !== '') {
        fullpath += '/' + encodeURIComponent(path);
      }
      router.push(fullpath);
      items.value = [];
      rd.video_list
        .filter((video: VideoInfo) => {
          return !(video.name.startsWith('.'));
        })
        .sort((a: VideoInfo, b: VideoInfo) => {
          return (b.is_dir ? 1 : 0) - (a.is_dir ? 1 : 0);
        })
        .forEach((video: VideoInfo) => {
          items.value.push(video);
        });
    }
  });
}
onMounted(() => {
  let hash = '';
  let path = '';
  if (props.pathParams.length > 0) {
    hash = props.pathParams[0]!;
  }
  if (props.pathParams.length > 1) {
    path = props.pathParams[1]!;
  }
  reqVideoList(hash, path);
});
</script>

<style scoped lang="scss">
$main-color: #0475bb;
.path-spliter {
  display: inline-block;
  color: $main-color;
  padding: 3px 6px;
}
.path-btn {
  display: inline-block;
  color: white;
  background-color: $main-color;
  margin: 2px 5px;
  cursor: pointer;
  padding: 3px 10px;
  border-radius: 5px;
}
</style>
