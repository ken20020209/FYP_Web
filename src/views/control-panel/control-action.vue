<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { Controller } from '@/robot/Controller';

// const { curController } = useConnectorStore();

interface Props {
  controller: Controller;
}
const props = defineProps<Props>();

const { controller } = props;
const curController = controller;
const camera = ref<any>('/favicon.svg');

const actions = ref<any>([]);
onMounted(() => {
  curController?.camera.subCamCapture(0, (msg: { data: String }) => {
    camera.value = `data:image/jpeg;base64,${msg.data}`;
  });
  if (!curController) return;
  for (const action of Object.keys(curController?.action.actionList as any)) {
    actions.value.push(action);
  }

  // controller.camera.enableCamera(0);
});

const onAction = (action: string) => {
  // console.log(action);
  curController?.action.actionList[action]();
};

onUnmounted(() => {
  curController?.camera.unSubCamCapture(0);
});
</script>

<template>
  <NFlex>
    <NVirtualList :items="actions" :item-size="10" item-resizable>
      <template #default="{ item }">
        <div :key="item">
          <NButton type="info" @click="onAction(item)">{{ item }}</NButton>
        </div>
      </template>
    </NVirtualList>
  </NFlex>
</template>
