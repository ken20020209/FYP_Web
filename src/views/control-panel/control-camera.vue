<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { Controller } from '@/robot/Controller';

interface Props {
  controller: Controller;
}
const props = defineProps<Props>();
const { controller } = props;
const life = 1;

interface StreamEffect {
  label: string;
  key: string;
}

const streamEffects = ref<StreamEffect[]>([
  { label: 'none', key: '0' },
  { label: 'detect', key: '1' },
  { label: 'classify', key: '2' },
  { label: 'pose', key: '3' },
  { label: 'segment', key: '4' }
]);
const curStreamEffect = ref<string>('effect1');

const cameraImage = ref<any>('/favicon.svg');
const cameraSwitch = ref<boolean>(false);
const cameraLife = ref<number>(life);
const cameraSwitchLoading = ref<boolean>(false);

controller.camera.subCamSetting(0, (msg: { data: number }) => {
  curStreamEffect.value = streamEffects.value[Number(msg.data)].label;
});
const handleSelectEffect = (key: string) => {
  // message.info(String(key));
  controller.camera.changeEffect(0, Number(key));
};
const handleCameraSwitch = () => {
  cameraSwitchLoading.value = true;
  if (cameraSwitch.value) {
    controller.camera.disableCamera(0);
  } else {
    controller.camera.enableCamera(0);
  }
};
// const timer = setInterval(() => {
//   cameraLife.value -= 0.5;
//   if (cameraLife.value < 0) {
//     // cameraImage.value = '/favicon.svg';
//     cameraSwitch.value = false;
//     cameraSwitchLoading.value = false;
//   }
// }, 500);
onMounted(() => {
  controller?.camera.subCamCapture(0, (msg: { data: String }) => {
    cameraImage.value = `data:image/jpeg;base64,${msg.data}`;
    cameraLife.value = life;
    cameraSwitch.value = true;
    cameraSwitchLoading.value = false;
  });
  controller.camera.getCameraStatus(0, (msg: { data: boolean }) => {
    cameraSwitch.value = msg.data;
    cameraSwitchLoading.value = false;
  });
  // controller.camera.enableCamera(0);
});

onUnmounted(() => {
  controller?.camera.unSubCamCapture(0);
  // clearInterval(timer);
});
</script>

<template>
  <NCard title="Camera">
    <NFlex>
      <NDropdown trigger="hover" :options="streamEffects" @select="handleSelectEffect">
        <NButton>{{ curStreamEffect }}</NButton>
      </NDropdown>
      <NSwitch :value="cameraSwitch" :loading="cameraSwitchLoading" @update:value="handleCameraSwitch"></NSwitch>
    </NFlex>
    <NImage :src="cameraImage" width="100%" />
  </NCard>
</template>
