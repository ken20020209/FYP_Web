<script setup lang="ts">
import { ref } from 'vue';
import type { Controller } from '@/robot/Controller';

interface Props {
  controller: Controller;
}

interface Pose2D {
  x: number;
  y: number;
  yaw: number;
}
const props = defineProps<Props>();
const { controller } = props;

const navigation = controller.navigation;

const points = ref<Pose2D[]>([
  {
    x: 0,
    y: 0,
    yaw: 0
  },
  {
    x: 0,
    y: 0,
    yaw: 0
  }
]);
const isTaskCompleted = ref(false);
const feedback = ref('');
navigation.isTaskComplete((msg: { data: boolean }) => {
  isTaskCompleted.value = msg.data;
});
navigation.onFeedback((msg: { data: string }) => {
  feedback.value = msg.data;
});

const createPose2D = (point: Pose2D) => {
  return navigation.createPose2D(point.x, point.y, point.yaw);
};
const createPoses2D = (ppoints: Pose2D[]) => {
  const poses = [];
  for (let i = 0; i < ppoints.length; i += 1) {
    const pose = createPose2D(ppoints[i]);
    poses.push(pose);
  }
  return poses;
};
const moveToPoint = () => {
  const pose = createPose2D(points.value[0]);
  navigation.moveToPoint(pose);
};
const moveToPoints = () => {
  const poses = createPoses2D(points.value);
  // console.log(poses);
  navigation.moveToPoints(poses);
};
const patrolPoints = () => {
  const poses = createPoses2D(points.value);
  navigation.patrolPoints(poses);
};
const stopNavigation = () => {
  navigation.stopNavigation();
};
const addPoint = () => {
  points.value.push({
    x: 0,
    y: 0,
    yaw: 0
  });
};
const removePoint = () => {
  points.value.pop();
};
const clearPoints = () => {
  points.value = [];
};

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
</script>

<template>
  <NH1>Navigation</NH1>
  <NP>isTaskCompleted:{{ isTaskCompleted }}</NP>
  <NP>feedback:{{ feedback }}</NP>
  <NButton @click="moveToPoint">Move to frist point</NButton>
  <NButton @click="moveToPoints">Move to points</NButton>
  <NButton @click="patrolPoints">Patrol points</NButton>
  <NButton @click="stopNavigation">Stop navigation</NButton>
  <NButton @click="addPoint">Add point</NButton>
  <NButton @click="removePoint">Remove point</NButton>
  <NButton @click="clearPoints">Clear points</NButton>
  <NFlex v-for="point in points" :key="point.x">
    <NP>
      x:
      <input v-model="point.x" type="number" step="1" />
      y:
      <input v-model="point.y" type="number" step="1" />
      yaw:
      <input v-model="point.yaw" type="number" step="1" />
    </NP>
  </NFlex>

  <NFlex>
    <!-- start nav -->
    <NH1>Start Navigation ({{ navi_on }})</NH1>

    <NButton @click="controller.startNavigation()">Start Navigation</NButton>
    <NButton @click="controller.stopNavigation()">Stop Navigation</NButton>
    <!-- start slam -->
    <NH1>Start SLAM ({{ slam_on }})</NH1>
    <NButton @click="controller.startSlam()">Start SLAM</NButton>
    <NButton @click="controller.stopSlam()">Stop SLAM</NButton>
    <NH1>feedback</NH1>
    <p>{{ start_stop_message }}</p>
  </NFlex>
</template>
