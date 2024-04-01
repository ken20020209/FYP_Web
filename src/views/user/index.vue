<script setup lang="tsx">
import { computed, onMounted, ref } from 'vue';
import { NButton, NFlex, NPopconfirm } from 'naive-ui';
import type { DataTableColumn } from 'naive-ui';

import { toInteger } from 'lodash-es';
import { fetchDeleteUser, fetchPermissions, fetchRobots, fetchUsers } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import { useTableOperate } from '@/hooks/common/table';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
// import UserSearch from './modules/user-search.vue';

const appStore = useAppStore();
// const users = ref([]);
const data = ref<Api.User[]>([] as Api.User[]);
const loading = ref(false);
const robotData = ref<Api.Robot[]>([] as Api.Robot[]);
const getData = async (params: any) => {
  loading.value = true;
  const res = await fetchUsers(params);
  data.value = res.data as Api.User[];
  robotData.value = (await fetchRobots()).data as Api.Robot[];
  await data.value.forEach(async item => {
    item.permissions = (await fetchPermissions({ user_id: item.id })).data as Api.Permission[];
    item.permissions.forEach(permission => {
      permission.robot = robotData.value.find(robot => robot.id === permission.robot_id);
    });
  });
  loading.value = false;
};
const columnsCheck = ref([
  {
    key: 'id',
    title: 'Index',
    checked: true
  },
  {
    key: 'username',
    title: $t('page.manage.user.userName'),
    checked: true
  },
  {
    key: 'email',
    title: $t('page.manage.user.userEmail'),
    checked: true
  },
  {
    key: 'roles',
    title: $t('page.manage.user.userRole'),
    checked: true
  },
  {
    key: 'permissions',
    title: $t('page.manage.user.userPermission'),
    checked: true
  },
  {
    key: 'operate',
    title: $t('common.operate'),
    checked: true
  }
]);
const columns: DataTableColumn<Api.User>[] = [
  {
    type: 'selection',
    align: 'center',
    width: 48
  },
  {
    key: 'id',
    title: 'id',
    align: 'center',
    width: 60
  },
  {
    key: 'username',
    title: $t('page.manage.user.userName'),
    align: 'center',
    minWidth: 50
  },
  {
    key: 'email',
    title: $t('page.manage.user.userEmail'),
    align: 'center',
    minWidth: 50
  },
  {
    key: 'roles',
    title: $t('page.manage.user.userRole'),
    align: 'center',
    minWidth: 50
  },
  {
    key: 'permissions',
    title: $t('page.manage.user.userPermission'),
    align: 'center',
    minWidth: 50,
    render: row => {
      return (
        <NFlex class="flex-col gap-4px">
          {row.permissions?.map(item => (
            <NButton type="info" secondary>
              {item.robot?.name}
            </NButton>
          ))}
        </NFlex>
      );
    }
  },
  {
    key: 'operate',
    title: $t('common.operate'),
    align: 'center',
    width: 150,
    render: row => {
      return (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      );
    }
  }
];
const columnsComputed = computed(() => {
  const newColumns = [] as DataTableColumn<Api.User>[];
  newColumns.push(columns[0]);
  columnsCheck.value.forEach(item => {
    const col = columns.find((column: any) => column.key === item.key);
    if (col && item.checked) {
      newColumns.push(col);
    }
  });

  return newColumns;
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data as any, getData as any);

const editingDataNotNull = editingData as any as Api.User;
function edit(id: number) {
  handleEdit(id);
}
async function handleBatchDelete() {
  // request
  // console.log(checkedRowKeys.value);
  checkedRowKeys.value.forEach(async id => {
    await fetchDeleteUser(toInteger(id));
  });

  onBatchDeleted();
}
async function handleDelete(id: number) {
  // request
  // console.log(id);

  const { error } = await fetchDeleteUser(id);
  if (error) {
    const msg = (error.response?.data as any)?.msg;
    window?.$message?.error(msg);
    return;
  }

  onDeleted();
}
onMounted(() => {
  getData({});
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <!-- <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" /> -->
    <NCard :title="$t('page.manage.user.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnsCheck"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>

      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columnsComputed"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        class="sm:h-full"
      />

      <UserOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingDataNotNull"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
