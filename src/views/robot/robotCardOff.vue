<script setup lang="ts">
import { computed, ref } from 'vue';
// import { useMessage } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchDeleteRobot, fetchUpdateRobot } from '@/service/api';
interface Props {
  robot: Api.Robot;
  getdata: () => void;
}
const cameraImage = ref<string>('/favicon.svg');
const props = defineProps<Props>();

const active = ref<boolean>(false);
const model = ref<Api.Robot>(props.robot);

const typeOptions = [
  { label: 'dog_s2', value: 'dog_s2' },
  { label: 'muto_s2', value: 'muto_s2' },
  { label: 'dog_go1', value: 'dog_go1' }
];
// const message = useMessage();
const { formRef, validate } = useNaiveForm();
const rules = computed<Record<any, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();

  return {
    name: formRules.userName
  };
});
const cardOnClick = () => {
  // message.info('Card clicked');
  active.value = true;
};
const formSubmit = async () => {
  await validate();

  const { error } = await fetchUpdateRobot(model.value);
  if (error) {
    window.$message?.error((error.response?.data as any).msg);
  } else {
    window.$message?.success('update Success');
    active.value = false;
    props.getdata();
  }
};
const formCancel = () => {
  active.value = false;
};
const handleDelete = async () => {
  // message.info('Delete clicked');
  const { error } = await fetchDeleteRobot(model.value.id);
  if (error) {
    window.$message?.error((error.response?.data as any).msg);
  } else {
    window.$message?.success('delete Success');
    active.value = false;
    props.getdata();
  }
};
</script>

<template>
  <NCard @click="cardOnClick">
    <template #header>
      {{ robot.name }}
    </template>
    <template #default>
      <img :src="cameraImage" />
    </template>

    <template #action>
      <div
        @click="
          e => {
            e.stopPropagation();
          }
        "
      >
        <NFlex justify="end">
          <NButton type="primary" ghost @click="cardOnClick">Edit</NButton>
          <NPopconfirm @positive-click="handleDelete">
            <template #trigger>
              <NButton type="error" ghost>Delete</NButton>
            </template>
            Are you sure you want to delete this robot?
          </NPopconfirm>
        </NFlex>
      </div>
    </template>
  </NCard>
  <NDrawer v-model:show="active" :width="502" placement="right">
    <NDrawerContent title="Robot">
      <NForm ref="formRef" :rules="rules" :model="model">
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
</template>
