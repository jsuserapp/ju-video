<template>
  <q-drawer
    class="scrollable-div"
    transition-show="jump-down"
    transition-hide="jump-up"
    side="left"
    show-if-above
    bordered
    :modelValue="props.show"
    :width="300"
    :breakpoint="700"
  >
    <q-list style="color: #505050">
      <template v-for="(group, i) in menu_items" :key="i">
        <q-item-label header> {{ group.name }} </q-item-label>
        <MenuItem v-for="item in group.items" :key="item.title" v-bind="item" />
        <q-separator class="q-my-md" />
      </template>
    </q-list>
  </q-drawer>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import MenuItem from 'components/MenuItem.vue';

const props = defineProps<{ show: boolean }>();

const menu_items = ref([
  {
    name: '媒体',
    items: [{ title: '视频', icon: 'mdi-video-4k-box', link: '/home' }],
  },
  {
    name: '设置',
    items: [{ title: '设置', icon: 'mdi-cogs', link: '/settings' }],
  },
]);
</script>
