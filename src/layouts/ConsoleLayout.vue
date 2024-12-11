<template>
  <q-layout view="hHh LpR fFf" class="window-height">
    <q-ajax-bar position="top" color="green" />
    <TopBar
      @show-left-menu="showLeftMenu"
      v-bind:show="show_left_menu"
    ></TopBar>
    <LeftMenu v-bind:show="show_left_menu"></LeftMenu>
    <q-page-container class="full-height">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LeftMenu from 'components/LeftMenu.vue';
import TopBar from 'components/TopBar.vue';

document.title = '控制台';
const show_left_menu = ref(true);
function showLeftMenu(show: boolean) {
  show_left_menu.value = show;
}
</script>
<style scoped>
.q-page-container {
  background-color: #ffffff;
}
</style>
