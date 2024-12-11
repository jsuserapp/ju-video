<template>
  <q-item v-ripple clickable :active="useRouter().currentRoute.value.fullPath.startsWith(link)" tag="a" target="_self" :to="link">
    <q-item-section avatar>
      <q-icon v-if="icon" :name="icon"></q-icon>
      <q-icon v-else :name="'img:/svg/' + svg + '.svg'" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
export interface MenuItemProps {
  title: string;
  link?: string;
  svg?: string;
  icon?: string;
}
withDefaults(defineProps<MenuItemProps>(), {
  title: '',
  link: '#',
  svg: '',
  icon: '',
});
</script>
<style></style>
