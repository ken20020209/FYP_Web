<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useConnectorStore } from '@/store/modules/robot';
import Movement from './control-movement.vue';
import VucRviz from './control-vncRviz.vue';
import Action from './control-action.vue';
import Camera from './control-camera.vue';
import Navigation from './control-navigation.vue';

const { curController } = useConnectorStore();

onMounted(() => {});

onUnmounted(() => {});
</script>

<template>
  <div v-if="curController">
    <NCard>
      <NH1>
        {{ curController?.name }}
      </NH1>
    </NCard>
    <NCard>
      <NFlex justify="space-between">
        <NFlex justify="space-between" vertical>
          <NButton type="error">Return</NButton>
          <NButton>Oops!</NButton>
          <Movement :controller="curController"></Movement>
        </NFlex>
        <NFlex justify="space-between" vertical>
          <NH1>{{ curController?.name }}</NH1>
          <Camera :controller="curController"></Camera>
          <NInput type="text"></NInput>
        </NFlex>
        <NFlex justify="space-between" vertical>
          <NButton>Oops!</NButton>
          <Action :controller="curController"></Action>
          <NButton>Oops!</NButton>
        </NFlex>
      </NFlex>
    </NCard>
    <Ncard>
      <Navigation :controller="curController"></Navigation>
    </Ncard>
    <Ncard>
      <VucRviz :controller="curController"></VucRviz>
    </Ncard>
  </div>
  <div v-else>
    <NCard>
      <NH1>Not Connected</NH1>
    </NCard>
  </div>
</template>
