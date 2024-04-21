<script setup lang="ts">
import type { Ref } from 'vue';
import { onMounted, ref } from 'vue';
import { useMessage } from 'naive-ui';
import type { UploadCustomRequestOptions } from 'naive-ui';
import { fetchCreateRecord, fetchRobots } from '@/service/api';

import iconArchive from '~icons/mdi/archive';

interface Props {
  model: {
    active: Ref<boolean>;
    uploadData: Ref<FormData>;
    newname: Ref<string>;
  };
  getData: () => void;
}

const props = defineProps<Props>();

const message = useMessage();
const active = props.model.active;
const uploadData = props.model.uploadData;
const new_name = props.model.newname;
const robot_id = ref<string>('');

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
};

const formRules = {
  name: [{ required: true, message: 'Please input name', trigger: 'blur' }]
};

const formSubmit = async () => {
  if (new_name.value === '') {
    message.error('Please input name');
    return;
  }
  if (uploadData.value.get('record') === null) {
    message.error('Please upload record');
    return;
  }

  const { error } = await fetchCreateRecord(new_name.value, Number(robot_id.value), uploadData.value);
  if (error) {
    message.error((error.response?.data as any).msg);
  } else {
    message.success('Add Success');
    active.value = false;
    props.getData();
  }
};
const customRequestRecord = ({ file }: UploadCustomRequestOptions) => {
  uploadData.value.set('record', file.file as File);
};
const formCancel = () => {
  active.value = false;
};
const init = () => {
  getRobotOptions();
};
onMounted(() => {
  init();
});
</script>

<template>
  <NDrawer v-model:show="active" :width="502" placement="right" multiple>
    <NDrawerContent title="Add Record">
      <NForm label-placement="top" :rules="formRules">
        <NFormItem label="Name">
          <NInput v-model:value="new_name" placeholder="Please input name" />
        </NFormItem>
        <NFormItem label="robot " path="roles">
          <NSelect v-model:value="robot_id" :options="robotOptions" placeholder="choose robot" />
        </NFormItem>
        <NFormItem label="Upload record">
          <NUpload :custom-request="customRequestRecord">
            <NUploadDragger>
              <!-- eslint-disable-next-line vue/no-static-inline-styles -->
              <div style="margin-bottom: 12px">
                <NIcon size="48" :depth="3">
                  <component :is="iconArchive" />
                </NIcon>
              </div>
              <NText>Drag to Upload record</NText>
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
</template>
