<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMessage } from 'naive-ui';
import type { UploadCustomRequestOptions } from 'naive-ui';
import { fetchCreateMap, fetchDeleteMap, fetchMaps, fetchUpdateMap } from '@/service/api';

import iconArchive from '~icons/mdi/archive';

const maps = ref<Api.Map[]>([]);
const message = useMessage();
const active = ref<boolean>(false);
const uploadData = ref(new FormData());
const new_name = ref<string>('');

const getMaps = async () => {
  const { data } = await fetchMaps();
  maps.value = data as [];
};
const formRules = {
  name: [{ required: true, message: 'Please input name', trigger: 'blur' }]
};

onMounted(() => {
  getMaps();
});

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
const handleAdd = () => {
  active.value = true;
  new_name.value = '';
  uploadData.value = new FormData();
};
const formSubmit = async () => {
  if (new_name.value === '') {
    message.error('Please input name');
    return;
  }
  if (uploadData.value.get('png') === null) {
    message.error('Please upload png');
    return;
  }
  if (uploadData.value.get('posegraph') === null) {
    message.error('Please upload posegraph');
    return;
  }
  if (uploadData.value.get('posegraphData') === null) {
    message.error('Please upload posegraph data');
    return;
  }

  const { error } = await fetchCreateMap(new_name.value, uploadData.value, 0);
  if (error) {
    message.error((error.response?.data as any).msg);
  } else {
    message.success('Add Success');
    active.value = false;
    getMaps();
  }
};
const formCancel = () => {
  active.value = false;
};

const customRequestPng = ({ file }: UploadCustomRequestOptions) => {
  uploadData.value.set('png', file.file as File);
};
const customRequestPosegraph = ({ file }: UploadCustomRequestOptions) => {
  uploadData.value.set('posegraph', file.file as File);
};
const customRequestPosegraphData = ({ file }: UploadCustomRequestOptions) => {
  uploadData.value.set('posegraphData', file.file as File);
};
</script>

<template>
  <NCard>
    <template #header>Map List</template>
    <template #header-extra>
      <NButton type="success" ghost @click="handleAdd">Add</NButton>
    </template>
    <NGrid :x-gap="24" :cols="4" item-responsive responsive="screen">
      <template v-for="item in maps" :key="item.name">
        <NGridItem span="4 m:2 l:1">
          <NCard>
            <template #header>
              {{ item.name }}
            </template>

            <NImage :src="item?.path_png" />
            <template #action>
              <NFlex justify="end">
                <NPopconfirm @positive-click="handleEdit(item.id)">
                  <template #trigger>
                    <NButton type="primary" ghost @click="new_name = ''">Edit</NButton>
                  </template>
                  <NInput v-model:value="new_name" placeholder="enter new name" />
                </NPopconfirm>
                <NPopconfirm @positive-click="handleDelete(item.id)">
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
    <NDrawer v-model:show="active" :width="502" placement="right" multiple>
      <NDrawerContent title="Add Map">
        <NForm label-placement="top" :rules="formRules">
          <NFormItem label="Name">
            <NInput v-model:value="new_name" placeholder="Please input name" />
          </NFormItem>
          <NFormItem label="Upload png">
            <NUpload :custom-request="customRequestPng" :max="1">
              <NUploadDragger>
                <!-- eslint-disable-next-line vue/no-static-inline-styles -->
                <div style="margin-bottom: 12px">
                  <NIcon size="48" :depth="3">
                    <component :is="iconArchive" />
                  </NIcon>
                </div>
                <NText>Drag to Upload map png</NText>
              </NUploadDragger>
            </NUpload>
          </NFormItem>
          <NFormItem label="Upload posegraph">
            <NUpload :custom-request="customRequestPosegraph" :max="1">
              <NUploadDragger>
                <!-- eslint-disable-next-line vue/no-static-inline-styles -->
                <div style="margin-bottom: 12px">
                  <NIcon size="48" :depth="3">
                    <component :is="iconArchive" />
                  </NIcon>
                </div>
                <NText>Drag to Upload map posegraph</NText>
              </NUploadDragger>
            </NUpload>
          </NFormItem>
          <NFormItem label="Upload posegraph data">
            <NUpload :custom-request="customRequestPosegraphData" :max="1">
              <NUploadDragger>
                <!-- eslint-disable-next-line vue/no-static-inline-styles -->
                <div style="margin-bottom: 12px">
                  <NIcon size="48" :depth="3">
                    <component :is="iconArchive" />
                  </NIcon>
                </div>
                <NText>Drag to Upload map posegraph data</NText>
              </NUploadDragger>
            </NUpload>
          </NFormItem>
        </NForm>
        <template #footer>
          <NFlex>
            <NButton type="primary" ghost @click="formCancel">Cancel</NButton>
            <NButton type="primary" @click="formSubmit">Save</NButton>
          </NFlex>
        </template>
      </NDrawerContent>
    </NDrawer>
  </NCard>
</template>

<style lang="scss" scoped></style>
