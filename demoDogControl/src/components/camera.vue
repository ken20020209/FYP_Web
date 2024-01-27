<template>
    <h1>camera</h1>
    <img :src="cam"/>
  
  </template>
  <script setup>
  import ROSLIB from "roslib";
  import { Camera } from "../robotDog/DogController.js";
  import {ref} from 'vue';
  
  const ros = new ROSLIB.Ros({ url: "ws://localhost:9090" });
  const camera = new Camera(ros);
  const cam=ref(null);

  cam.value="/favicon.ico";
  camera.subCamCapture(0,(msg)=>{
    // console.log(msg);
    cam.value = 'data:image/jpeg;base64,' + msg.data;
  });
  
  </script>
  