<script setup lang="ts">
import { useConnectorStore } from '@/store/modules/robot';
import RobotCard from './robotCard.vue';
// useConnectorStore();

const { controllers } = useConnectorStore();
</script>

<template>
  <div>
    <NGrid :x-gap="24" :cols="4" item-responsive responsive="screen">
      <template v-for="controller in controllers" :key="controller.name">
        <NGridItem span="4 m:2 l:1">
          <RobotCard :controller="controller" />
        </NGridItem>
      </template>
    </NGrid>
    <NCard>
      <NH1 v-if="Object.keys(controllers).length === 0">Robot Not Found</NH1>
    </NCard>
  </div>
</template>

<style scoped></style>
