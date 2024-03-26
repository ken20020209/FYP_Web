<script setup lang="ts">
import type { Controller } from '@/robot/Controller';

interface Props {
  controller: Controller;
}
const props = defineProps<Props>();
const { controller } = props;

const { movement } = controller;
const move_forward = () => movement.move_forward();
const move_backward = () => movement.move_backward();
const move_left = () => movement.move_left();
const move_right = () => movement.move_right();
const stop = () => movement.stop();
const turn_left = () => movement.turn_left();
const turn_right = () => movement.turn_right();
</script>

<template>
  <NCard title="Momvent">
    <NFlex vertical>
      <NFlex justify="">
        <NFlex><NButton type="info" @click="turn_left">Trun Left</NButton></NFlex>
        <NFlex><NButton type="info" @click="move_forward">Forward</NButton></NFlex>
        <NFlex><NButton type="info" @click="turn_right">Trun Right</NButton></NFlex>
      </NFlex>
      <NFlex justify="space-between">
        <NFlex><NButton type="info" @click="move_left">Left</NButton></NFlex>
        <!-- <NFlex><NButton type="info" hidden>Return</NButton></NFlex> -->
        <NFlex><NButton type="info" @click="move_right">Right</NButton></NFlex>
      </NFlex>
      <NFlex justify="space-between">
        <div></div>
        <NFlex><NButton type="info" @click="move_backward">Back</NButton></NFlex>
        <div></div>
      </NFlex>
      <NButton type="error" @click="stop">Stop</NButton>
    </NFlex>
  </NCard>
</template>

<style scoped></style>
