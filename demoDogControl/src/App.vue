<script setup>
import controller from './components/controller.vue';
import connector from './components/connector.vue';

import { ref } from "vue";

import ROSLIB from "roslib";

// use env variable to get ip address
// console.log(import.meta.env.VITE_HOST);
const host=import.meta.env.VITE_HOST;
const url= "ws://"+host+":9090";

const page = ref(0);

//main ros connection that connects connector server
const ros = new ROSLIB.Ros({ url: url });
const useController = ref(true);
const useConnector = ref(false);

ros.on("connection", () => {
    console.log("Connected to websocket server.");
  });
  ros.on("error", (error) => {
    console.log("Error connecting to websocket server: ", error);
  });
  ros.on("close", () => {
    console.log("Connection to websocket server closed.");
  });




</script>
<template>
  <main>
    <!-- click button switch below two mode -->
    <!-- <button v-on:click="useController=!useController;useConnector=!useConnector">Switch use Controller or use Connector</button> -->
    <button v-on:click="page=0">None</button>
    <button v-on:click="page=1">Controller</button>
    <button v-on:click="page=2">Connector</button>

    <!-- for direct connect controller server demo-->
    <!-- it use ip address on js  -->
    <controller :ros=ros  v-if="page==1"></controller>
  
    <!-- for direct connect connector server -->
    <!-- it use ip address on js that connect to connector server  -->
    <!-- the connector server get dog list port  -->
    <!-- then create each dog ros connection -->
    <connector :ros=ros v-if="page==2"></connector>

  </main>
</template>
