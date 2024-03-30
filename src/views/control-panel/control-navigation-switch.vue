<script setup lang="ts">
import { ref } from 'vue';
import type { Controller } from '@/robot/Controller';

interface Props {
  controller: Controller;
}

const props = defineProps<Props>();
const { controller } = props;

const navigation = controller.navigation;

const isTaskCompleted = ref(false);
const feedback = ref('');
navigation.isTaskComplete((msg: { data: boolean }) => {
  isTaskCompleted.value = msg.data;
});
navigation.onFeedback((msg: { data: string }) => {
  feedback.value = msg.data;
});

const start_stop_message = ref('none');
const navi_on = ref(false);
const slam_on = ref(false);
controller.setNavigationCallback = (msg: { result: string }) => {
  start_stop_message.value = msg.result;
};
controller.setSlamCallback = msg => {
  start_stop_message.value = msg.result;
};
controller.navigation_on_sub.subscribe((msg: any) => {
  navi_on.value = msg.data;
});
controller.slam_on_sub.subscribe((msg: any) => {
  slam_on.value = msg.data;
});

const handleSlamSwitch = () => {
  if (slam_on.value) {
    controller.stopSlam();
  } else {
    controller.startSlam();
  }
};
const handleNaviSwitch = () => {
  if (navi_on.value) {
    controller.stopNavigation();
  } else {
    controller.startNavigation();
  }
};
</script>

<template>
  <NCard title="Navigation Switch">
    <NFlex vertical>
      <!-- start nav -->
      <NH1 v-show="!slam_on">
        Start Navigation
        <NSwitch :value="navi_on" size="large" :disabled="slam_on" @update:value="handleNaviSwitch"></NSwitch>
      </NH1>
      <!-- start slam -->
      <NH1 v-show="!navi_on">
        Start SLAM
        <NSwitch :value="slam_on" size="large" :disabled="navi_on" @update:value="handleSlamSwitch"></NSwitch>
      </NH1>
      <NH1>
        feedback
        <NInput :value="start_stop_message"></NInput>
      </NH1>
    </NFlex>
  </NCard>
</template>
