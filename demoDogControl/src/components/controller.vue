<template>
    <main>
      <!-- for direct connect controller server -->
      <movement :controller=controller></movement>
      <camera :controller=controller></camera>
      <action :controller=controller></action>
  
    </main>
</template>
<script setup>
import movement from './movement.vue';
import camera from './camera.vue';
import action from './action.vue';
import { Controller } from '../robotDog/Controller';

const ros= defineProps(['ros']);
const controller = new Controller(ros.ros);

</script>
