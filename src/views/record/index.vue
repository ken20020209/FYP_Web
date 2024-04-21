<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useMessage } from 'naive-ui';
import { fetchRecords, fetchRobots } from '@/service/api';
import 'video.js/dist/video-js.css';

import RecordCard from './recordCard.vue';
import RecordDraw from './record-draw.vue';

const records = ref<Api.Record[]>([]);
const message = useMessage();
const active = ref(false);
const uploadData = ref(new FormData());
const new_name = ref('');
const robot_id = ref<string>('');

const model = {
  active,
  uploadData,
  newname: new_name
};

const robotOptions = ref<CommonType.Option<string>[]>([]);
const getRobotOptions = async () => {
  const { data, error } = await fetchRobots();
  if (error) {
    message.error((error.response?.data as any).msg);
    return;
  }
  robotOptions.value = data.map((item: Api.Robot) => ({
    label: item.name,
    value: item.id.toString()
  }));
  robotOptions.value.unshift({ label: 'All Robot', value: '' });
};

const getReocrds = async () => {
  const params = {
    robot_id: Number(robot_id.value)
  };
  let res;
  if (robot_id.value !== '') res = await fetchRecords(params);
  else res = await fetchRecords();
  if (res.data) records.value = res.data;
};
const handleAdd = () => {
  active.value = true;
  new_name.value = '';
  uploadData.value = new FormData();
};
const handleSelect = (value: string) => {
  robot_id.value = value;
  getReocrds();
};

onMounted(() => {
  getReocrds();
  getRobotOptions();
});
onUnmounted(() => {});
</script>

<template>
  <NCard>
    <template #header>Record List</template>
    <template #header-extra>
      <NFlex justify="end">
        <NSelect
          v-model:value="robot_id"
          :options="robotOptions"
          placeholder="choose robot"
          @update-value="handleSelect"
        />
        <NButton type="success" ghost @click="handleAdd">Add</NButton>
      </NFlex>
    </template>
    <NGrid :x-gap="24" :cols="4" item-responsive responsive="screen">
      <template v-for="record in records" :key="record.id">
        <NGridItem span="4 m:2 l:1">
          <RecordCard :record="record" :get-data="getReocrds" />
        </NGridItem>
      </template>
    </NGrid>
    <RecordDraw :model="model" :get-data="getReocrds" />
  </NCard>
</template>

<style scoped></style>
