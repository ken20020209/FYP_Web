<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
// import { fetchGetAllRoles } from '@/service/api';
import { editPermission, fetchAddUser, fetchRobots, fetchUpdateUser } from '@/service/api';
import { $t } from '@/locales';
// import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { useAuth } from '@/hooks/business/auth';

const { hasAuth } = useAuth();

const hasPermission = () => hasAuth(['admin']);

defineOptions({
  name: 'UserOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.User | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
// const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

type Model = Pick<any, 'username' | 'roles' | 'permissions' | 'email' | 'password' | 'confirmPassword'>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    username: '',
    email: '',
    roles: [],
    permissions: [],
    password: '',
    confirmPassword: ''
  };
}

// type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

// const rules: Record<RuleKey, App.Global.FormRule> = {
//   userName: defaultRequiredRule,
//   status: defaultRequiredRule,
//   email: defaultRequiredRule,
//   password: defaultRequiredRule,
//   confirmPassword: defaultRequiredRule
// };
const rules = computed<Record<any, App.Global.FormRule[]>>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules();

  return {
    // phone: formRules.phone,
    // code: formRules.code,
    email: formRules.email,
    username: formRules.userName,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  };
});

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);
const permisionOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  // const { error, data } = await fetchGetAllRoles();

  // if (!error) {
  //   const options = data.map(item => ({
  //     label: item.roleName,
  //     value: item.roleCode
  //   }));

  //   // the mock data does not have the roleCode, so fill it
  //   // if the real request, remove the following code
  //   const userRoleOptions = model.roles.map(item => ({
  //     label: item,
  //     value: item
  //   }));
  //   // end

  //   roleOptions.value = [...userRoleOptions, ...options];
  // }
  roleOptions.value = [
    { label: 'user', value: 'user' },
    { label: 'robot', value: 'robot' }
  ];
  if (hasPermission()) {
    roleOptions.value.push({ label: 'manager', value: 'manager' });
    // roleOptions.value.push({ label: 'admin', value: 'admin' });
  }
}
async function getPermisionOptions() {
  const { error, data } = await fetchRobots();
  if (!error) {
    const options = data.map(item => ({
      label: item.name,
      value: String(item.id)
    }));
    model.permissions.forEach((permission: string) => {
      const optionRepeat = options.find(option => option.label === permission);
      if (optionRepeat) {
        optionRepeat.value = permission;
      }
    });
    permisionOptions.value = [...options];
  }
}

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
    model.permissions = [];
    props.rowData.permissions?.forEach(permission => {
      model.permissions.push(String(permission.robot?.id));
    });
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleAdd(addUser: Api.AddUser) {
  const { error } = await fetchAddUser(addUser);
  if (error) {
    window.$message?.error('add failed');
    return;
  }
  window.$message?.success($t('common.addSuccess'));
}

async function handleEdit(id: number | undefined, addUser: Api.AddUser) {
  if (id === undefined) {
    window.$message?.error('update failed');
    return;
  }
  const { error } = await fetchUpdateUser(id, addUser);
  if (error) {
    window.$message?.error('update failed');
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
}
async function handleSubmit() {
  await validate();
  // request

  // console.log(model);
  const addUser: Api.AddUser = {
    username: model.username,
    email: model.email,
    role: model.roles[0],
    password: model.password
  };

  if (props.operateType === 'add') {
    await handleAdd(addUser);
  } else {
    await handleEdit(props.rowData?.id, addUser);
  }

  // update the user permission
  const { error } = await editPermission(model.username, model.permissions.map(Number));
  if (error) {
    window.$message?.error('update failed');
    return;
  }
  window.$message?.success($t('common.updateSuccess'));

  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenEdit();
    restoreValidation();
    getRoleOptions();
    getPermisionOptions();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.user.userName')" path="username">
          <NInput v-model:value="model.username" :placeholder="$t('page.manage.user.form.userName')" />
        </NFormItem>

        <!--
 <NFormItem :label="$t('page.manage.user.userGender')" path="userGender">
          <NRadioGroup v-model:value="model.userGender">
            <NRadio v-for="item in userGenderOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
-->
        <!--
 </NFormItem>
        <NFormItem :label="$t('page.manage.user.nickName')" path="nickName">
          <NInput v-model:value="model.nickName" :placeholder="$t('page.manage.user.form.nickName')" />
        </NFormItem>
-->
        <!--
 <NFormItem :label="$t('page.manage.user.userPhone')" path="userPhone">
          <NInput v-model:value="model.userPhone" :placeholder="$t('page.manage.user.form.userPhone')" />
        </NFormItem>
-->
        <NFormItem :label="$t('page.manage.user.userEmail')" path="email">
          <NInput v-model:value="model.email" :placeholder="$t('page.manage.user.form.userEmail')" />
        </NFormItem>
        <!--
 <NFormItem :label="$t('page.manage.user.userStatus')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItem>
-->

        <NFormItem :label="$t('page.manage.user.userRole')" path="roles">
          <NSelect
            v-model:value="model.roles[0]"
            :options="roleOptions"
            :placeholder="$t('page.manage.user.form.userRole')"
          />
        </NFormItem>
        <NFormItem v-if="props.operateType === 'add'" path="password" label="New Password">
          <NInput
            v-model:value="model.password"
            type="password"
            show-password-on="click"
            :placeholder="$t('page.login.common.passwordPlaceholder')"
          />
        </NFormItem>
        <NFormItem v-if="props.operateType === 'add'" path="confirmPassword" label="Confirm Password">
          <NInput
            v-model:value="model.confirmPassword"
            type="password"
            show-password-on="click"
            :placeholder="$t('page.login.common.confirmPasswordPlaceholder')"
          />
        </NFormItem>
        <NFormItem label="robot permission" path="roles">
          <NSelect v-model:value="model.permissions" multiple :options="permisionOptions" placeholder="choose robot" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
