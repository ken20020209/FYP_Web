import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Controller } from '@/robot/Controller';
import type { msgGetRobotList } from '@/robot/Connector';
import { Connector } from '@/robot/Connector';
import { fetchPermissions, fetchRobots } from '@/service/api';
import { useAuth } from '@/hooks/business/auth';
import { useAuthStore } from '../auth';

// connector store
export const useConnectorStore = defineStore({
  id: 'connector',
  // controllers: [Controller],
  state: () => ({
    connector: ref<Connector>(new Connector(import.meta.env.VITE_SERVICE_ROS_Connector_DNS, '9090')),
    controllers: ref<{ [robot_id: string]: Controller }>({}),
    permission: ref<Api.Permission[]>([]),
    curController: ref<Controller>(),
    robotList: ref<any>(),

    // change to use subscribe instead of call service
    timer: setTimeout(() => {
      const store = useConnectorStore();
      let permission = store.getPermission;
      const { hasAuth } = useAuth();

      const hasPermission = () => hasAuth(['admin', 'manager']);

      store.getConnector.addDogListListener(msg => {
        permission = store.permission;
        // console.log(permission);
        store.robotList = msg;
        // update controllers
        for (let i = 0; i < msg.dog_ids.length; i += 1) {
          let isValid = false;
          permission.forEach(p => {
            if (p.robot?.name === msg.dog_ids[i]) {
              isValid = true;
            }
          });
          // eslint-disable-next-line no-continue
          if (!isValid && !hasPermission()) continue;
          if (!(msg.dog_ids[i] in store.controllers)) {
            store.controllers[msg.dog_ids[i]] = new Controller(
              store.connector.ip,
              msg.ports[i].toString(),
              msg.dog_ids[i],
              msg.domain_ids[i].toString(),
              msg.types[i]
            );
            if (store.curController === undefined) store.curController = store.controllers[msg.dog_ids[i]];
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
    },
    getPermission(): Api.Permission[] {
      const authStore = useAuthStore();
      const id = (authStore.userInfo as any).id;
      // console.log(authStore.userInfo);

      fetchPermissions({ user_id: id })
        .then(res => {
          this.permission = res.data as Api.Permission[];
        })
        .then(() => {
          fetchRobots().then(res => {
            res.data?.forEach(robot => {
              this.permission.forEach(p => {
                if (p.robot_id === robot.id) {
                  p.robot = robot;
                }
              });
            });
          });
        });
      return this.permission;

      // console.log(this.permission);
      // fetchRobots().then(res => {
      //   res.data?.forEach(robot => {
      //     this.permission.forEach(p => {
      //       if (p.robot_id === robot.id) {
      //         p.robot = robot;
      //       }
      //     });
      //   });
      // });

      // console.log(this.permission);
      // return this.permission;
    }
  },
  actions: {
    setCurController(controller: Controller): void {
      this.curController = controller;
    }
  }
});
