<template>
    <h1>Map</h1>
    <div id="map2d"></div>
</template>
<script setup>

import { ref, onMounted } from 'vue';
import * as ROS2D from "@ken20020209/ros2d";

const controller= defineProps(['controller']);
const ros= controller.controller.ros;


const init=()=>{
  const viewer=new ROS2D.Viewer({
    divID: 'map2d',
    width: 640,
    height: 480
  });
  // Setup the map client.
  var gridClient = new ROS2D.OccupancyGridClient({
      ros : ros,
      rootObject : viewer.scene
    });
    // Scale the canvas to fit to the map
  gridClient.on('change', function() {
    viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
    viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
  });
  
}


onMounted(() => {
  init();
});

</script>
