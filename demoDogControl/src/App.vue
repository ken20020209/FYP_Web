<script setup>
import movement from './components/movement.vue';
import camera from './components/camera.vue';
import action from './components/action.vue';
import dogConnector from './components/dogConnector.vue';

import ROSLIB from "roslib";


//main ros connection that connects connector server
const ros = new ROSLIB.Ros({ url: "ws://localhost:9090" });
ros.on("connection", () => {
    console.log("Connected to websocket server.");
  });
  ros.on("error", (error) => {
    console.log("Error connecting to websocket server: ", error);
  });
  ros.on("close", () => {
    console.log("Connection to websocket server closed.");
  });
// console.log(ros);

</script>

<template>
  <main>
    <!-- for direct connect controller server -->
    <movement :ros=ros></movement>
    <camera :ros=ros></camera>
    <action :ros=ros></action>

    <!-- for direct connect connector server -->
    <dogConnector :ros=ros></dogConnector>

  </main>
</template>
