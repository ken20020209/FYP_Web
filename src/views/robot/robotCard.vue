<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import type { Controller } from '@/robot/Controller';

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
</script>

<template>
  <NCard :title="controller.name">
    <NSpace justify="center">
      <NImage :src="camera" width="100%"></NImage>
    </NSpace>
    <NSpace>
      <NDropdown trigger="hover" :options="streamEffects" @select="handleSelectEffect">
        <NButton>{{ curStreamEffect }}</NButton>
      </NDropdown>
      <NButton @click="controller.camera.enableCamera(0)">On</NButton>
      <NButton @click="controller.camera.disableCamera(0)">Off</NButton>
    </NSpace>
  </NCard>
</template>
