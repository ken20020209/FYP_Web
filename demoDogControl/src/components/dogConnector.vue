<template>
    <h1>getDogList</h1>
    <button v-on:click="getDogList()">getDogList</button>
    <p>{{ dogList }}</p>
  
  </template>
  <script setup>
  import ROSLIB from "roslib";
  import { DogConnector } from "../robotDog/DogConnector.js";
  import { ref } from "vue";
  
  const ros = new ROSLIB.Ros({ url: "ws://localhost:9090" });
  const dogConnector = new DogConnector(ros);
  const dogList=ref(dogConnector.dogList);

  const getDogList = () => {
    dogConnector.getDogList();
    dogList.value = dogConnector.dogList;
  };
  
  </script>
  