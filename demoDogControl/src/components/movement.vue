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

const controller= defineProps(['controller']);
const movement = controller.controller.movement;

</script>
