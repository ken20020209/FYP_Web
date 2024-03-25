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
// console.log(props.controller);

const streamEffects = ref<StreamEffect[]>([
  { label: 'Effect 1', key: 'effect1' },
  { label: 'Effect 2', key: 'effect2' },
  { label: 'Effect 3', key: 'effect3' }
]);
const curStreamEffect = ref<string>('effect1');

const camera = ref<any>('/favicon.svg');
const message = useMessage();
const handleSelectEffect = (key: string) => {
  curStreamEffect.value = key;
  message.info(String(key));
};

onMounted(() => {
  controller.camera.subCamCapture(0, (msg: { data: String }) => {
    camera.value = `data:image/jpeg;base64,${msg.data}`;
  });
  // controller.camera.enableCamera(0);
});

onUnmounted(() => {
  controller.camera.unSubCamCapture(0);
});

const cardOnClick = () => {
  message.info('Card clicked');
  // router to control-panel.vue page params controller
  useConnectorStore().setCurController(controller);
  router.push({ name: 'control-panel' });
};
const btnOn = () => {
  controller.camera.enableCamera(0);
};
const btnOff = () => {
  controller.camera.disableCamera(0);
};
</script>

<template>
  <NCard @click="cardOnClick">
    <template #header>
      {{ controller.name }}
    </template>
    <template #default>
      <img :src="camera" />
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
            <NButton type="success" @click="btnOn">On</NButton>
            <NButton type="error" @click="btnOff">Off</NButton>
          </NFlex>
        </NFlex>
      </div>
    </template>
  </NCard>
</template>
