<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useConnectorStore } from '@/store/modules/robot';
import { fetchAddRobot, fetchRobots } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import RobotCardOn from './robotCardOn.vue';
import RobotCardOff from './robotCardOff.vue';

// useConnectorStore();

const { controllers } = useConnectorStore();
const robotSwitch = ref<boolean>(true);
const robotTitle = computed(() => (robotSwitch.value ? 'Online' : 'Offline'));
const { formRef, validate } = useNaiveForm();

const active = ref<boolean>(false);
const model = ref<any>({
  name: '',
  detail: '',
  type: 'dog_s2'
});

const typeOptions = [
  { label: 'dog_s2', value: 'dog_s2' },
  { label: 'muto_s2', value: 'muto_s2' },
  { label: 'dog_go1', value: 'dog_go1' }
];
const rules = computed<Record<any, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();

  return {
    name: formRules.userName
  };
});
const robots = ref<Api.Robot[]>([]);
const fetchRobotsData = async () => {
  const { data, error } = await fetchRobots();
  if (error) {
    window.$message?.error(error.message);
  } else {
    robots.value = data;
  }
};
const setDefaultModel = () => {
  model.value = {
    name: '',
    detail: '',
    type: 'dog_s2'
  };
};
const handleAdd = () => {
  active.value = true;
  setDefaultModel();
};
const formSubmit = async () => {
  await validate();
  const { error } = await fetchAddRobot(model.value);
  if (error) {
    window.$message?.error((error.response?.data as any).msg);
  } else {
    window.$message?.success('Add Success');
    active.value = false;
    fetchRobotsData();
  }
};
const formCancel = () => {
  active.value = false;
};

onMounted(() => {
  fetchRobotsData();
  setDefaultModel();
});
</script>

<template>
  <div>
    <NCard>
      <template #header-extra>
        <NFlex vertical>
          <NSwitch v-model:value="robotSwitch" size="large">
            <template #checked>Online</template>
            <template #unchecked>Offline</template>
          </NSwitch>
          <NButton v-if="!robotSwitch" type="success" ghost @click="handleAdd">Add</NButton>
        </NFlex>
      </template>

      <template #header>
        <NH1>Robots {{ robotTitle }} List</NH1>
      </template>
      <NH1 v-if="Object.keys(controllers).length === 0 && robotSwitch">Robot Not Found</NH1>

      <NGrid v-if="robotSwitch" :x-gap="24" :cols="4" item-responsive responsive="screen">
        <template v-for="controller in controllers" :key="controller.name">
          <NGridItem span="4 m:2 l:1">
            <RobotCardOn :controller="controller" />
          </NGridItem>
        </template>
      </NGrid>

      <NGrid v-else :x-gap="24" :cols="4" item-responsive responsive="screen">
        <template v-for="robot in robots" :key="robot.id">
          <NGridItem span="4 m:2 l:1">
            <RobotCardOff :robot="robot" :getdata="fetchRobotsData" />
          </NGridItem>
        </template>
      </NGrid>
      <NDrawer v-model:show="active" :width="502" placement="right">
        <NDrawerContent title="Robot">
          <NForm ref="formRef" :model="model" :rules="rules">
            <NFormItem label="Name" path="name">
              <NInput v-model:value="model.name" />
            </NFormItem>
            <NFormItem label="Description">
              <NInput v-model:value="model.detail" />
            </NFormItem>
            <NFormItem label="Type">
              <NSelect v-model:value="model.type" :options="typeOptions" />
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
  </div>
</template>

<style scoped></style>
