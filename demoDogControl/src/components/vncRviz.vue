<template>
    <div>
        <div ref="vncContainer"></div>
    </div>
</template>

<script setup>
import RFB from '@novnc/novnc/core/rfb.js';
import { onMounted, ref } from 'vue';

const props = defineProps(['controller']);
const ip = props.controller.ip;
const domainID = props.controller.domainID;
// console.log(url)

const vncContainer = ref(null);
const init =()=>{
    
    // const vncContainer = $refs.vncContainer;
    const offset = parseInt(domainID);
    const novncPort = 6080 + offset;
    const yourVncServerUrl = `${ip}:${novncPort}`;

    //no need password
    // const yourVncPassword = "123456"

    const rfb = new RFB(vncContainer.value, `ws://${yourVncServerUrl}`);

    rfb.addEventListener('connect', () => {
        console.log('Connected to VNC server');
    });

    rfb.addEventListener('disconnect', () => {
        console.log('Disconnected from VNC server');
    });

    rfb.addEventListener('credentialsrequired', () => {
        rfb.sendCredentials({ password: yourVncPassword });
    });

}
onMounted(()=> {
    init();
});

</script>