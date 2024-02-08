<template>
    <h1>Map</h1>
    <div id="map2d"></div>
</template>
<script setup>

import { ref, onMounted } from 'vue';
import {ROS2D} from "/node_modules/ros2d/build/ros2d";

const controller= defineProps(['controller']);
const ros= controller.controller.ros;

const viewer=ROS2D.Viewer({
  divID: 'map',
  width: 640,
  height: 480
});

// const controller= defineProps(['controller']);
// const movement = controller.controller.movement;

</script>
