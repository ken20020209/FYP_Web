<script setup lang="ts">
import type { Component, Ref } from 'vue';
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { useConnectorStore } from '@/store/modules/robot';
import Movement from './control-movement.vue';
import VncRviz from './control-vncRviz.vue';
import Action from './control-action.vue';
import Camera from './control-camera.vue';
import NavigationSwitch from './control-navigation-switch.vue';
import NavigationPanel from './control-navigation-panel.vue';
import ControlVoiceControl from './control-voice-control.vue';

const { curController } = useConnectorStore();

// declare all components allow user to eable/disable components
interface ComponentSwitch {
  component: Component;
  enable: Ref<boolean>;
}
// interface SplitLayout {
//   left: Component | SplitLayout | undefined;
//   right: Component | SplitLayout | undefined;
//   vertical: boolean;
// }
// const splitLayout = ref<SplitLayout>({
//   left: { component: Movement },
//   right: { component: VncRviz },
//   vertical: false
// });
const componentsSwitch = shallowRef<{
  [key: string]: ComponentSwitch;
}>({
  Movement: { component: Movement, enable: ref(true) },
  VncRviz: { component: VncRviz, enable: ref(false) },
  Action: { component: Action, enable: ref(true) },
  Camera: { component: Camera, enable: ref(true) },
  NavigationSwitch: { component: NavigationSwitch, enable: ref(false) },
  NavigationPanel: { component: NavigationPanel, enable: ref(false) },
  ControlVoiceControl: { component: ControlVoiceControl, enable: ref(true) }
});

const viewDrawer = ref(false);
const handleViewSetting = () => {
  viewDrawer.value = !viewDrawer.value;
};
onMounted(() => {});

onUnmounted(() => {});
</script>

<template>
  <div v-if="curController">
    <NCard :title="curController?.name">
      <NButton @click="handleViewSetting">view setting</NButton>
    </NCard>

    <NDrawer v-model:show="viewDrawer" placement="right" resizable default-width="400px">
      <NDrawerContent>
        <template #header>
          <NH1>Control Panel Setting</NH1>
        </template>
        <template #default>
          <NGrid :cols="3">
            <NGridItem v-for="(component, key) in componentsSwitch" :key="key">
              <NCheckbox v-model:checked="component.enable.value">{{ key }}</NCheckbox>
            </NGridItem>
          </NGrid>
        </template>
        <template #footer>
          <NButton type="error" @click="viewDrawer = false">Close</NButton>
        </template>
      </NDrawerContent>
    </NDrawer>

    <!-- render component use componetsSwitch -->
    <template v-for="(component, key) in componentsSwitch">
      <component :is="component.component" v-if="component.enable.value" :key="key" :controller="curController" />
    </template>

    <!--
 <NSplit>
      <template #1>
        <Movement :controller="curController" />
      </template>
      <template #2>
        <VncRviz :controller="curController" />
      </template>
    </NSplit>
-->

    <!--
    <Movement :controller="curController"></Movement>
    <Camera :controller="curController"></Camera>
    <Action :controller="curController"></Action>
    <NavigationSwitch :controller="curController"></NavigationSwitch>
    <NavigationPanel :controller="curController"></NavigationPanel>
    <VucRviz :controller="curController"></VucRviz>
-->
  </div>
  <div v-else>
    <NCard>
      <NH1>Not Connected</NH1>
    </NCard>
  </div>
</template>
