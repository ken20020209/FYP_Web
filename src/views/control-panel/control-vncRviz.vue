<script setup lang="ts">
import RFB from '@novnc/novnc/core/rfb';
import { onMounted, ref } from 'vue';
import type { Controller } from '@/robot/Controller';

interface Props {
  controller: Controller;
}
const props = defineProps<Props>();

const { controller } = props;
const ip = controller.ip;
const domainID = controller.domainID;
const vncConnected = ref(false);
const vncConnectMsg = ref('Connecting...');
// console.log(url)

const vncContainer = ref(null);
const init = () => {
  // const vncContainer = $refs.vncContainer;
  const offset = domainID;
  const novncPort = 6080 + offset;
  // const yourVncServerUrl = `${ip}:${novncPort}`;

  // no need password
  // const yourVncPassword = "123456"

  const server = import.meta.env.VITE_SERVICE_BASE_URL.replace('https://', '');
  const rfb = new RFB(vncContainer.value as any, `wss://${server}/wss/?ip=${ip}&port=${novncPort}`);

  rfb.addEventListener('connect', () => {
    // eslint-disable-next-line no-console
    // console.log('Connected to VNC server');
    vncConnected.value = true;
  });

  rfb.addEventListener('disconnect', () => {
    // eslint-disable-next-line no-console
    // console.log('Disconnected from VNC server');
    vncConnected.value = false;
    vncConnectMsg.value = 'Disconnected from VNC server';
  });

  rfb.addEventListener('credentialsrequired', () => {
    // rfb.sendCredentials({ password: yourVncPassword });
  });
  // rfb.scaleViewport = true;
  // rfb.clipViewport = true;
  // rfb.resizeSession = true;
};
onMounted(() => {
  init();
});
</script>

<template>
  <NCard title="Navigation View">
    <div v-show="vncConnected" ref="vncContainer"></div>
    <div v-show="!vncConnected">{{ vncConnectMsg }}</div>
  </NCard>
</template>
