<template>
    <main>
      <!-- for direct connect controller server -->
      <movement :controller=controller></movement>
      <camera :controller=controller></camera>
      <action :controller=controller></action>
      <map2d :controller=controller></map2d>
      <navigation :controller=controller></navigation>
      
    </main>
</template>
<script setup>
import movement from './movement.vue';
import camera from './camera.vue';
import action from './action.vue';
import map2d from './map2d.vue';
import navigation from './navigation.vue';
import { Controller } from '../robotDog';

const ros= defineProps(['ros']);
const controller = new Controller(ros.ros);

</script>
