<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import { useMessage } from 'naive-ui';

import { fetchDeleteRecord, fetchUpdateRecord } from '@/service/api';

interface Props {
  record: Api.Record;
  getData: () => void;
}

const props = defineProps<Props>();
const message = useMessage();

const videoPlayer = ref<string>('');
const player = ref<Player | null>(null);
const new_name = ref<string>('');

const init = async () => {
  player.value = videojs(
    videoPlayer.value,
    {
      responsive: true,
      fluid: true,
      controls: true,
      sources: [
        {
          src: props.record?.path,
          type: 'video/mp4'
        }
      ],
      controlBar: {
        volumePanel: {
          inline: false
        }
      },
      playbackRates: [0.5, 1, 1.5, 2]
    },
    () => {
      // window.$message?.success('player ready');
    }
  );
};
const handleDelete = async (id: number) => {
  const { error } = await fetchDeleteRecord(id);
  if (error) {
    message.error((error.response?.data as any).msg);
  } else {
    message.success('delete Success');
    props.getData();
  }
};
const handleEdit = async (id: number) => {
  const { error } = await fetchUpdateRecord(id, new_name.value);
  if (error) {
    message.error((error.response?.data as any).msg);
  } else {
    message.success('update Success');
    props.getData();
  }
};

onMounted(() => {
  init();
});
onUnmounted(() => {
  if (player.value) player.value.dispose();
});
</script>

<template>
  <NCard ref="recordCard">
    <template #header>
      <div>{{ props.record?.name }}</div>
    </template>
    <template #header-extra>
      <div>{{ props.record?.datetime }}</div>
    </template>

    <video ref="videoPlayer" class="video-js"></video>

    <template #action>
      <NFlex justify="end">
        <NPopconfirm @positive-click="handleEdit(record.id)">
          <template #trigger>
            <NButton type="primary" ghost @click="new_name = ''">Edit</NButton>
          </template>
          <NInput v-model:value="new_name" placeholder="enter new name" />
        </NPopconfirm>
        <NPopconfirm @positive-click="handleDelete(record.id)">
          <template #trigger>
            <NButton type="error" ghost>Delete</NButton>
          </template>
          Are you sure you want to delete this robot?
        </NPopconfirm>
      </NFlex>
    </template>
  </NCard>
</template>

<style scoped></style>
