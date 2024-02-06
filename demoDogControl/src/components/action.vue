<template>
    <h1>Action</h1>
    <button v-for="action in Object.keys(actionController.actionList)" v-on:click="actionController.actionList[action]()"> {{action}} </button>
  
  </template>
  <script setup>
  import ROSLIB from "roslib";
  import { Action } from "../robotDog/DogController.js";
  
   
  // const ros = new ROSLIB.Ros({ url: "ws://localhost:9090" });
  const ros= defineProps(['ros']);
  const actionController = new Action(ros.ros);
  
  </script>
  