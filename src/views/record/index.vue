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
const limit = ref(8);
const offset = ref(1);
const totalPage = ref(10);

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
    limit: limit.value,
    offset: (offset.value - 1) * limit.value
  };
  const paramsID = {
    limit: limit.value,
    offset: (offset.value - 1) * limit.value,
    robot_id: robot_id.value
  };
  let res;
  if (robot_id.value !== '') res = await fetchRecords(paramsID);
  else res = await fetchRecords(params);

  if (res.data) {
    records.value = res.data.record;
    totalPage.value = Math.round(res.data.total / limit.value);
  }
};
const pageUpdate = async (page: number) => {
  offset.value = page;
  getReocrds();
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
    <template #footer>
      <NPagination v-model:page="offset" :page-count="totalPage" :on-update-page="pageUpdate" />
    </template>
  </NCard>
</template>

<style scoped></style>
