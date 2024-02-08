<template>
    <h1>getDogList</h1>
    <button v-on:click="getDogList()">getDogList</button>
    <p>{{ dogList }}</p>

    <template v-for="dogRos in dogListRos">
        <controller :ros=dogRos></controller>
    </template>
  
  </template>
  <script setup>
  import ROSLIB from "roslib";
  import { DogConnector } from "../robotDog/Connector.js";
  import controller from './controller.vue';
  import { ref } from "vue";
  
  
  // const ros = new ROSLIB.Ros({ url: "ws://localhost:9090" });
  const rosConnector= defineProps(['ros']);
  const dogConnector = new DogConnector(rosConnector.ros);
  const dogList=ref(dogConnector.dogList);
  const dogListRos=ref([]);

  const getDogList = () => {
  
    //get dogList from connector server
    //use callback function to get result getDogList(callback)
    dogConnector.getDogList(
        (result)=>
        {
            console.log(result);
            dogList.value=result;
            
            //clear dogListRos
            dogListRos.value=[];

            //create dogListRos
            for (let i = 0; i < result.dog_ids.length; i++) {
                //create ros connection for each dog
                let ros=new ROSLIB.Ros({ url: "ws://localhost:"+result.ports[i] });
                ros.on("connection", () => {
                  console.log("Connected to websocket server.");
                });
                ros.on("error", (error) => {
                  console.log("Error connecting to websocket server: ", error);
                });
                ros.on("close", () => {
                  console.log("Connection to websocket server closed.");
                });

                //add ros connection to dogListRos
                dogListRos.value.push(ros);
            }
            
        }
    );

  };
  
  </script>
  