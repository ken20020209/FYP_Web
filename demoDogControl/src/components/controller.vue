<template>
    <main>
      <!-- for direct connect controller server -->
      <movement :controller=controller></movement>
      <camera :controller=controller></camera>
      <action :controller=controller></action>
      <map2d :controller=controller></map2d>
      <navigationServer :controller=controller></navigationServer>
      <vncRviz :controller=controller></vncRviz>
      
    </main>
</template>
<script setup>
import movement from './movement.vue';
import camera from './camera.vue';
import action from './action.vue';
import map2d from './map2d.vue';
import navigationServer from './navigationServer.vue';
import vncRviz from './vncRviz.vue';
import { Controller } from '../robotDog';

const props= defineProps(['ros','name']);
// console.log(props.ros);
const controller = new Controller(props.ros,props.name);

</script>
