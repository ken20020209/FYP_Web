<script setup lang="ts">
import { ref } from 'vue';
import type { Controller } from '@/robot/Controller';
import { fetchMaps } from '@/service/api';

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
const isLoading = ref(false);
controller.setNavigationCallback = (msg: { result: string }) => {
  start_stop_message.value = msg.result;
  isLoading.value = false;
};
controller.setSlamCallback = msg => {
  start_stop_message.value = msg.result;
  isLoading.value = false;
};
controller.navigation_on_sub.subscribe((msg: any) => {
  navi_on.value = msg.data;
});
controller.slam_on_sub.subscribe((msg: any) => {
  slam_on.value = msg.data;
});

const handleSlamSwitch = () => {
  isLoading.value = true;
  if (slam_on.value) {
    window.$message?.success('Stopping SLAM');
    controller.stopSlam();
  } else {
    window.$message?.success('Starting SLAM');
    controller.startSlam();
  }
};
const mapName = ref('');
const handleNaviSwitch = async () => {
  isLoading.value = true;
  if (navi_on.value) {
    window.$message?.success('Stopping navigation');
    controller.stopNavigation();
  } else {
    // check map is vaild
    const { data } = await fetchMaps();
    if (!data) {
      window.$message?.error('No map available');
      return;
    }
    let isValid = false;
    data.forEach((element: Api.Map) => {
      if (element.name === mapName.value) {
        isValid = true;
      }
    });
    if (!isValid) {
      window.$message?.error('Map not found');
      return;
    }
    window.$message?.success(`Starting navigation: ${mapName.value}`);
    controller.startNavigation(mapName.value);
  }
};
</script>

<template>
  <NCard title="Navigation Switch">
    <NFlex vertical>
      <!-- start nav -->
      <NH1 v-show="!slam_on">
        Start Navigation
        <NSwitch
          :value="navi_on"
          size="large"
          :disabled="slam_on"
          :loading="isLoading"
          @update:value="handleNaviSwitch"
        ></NSwitch>
        <NForm label-placement="left">
          <NFormItem label="map name">
            <NInput v-show="!navi_on" v-model:value="mapName" placeholder="Map Name"></NInput>
          </NFormItem>
        </NForm>
      </NH1>
      <!-- start slam -->
      <NH1 v-show="!navi_on">
        Start SLAM
        <NSwitch
          :value="slam_on"
          size="large"
          :disabled="navi_on"
          :loading="isLoading"
          @update:value="handleSlamSwitch"
        ></NSwitch>
      </NH1>
      <NH1>
        feedback
        <NInput :value="start_stop_message"></NInput>
      </NH1>
    </NFlex>
  </NCard>
</template>
