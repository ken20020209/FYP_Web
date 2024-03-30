<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { onMounted, onUnmounted, ref } from 'vue';
import type { Controller } from '@/robot/Controller';
import { router } from '@/router';
import { useConnectorStore } from '@/store/modules/robot';

interface Props {
  controller: Controller;
}
const props = defineProps<Props>();
const { controller } = props;
interface StreamEffect {
  label: string;
  key: string;
}
const life = 1;
const streamEffects = ref<StreamEffect[]>([
  { label: 'Effect 1', key: 'effect1' },
  { label: 'Effect 2', key: 'effect2' },
  { label: 'Effect 3', key: 'effect3' }
]);
const curStreamEffect = ref<string>('effect1');

const cameraImage = ref<any>('/favicon.svg');
const cameraSwitch = ref<boolean>(false);
const cameraLife = ref<number>(life);
const cameraSwitchLoading = ref<boolean>(false);

const message = useMessage();
const handleSelectEffect = (key: string) => {
  curStreamEffect.value = key;
  message.info(String(key));
};
const handleCameraSwitch = () => {
  cameraSwitchLoading.value = true;
  if (cameraSwitch.value) {
    controller.camera.disableCamera(0);
  } else {
    controller.camera.enableCamera(0);
  }
};
const timer = setInterval(() => {
  cameraLife.value -= 0.5;
  if (cameraLife.value < 0) {
    // cameraImage.value = '/favicon.svg';
    cameraSwitch.value = false;
    cameraSwitchLoading.value = false;
  }
}, 500);
onMounted(() => {
  controller.camera.subCamCapture(0, (msg: { data: String }) => {
    cameraImage.value = `data:image/jpeg;base64,${msg.data}`;
    cameraLife.value = life;
    cameraSwitch.value = true;
    cameraSwitchLoading.value = false;
  });
  // controller.camera.enableCamera(0);
});

onUnmounted(() => {
  controller.camera.unSubCamCapture(0);
  clearInterval(timer);
});

const cardOnClick = () => {
  message.info('Card clicked');
  // router to control-panel.vue page params controller
  useConnectorStore().setCurController(controller);
  router.push({ name: 'control-panel' });
};
</script>

<template>
  <NCard @click="cardOnClick">
    <template #header>
      {{ controller.name }}
    </template>
    <template #default>
      <img :src="cameraImage" />
    </template>

    <template #action>
      <div
        @click="
          e => {
            e.stopPropagation();
          }
        "
      >
        <NFlex justify="space-between">
          <NDropdown trigger="hover" :options="streamEffects" @select="handleSelectEffect">
            <NButton>{{ curStreamEffect }}</NButton>
          </NDropdown>
          <NFlex>
            <NSwitch :value="cameraSwitch" :loading="cameraSwitchLoading" @update:value="handleCameraSwitch"></NSwitch>
          </NFlex>
        </NFlex>
      </div>
    </template>
  </NCard>
</template>
