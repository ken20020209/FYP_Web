import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Controller } from '@/robot/Controller';
import type { msgGetRobotList } from '@/robot/Connector';
import { Connector } from '@/robot/Connector';

// connector store
export const useConnectorStore = defineStore({
  id: 'connector',
  // controllers: [Controller],
  state: () => ({
    connector: ref<Connector>(new Connector('localhost', '9090')),
    controllers: ref<{ [robot_id: string]: Controller }>({}),
    curController: ref<Controller>(),
    robotList: ref<any>(),
    timer: setInterval(() => {
      const store = useConnectorStore();
      store.getConnector.getDogList(msg => {
        store.robotList = msg;

        // update controllers
        for (let i = 0; i < msg.dog_ids.length; i += 1) {
          if (!(msg.dog_ids[i] in store.controllers)) {
            store.controllers[msg.dog_ids[i]] = new Controller(
              store.connector.ip,
              msg.ports[i].toString(),
              msg.dog_ids[i],
              msg.domain_ids[i].toString(),
              msg.types[i]
            );
          } else {
            store.controllers[msg.dog_ids[i]].battery = msg.batterys[i];
          }
        }

        // remove controllers
        for (const key in store.controllers) {
          if (!msg.dog_ids.includes(key)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete store.controllers[key];
          }
        }
      });
    }, 1000)
  }),
  getters: {
    getConnector(): Connector {
      return this.connector;
    },
    getRobotList(): msgGetRobotList {
      return this.robotList;
    },
    getCurController(): Controller | undefined {
      return this.curController;
    }
  },
  actions: {
    setCurController(controller: Controller): void {
      this.curController = controller;
    }
  }
});
