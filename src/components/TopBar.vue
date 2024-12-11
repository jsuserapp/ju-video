<template>
  <q-header bordered class="blur text-grey-8 q-py-xs" height-hint="58">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        @click="emits('show-left-menu', !show)"
        aria-label="Menu"
        icon="menu"
      />

      <q-btn flat @click="toHome">
        <img src="/image/logo.png" style="width: 32px" alt="Icon" />
        <span style="font-size: 18px; color: grey" class="text-weight-bold"
          >&nbsp;&nbsp;极优</span
        >
      </q-btn>
      <q-space />
      <q-space />

      <div class="q-gutter-sm row items-center no-wrap">
      </div>
    </q-toolbar>
  </q-header>
</template>
<script setup lang="ts">
import { api } from 'src/lib';
import { useQuasar } from 'quasar';
import { computed } from 'vue';

const emits = defineEmits(['show-left-menu']);
defineProps<{ show: boolean }>();

function toHome() {
  location.href = '/';
}
const $q = useQuasar();
</script>
<style scoped>
.blur {
  background-color: #0000001a;
  -webkit-backdrop-filter: blur(7px);
  backdrop-filter: blur(7px);
}
</style>
