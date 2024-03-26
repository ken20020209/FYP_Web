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
// console.log(url)

const vncContainer = ref(null);
const init = () => {
  // const vncContainer = $refs.vncContainer;
  const offset = domainID;
  const novncPort = 6080 + offset;
  const yourVncServerUrl = `${ip}:${novncPort}`;

  // no need password
  // const yourVncPassword = "123456"

  const rfb = new RFB(vncContainer.value as any, `ws://${yourVncServerUrl}`);

  rfb.addEventListener('connect', () => {
    // eslint-disable-next-line no-console
    console.log('Connected to VNC server');
  });

  rfb.addEventListener('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('Disconnected from VNC server');
  });

  rfb.addEventListener('credentialsrequired', () => {
    // rfb.sendCredentials({ password: yourVncPassword });
  });
};
onMounted(() => {
  init();
});
</script>

<template>
  <div>
    <div ref="vncContainer"></div>
  </div>
</template>
