<template>
  <div class="video-src">
    <q-icon :name="data.is_dir ? 'mdi-folder-play' : 'mdi-movie-open'" size="100px" class="icon-large" :color="data.is_dir ? 'orange' : 'green'"></q-icon>
    <div class="text-name">{{ data.name }}</div>
    <div v-if="!data.is_dir" class="text-name file-size">{{ fileSize(data.size) }}</div>
  </div>
</template>

<script setup lang="ts">
import { VideoInfo } from 'src/lib/types';
import { computed } from 'vue';

defineProps<{
  data: VideoInfo;
}>();

const fileSize = computed(() => (size: number) => {
  const units = ['字节','KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  const formattedSize = parseFloat(size.toFixed(2));
  return `${formattedSize} ${units[unitIndex]}`;
});
</script>

<style scoped lang="scss">
.video-src {
  color: $primary;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  width: 200px;
  text-align: center;
  cursor: pointer;
}

.text-name {
  display: block;
  margin-top: 5px;
  word-break: break-all;
}
.file-size{
  color: grey;
}
</style>
