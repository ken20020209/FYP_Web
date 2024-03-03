<script setup>
    import { ref } from 'vue';
    const props= defineProps(['controller']);
    const navigation = props.controller.navigation;
    const x = ref(0);
    const y = ref(0);
    const poses=ref([]);
    const navToPoint = () => {
        let pose={
            position:{
                x: x.value,
                y: y.value,
                z: 0.0
            },
            orientation:{
                x: 0.0,
                y: 0.0,
                z: 0.0,
                w: 1.0
            }
        }
        navigation.goToPose(pose)
    }
    const followWaypoints = () => {
        let poses=[{
            position:{
                x: x.value,
                y: y.value,
                z: 0.0
            },
            orientation:{
                x: 0.0,
                y: 0.0,
                z: 0.0,
                w: 1.0
            }
        },
        {
            position:{
                x: x.value+1,
                y: y.value+1,
                z: 0.0
            },
            orientation:{
                x: 0.0,
                y: 0.0,
                z: 0.0,
                w: 1.0
            }
        },
        {
            position:{
                x: x.value+2,
                y: y.value+2,
                z: 0.0
            },
            orientation:{
                x: 0.0,
                y: 0.0,
                z: 0.0,
                w: 1.0
            }
        }
        ]
        navigation.followWaypoints(poses)
    }
</script>
<template>
    <h1>Navigation</h1>
    <p>Nav_to_pose</p>
    x:<input type="number" v-model="x">
    y:<input type="number" v-model="y">
    <button v-on:click="navToPoint()">nav to point</button>
    <p>FollowWaypoint</p>
    <button v-on:click="followWaypoints()">follow waypoint</button>
    <button v-on:click="navigation.cancelTask()">stop</button>
    <button v-on:click="navigation.setInitGoalPose({position:{x:-1.0,y:-0.5,z:0.0},orientation:{x:0.0,y:0.0,z:0.0,w:1.0}})">set init goal pose</button>

    
    
</template>