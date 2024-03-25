<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useConnectorStore } from '@/store/modules/robot';

const { curController } = useConnectorStore();

const camera = ref<any>('/favicon.svg');

const actions = ref<any>([]);
onMounted(() => {
  curController?.camera.subCamCapture(0, (msg: { data: String }) => {
    camera.value = `data:image/jpeg;base64,${msg.data}`;
  });

  for (const action of Object.keys(curController?.action.actionList as any)) {
    actions.value.push(action);
  }

  // controller.camera.enableCamera(0);
});

onUnmounted(() => {
  curController?.camera.unSubCamCapture(0);
});
</script>

<template>
  <!--
 <NCard size="huge">
    <template #header>
      {{ curController?.name }}
    </template>
    <template #default>
      <NImage :src="camera" />
    </template>
  </NCard>
-->
  <NFlex justify="space-between">
    <NFlex justify="space-between" vertical>
      <NButton type="error">Return</NButton>
      <NButton>Oops!</NButton>
      <NButton>Oops!</NButton>
    </NFlex>
    <NFlex justify="space-between" vertical>
      <NH1>{{ curController?.name }}</NH1>
      <NImage :src="camera" width="100%" />
      <NInput type="text"></NInput>
    </NFlex>
    <NFlex justify="space-between" vertical>
      <NButton>Oops!</NButton>
      <NFlex>
        <NVirtualList :items="actions" :item-size="20" item-resizable>
          <template #default="{ item }">
            <div :key="item">
              <NButton>{{ item }}</NButton>
            </div>
          </template>
        </NVirtualList>
      </NFlex>
      <NButton>Oops!</NButton>
    </NFlex>
  </NFlex>
</template>
