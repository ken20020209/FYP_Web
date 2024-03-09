<style>
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto;
  padding: 10px;
}
.grid-item {
  padding: 20px;
  text-align: center;
  border: 1px solid black;
}

</style>
<template>
    <h1>getDogList</h1>
    <button v-on:click="getDogList()">getDogList</button>
    <p>{{ dogList }}</p>
    <div class="grid-container">
      <template v-for="dogRos in dogListRos" >
          <controller :ros=dogRos[0] :name=dogRos[1] :domainID=dogRos[2] class="grid-item"></controller>
      </template>
    </div>
  
  </template>
  <script setup>
  import ROSLIB from "roslib";
  import { DogConnector } from "../robotDog/Connector.js";
  import controller from './controller.vue';
  import { ref } from "vue";
  
  
  // const ros = new ROSLIB.Ros({ url: "ws://localhost:9090" });
  const props= defineProps(['ros']);
  const dogConnector = new DogConnector(props.ros);
  const dogList=ref(dogConnector.dogList);
  const dogListRos=ref([]);
  
  // use display two more view for each dog that use for debug
  // dogListRos.value.push([new ROSLIB.Ros({ url: "ws://localhost:9090" }),"test"])
  // dogListRos.value.push([new ROSLIB.Ros({ url: "ws://localhost:9090" }),"test2"])
  // dogListRos.value.push([new ROSLIB.Ros({ url: "ws://localhost:9090" }),"test3"])

  const getDogList = () => {
  
    //get dogList from connector server
    //use callback function to get result getDogList(callback)
    dogConnector.getDogList(
        (result)=>
        {
            // console.log(result);
            dogList.value=result;
            
            //clear dogListRos
            dogListRos.value=[];

            //create dogListRos
            for (let i = 0; i < result.dog_ids.length; i++) {
                //create ros connection for each dog
                const host=import.meta.env.VITE_HOST;
                const url= "ws://"+host+":"+result.ports[i];
                
                
                let ros=new ROSLIB.Ros({ url: url });
                let name=result.dog_ids[i];
                let domainID=result.domain_ids[i];
                let type = result.types[i];
                
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
                dogListRos.value.push([ros,name,domainID]);
            }
        }
    );

  };
  
  </script>
  