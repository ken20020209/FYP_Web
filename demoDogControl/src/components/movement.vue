<template>
  <h1>movement</h1>
  <button v-on:click="movement.move_forward()">Forward</button>
    <button v-on:click="movement.move_backward()">Backward</button>
    <button v-on:click="movement.move_left()">Left</button>
    <button v-on:click="movement.move_right()">Right</button>
    <button v-on:click="movement.turn_left()">Turn Left</button>
    <button v-on:click="movement.turn_right()">Turn Right</button>
    <button v-on:click="movement.stop()">Stop</button>

</template>
<script setup>
import ROSLIB from "roslib";
import { Movement } from "../robotDog/DogController.js";

const ros = new ROSLIB.Ros({ url: "ws://localhost:9090" });
const movement = new Movement(ros);

</script>
