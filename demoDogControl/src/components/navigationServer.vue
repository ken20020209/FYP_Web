<script setup>
    import { ref } from 'vue';
    const props= defineProps(['controller']);
    const navigation = props.controller.navigation;

    const points= ref([[0,0,0],[0,0,0]]);
    const isTaskCompleted=ref(false);
    const feedback=ref("");
    navigation.isTaskComplete((msg)=>{
        isTaskCompleted.value=msg.data;
    });
    navigation.onFeedback((msg)=>{
        feedback.value=msg.data;
    });



    const createPose2D=(point)=>{
        let x=point[0];
        let y=point[1];
        let yaw=point[2];
        return navigation.createPose2D(x,y,yaw);
    }
    const createPoses2D=(points)=>{
        let poses=[];
        for (let i = 0; i < points.length; i++) {
            let pose=createPose2D(points[i]);
            poses.push(pose);
        }
        return poses;
    }
    const moveToPoint=()=>{
        let pose=createPose2D(points.value[0]);
        navigation.moveToPoint(pose);
    }
    const moveToPoints=()=>{
        let poses=createPoses2D(points.value);
        // console.log(poses);
        navigation.moveToPoints(poses);
    }
    const patrolPoints=()=>{
        let poses=createPoses2D(points.value);
        navigation.patrolPoints(poses);
    }
    const stopNavigation=()=>{
        navigation.stopNavigation();
    }
    const addPoint=()=>{
        points.value.push([0,0,0]);
    }
    const removePoint=()=>{
        points.value.pop();
    }
    const clearPoints=()=>{
        points.value=[];
    }



    
    
</script>
<template>
    <h1>Navigation</h1>
    <p>isTaskCompleted:{{isTaskCompleted}}</p>
    <p>feedback:{{feedback}}</p>
    <button @click="moveToPoint">Move to frist point</button>
    <button @click="moveToPoints">Move to points</button>
    <button @click="patrolPoints">Patrol points</button>
    <button @click="stopNavigation">Stop navigation</button>
    <br>
    <button @click="addPoint">Add point</button>
    <button @click="removePoint">Remove point</button>
    <button @click="clearPoints">Clear points</button>
    <template v-for="point in points">
        <p>
            x:<input type="number" min="0" max="600" step="1" v-model="point[0]" />
            y:<input type="number" min="0" max="500" step="1" v-model="point[1]" />
            yaw:<input type="number" min="0" max="360" step="1" v-model="point[2]" />
        </p>
    </template>





    
    
</template>