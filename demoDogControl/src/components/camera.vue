<template>
    <h1>camera</h1>
    effect:<input type="number" min="0" max="100" v-model="effect"/>
    <button @click="camera.setEffect(0,effect)">setEffect</button>
    <br>camera:
    <button @click="camera.enableCamera()">on</button>
    <button @click="camera.disableCamera()">off</button>
    <br>
    <img :src="cam"/>

  
  </template>
  <script setup>

  import {ref} from 'vue';

  const props= defineProps(['controller']);
  const camera = props.controller.camera;
  const cam=ref(null);
  const effect=ref(0);

  cam.value="/favicon.ico";
  camera.subCamCapture(0,(msg)=>{
    // console.log(msg);
    cam.value = 'data:image/jpeg;base64,' + msg.data;
  });
  
  </script>
  