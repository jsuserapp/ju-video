<template>
  <div class="page">
    <div class="title">{{ title }}</div>
    <div v-if="reload" class="video-container" :style="{ width: containerWidth + 'px', height: containerHeight + 'px' }">
      <video ref="videoPlayer" class="video-js vjs-fluid vjs-default-skin" data-setup='{"fluid": true}' controls preload="auto">
        <source :src="videoSrc" type="video/mp4" />
        <source :src="videoSrc" type="video/x-matroska" />
        <source :src="videoSrc" type="video/webm" />
        <source :src="videoSrc" type="video/ogg" />
        <!-- 如果浏览器不支持 -->
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>.
        </p>
      </video>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api, notifyError } from 'src/lib';
import { VideoInfo } from 'src/lib/types';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

let path = '' + route.params.path;
const hash = '' + route.params.hash;
const reload = ref(true);
const videoPlayer = ref(null);
const videoSrc = ref(`/video/${hash}/${encodeURIComponent(path)}`); // 替换为你的视频链接
const containerWidth = ref(1024);
const containerHeight = ref(768);
let player: Player | null = null;
const paths = path.split('\\');
const title = ref('');
const play_position = ref(0);
const items = ref<VideoInfo[]>([]);

function setTitle() {
  if (paths.length > 0) {
    title.value = paths[paths.length - 1]!;
  } else {
    title.value = '缺少视频';
  }
  document.title = title.value;
}
setTitle();
function initPlayer(fromNext: boolean) {
  player = videojs(videoPlayer.value!, {
    autoplay: true,
    controls: true,
    preload: 'auto',
  });
  player.on('play', () => {
    console.log('视频开始播放');
  });
  player.on('pause', () => {
    console.log('视频暂停');
  });
  player.on('ended', () => {
    console.log('视频播放结束');
    playNext();
  });
  player.ready(() => {
    if (!fromNext) {
      reqVideoPosition();
    }
    setVideoSize();
  });
}
function playNext() {
  const playIndex = items.value.findIndex((item) => item.name === title.value);
  if (playIndex === -1 || playIndex >= items.value.length - 1) {
    return;
  }
  const nextItem = items.value[playIndex + 1]!;
  videoSrc.value = `/video/${nextItem.hash}/${encodeURIComponent(nextItem.path)}`;
  const url = `/play/${nextItem.hash}/${encodeURIComponent(nextItem.path)}`;
  router.push(url);
  path = nextItem.path;
  title.value = nextItem.name;
  document.title = title.value;
  reload.value = false;
  setTimeout(() => {
    reload.value = true;
    setTimeout(() => {
      initPlayer(true);
    }, 1000);
  }, 1000);
}
function setVideoSize() {
  const inter = setInterval(() => {
    const videoWidth = player?.videoWidth(); // 获取视频的原始宽度
    const videoHeight = player?.videoHeight(); // 获取视频的原始高度
    if (videoHeight && videoWidth) {
      clearInterval(inter);
      const whr = videoWidth / videoHeight;
      let maxContH = window.innerHeight - 120;
      let maxContW = window.innerWidth;
      if (maxContW / maxContH > whr) {
        maxContW = maxContH * whr;
      } else {
        maxContH = maxContW / whr;
      }
      containerWidth.value = maxContW;
      containerHeight.value = maxContH;
    }
  }, 50);
}
function reqVideoPosition() {
  api.post('video/position', { hash: hash, path: path }).then((rsp) => {
    const rd = rsp.data;
    if (rd.error) {
      notifyError($q, rd.error);
    } else {
      console.log(rd.position);
      player?.currentTime(rd.position || 0);
    }
  });
}
function reqVideoPositionSave() {
  const postion = player?.currentTime() || 0;
  if (postion === play_position.value) {
    return;
  }
  play_position.value = postion;
  const data = { hash: route.params.hash, path: path, position: postion };
  navigator.sendBeacon('/api/video/position/save', JSON.stringify(data));
}
function reqVideoList() {
  const pos = path.lastIndexOf('\\');
  let parent = '';
  if (pos !== -1) {
    parent = path.substring(0, pos);
  }
  api.post('video/list', { hash: hash, path: parent }).then((rsp) => {
    const rd = rsp.data;
    if (rd.error) {
      notifyError($q, rd.error);
    } else if (rd.video_list) {
      rd.video_list
        .filter((video: VideoInfo) => {
          return !(video.name.startsWith('.') && !video.is_dir);
        })
        .forEach((video: VideoInfo) => {
          items.value.push(video);
        });
    }
  });
}

const updateHeight = () => {
  setVideoSize();
};
onMounted(() => {
  reqVideoList();
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('resize', updateHeight);
  initPlayer(false);
  updateHeight();
});
const handleBeforeUnload = () => {
  reqVideoPositionSave();
};
onBeforeUnmount(() => {
  if (player) {
    player.dispose();
    player = null;
  }
  window.removeEventListener('resize', updateHeight);
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>
<style>
body {
  background-image: url('/image/bg.jpg');
  background-color: black;
  background-repeat: no-repeat; /* 确保图像不重复 */
  background-size: cover; /* 图像铺满容器 */
  background-position: center; /* 居中对齐图像 */
}
</style>
<style scoped>
.page {
  min-height: 100%;
}
.title {
  text-align: center;
  font-size: 32px;
  padding: 10px 0;
  color: rgb(8, 175, 235);
}
.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
.video-js {
  height: 100%;
}
</style>
