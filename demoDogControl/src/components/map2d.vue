<template>
  <h1>Map</h1>
  <div v-bind:id="name"></div>
  <!-- <p>{{ msg}}</p> -->
  <p>
    center x:<input type="number" min="0" max="600" step="1" v-model="centerX" />
    center y:<input type="number" min="0" max="500" step="1" v-model="centerY" />
  </p>
  <p>
    scale:<input type="number" min="0" max="10" step="0.1" v-model="zoomScale" />
    <button @click="zoom">scale center</button>
  </p>
</template>
<script setup>

import { ref, onMounted } from 'vue';
import ROSLIB from "roslib";
import * as ROS2D from "ros2d";

const controller = defineProps(['controller']);
const ros = controller.controller.ros;
const msg = ref('');

const name=ref(controller.controller.name);
var zoomView;
const init = () => {
  // const map2d = new ROSLIB.Topic({
  //   ros: ros,
  //   name: '/map',
  //   messageType: 'nav_msgs/msg/OccupancyGrid',
  // });

  // map2d.subscribe(function (message) {
  //   console.log('Received message on ');
  //   console.log(message);
  //   msg.value = message;
  // });
  var viewer = new ROS2D.Viewer({
    divID: name.value,
    width: 600,
    height: 500
  });
  var gridClient = new ROS2D.OccupancyGridClient({
    ros: ros,
    rootObject: viewer.scene,
    continuous: true
  });
  // Scale the canvas to fit to the map
  gridClient.on('change', function () {
    viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
    viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
  });
  zoomView = new ROS2D.ZoomView({
    rootObject: viewer.scene
  });
  // zoomView.startZoom(300,250);
  // zoomView.zoom(2);
}
const zoomScale=ref(1);
const centerX=ref(300);
const centerY=ref(250);
const zoom=()=>{
  // console.log(zoomScale.value);
  zoomView.startZoom(300,250);
  zoomView.zoom(zoomScale.value);
}

onMounted(() => {
  init();
});

</script>
