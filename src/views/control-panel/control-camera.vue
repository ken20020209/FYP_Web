<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { Controller } from '@/robot/Controller';

interface Props {
  controller: Controller;
}
const props = defineProps<Props>();
const { controller } = props;

const camera = ref<any>('/favicon.svg');

onMounted(() => {
  controller?.camera.subCamCapture(0, (msg: { data: String }) => {
    camera.value = `data:image/jpeg;base64,${msg.data}`;
  });

  // controller.camera.enableCamera(0);
});

onUnmounted(() => {
  controller?.camera.unSubCamCapture(0);
});
</script>

<template>
  <NImage :src="camera" width="100%" />
</template>
