<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMessage } from 'naive-ui';
import { fetchDeleteMap, fetchMaps, fetchUpdateMap } from '@/service/api';

const maps = ref<Api.Map[]>([]);
const message = useMessage();

const getMaps = async () => {
  const { data } = await fetchMaps();
  maps.value = data as [];
};

onMounted(() => {
  getMaps();
});
const new_name = ref<string>('');

const handleDelete = async (id: number) => {
  const { error } = await fetchDeleteMap(id);
  if (error) {
    message.error((error.response?.data as any).msg);
  } else {
    message.success('delete Success');
    getMaps();
  }
};
const handleEdit = async (id: number) => {
  const { error } = await fetchUpdateMap(id, new_name.value);
  if (error) {
    message.error((error.response?.data as any).msg);
  } else {
    message.success('update Success');
    getMaps();
  }
};
</script>

<template>
  <NGrid :x-gap="24" :cols="4" item-responsive responsive="screen">
    <template v-for="map in maps" :key="map.id">
      <NGridItem span="4 m:2 l:1">
        <NCard>
          <template #header>
            {{ map.name }}
          </template>
          <NImage :src="map?.path" />
          <template #action>
            <NFlex justify="end">
              <NPopconfirm @positive-click="handleEdit(map.id)">
                <template #trigger>
                  <NButton type="primary" ghost @click="new_name = ''">Edit</NButton>
                </template>
                <NInput v-model:value="new_name" placeholder="enter new name" />
              </NPopconfirm>
              <NPopconfirm @positive-click="handleDelete(map.id)">
                <template #trigger>
                  <NButton type="error" ghost>Delete</NButton>
                </template>
                Are you sure you want to delete this robot?
              </NPopconfirm>
            </NFlex>
          </template>
        </NCard>
      </NGridItem>
    </template>
  </NGrid>
</template>

<style lang="scss" scoped></style>
