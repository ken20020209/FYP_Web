<template>
    <h1>camera</h1>
    <img :src="cam"/>
  
  </template>
  <script setup>

  import {ref} from 'vue';

  const controller= defineProps(['controller']);
  const camera = controller.controller.camera;
  const cam=ref(null);

  cam.value="/favicon.ico";
  camera.subCamCapture(0,(msg)=>{
    // console.log(msg);
    cam.value = 'data:image/jpeg;base64,' + msg.data;
  });
  
  </script>
  