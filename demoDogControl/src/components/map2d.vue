<template>
    <h1>Map</h1>
    <div id="map2d"></div>
    <p>{{ msg}}</p>
</template>
<script setup>

import { ref, onMounted } from 'vue';
import ROSLIB from "roslib";

const controller= defineProps(['controller']);
const ros= controller.controller.ros;
const msg = ref('');

const init=()=>{
  const map2d =new ROSLIB.Topic({
    ros: ros,
    name: '/map',
    messageType : 'nav_msgs/msg/OccupancyGrid',
  });

  map2d.subscribe(function(message) {
    console.log('Received message on ');
    console.log(message);
    msg.value = message;
  });
  
}


onMounted(() => {
  init();
});

</script>
