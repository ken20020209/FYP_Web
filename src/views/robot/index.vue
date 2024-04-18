<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useConnectorStore } from '@/store/modules/robot';
import { fetchAddRobot, fetchRobots } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAuth } from '@/hooks/business/auth';
import { DogGroupFrontend } from '@/robot';
import RobotCardOn from './robotCardOn.vue';
import RobotCardOff from './robotCardOff.vue';
const { hasAuth } = useAuth();

const hasPermission = () => hasAuth(['admin', 'manager']);

// useConnectorStore();

const { controllers } = useConnectorStore();
const robotSwitch = ref<boolean>(true);
const robotTitle = computed(() => (robotSwitch.value ? 'Online' : 'Offline'));
const { formRef, validate } = useNaiveForm();

const options = [
  { label: 'foward', key: 'foward' },
  { label: 'backward', key: 'backward' },
  { label: 'left', key: 'left' },
  { label: 'right', key: 'right' },
  { label: 'stop', key: 'stop' },
  { label: 'turn_left', key: 'turn_left' },
  { label: 'turn_right', key: 'turn_right' },
  { label: 'action 1', key: 'action1' },
  { label: 'action 2', key: 'action2' },
  { label: 'action 3', key: 'action3' },
  { label: 'action 4', key: 'action4' },
  { label: 'action stop', key: 'actionstop' }
];
const handleSelect = (key: string) => {
  const dogGroupFrontend = new DogGroupFrontend();
  for (const controller in controllers) {
    if (controllers[controller].type !== undefined) dogGroupFrontend.addDog(controllers[controller]);
  }
  if (key === 'foward') dogGroupFrontend.move_forward(0.5);
  if (key === 'backward') dogGroupFrontend.move_backward(0.5);
  if (key === 'left') dogGroupFrontend.move_left(0.5);
  if (key === 'right') dogGroupFrontend.move_right(0.5);
  if (key === 'stop') dogGroupFrontend.stop();
  if (key === 'turn_left') dogGroupFrontend.turn_left(0.5);
  if (key === 'turn_right') dogGroupFrontend.turn_right(0.5);
  if (key === 'action1') dogGroupFrontend.doAction(1);
  if (key === 'action2') dogGroupFrontend.doAction(2);
  if (key === 'action3') dogGroupFrontend.doAction(3);
  if (key === 'action4') dogGroupFrontend.doAction(4);
  if (key === 'actionstop') dogGroupFrontend.doAction(255);
  // console.log(key);
};

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
          <NDropdown trigger="hover" :options="options" @select="handleSelect">
            <NButton>Group (Beta)</NButton>
          </NDropdown>
          <NSwitch v-if="hasPermission()" v-model:value="robotSwitch" size="large">
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
