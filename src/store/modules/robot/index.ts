import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { Controller } from '@/robot/Controller';
import { Connector } from '@/robot/Connector';
import type { msgGetRobotList } from '@/robot/Connector';
import { fetchPermissions, fetchRobots } from '@/service/api';
import { useAuth } from '@/hooks/business/auth';
import { fetchRosips } from '@/service/api/rosip';
import { useAuthStore } from '../auth';

const message = useMessage();
// connector store
export const useConnectorStore = defineStore({
  id: 'connector',
  // controllers: [Controller],
  state: () => ({
    connectors: ref<Connector[]>([]),
    controllers: ref<{ [robot_id: string]: Controller }>({}),
    permission: ref<Api.Permission[]>([]),
    curController: ref<Controller>(),
    robotList: ref<any>(),

    // change to use subscribe instead of call service
    timer: setTimeout(() => {
      const store = useConnectorStore();

      const pushConnector = (ip: string) => {
        store.getConnectors.push(new Connector(ip, '9090'));
        // console.log(ip);

        let permission = store.getPermission;
        const { hasAuth } = useAuth();

        const hasPermission = () => hasAuth(['admin', 'manager']);

        store.getConnectors.forEach(connector =>
          connector.addDogListListener(msg => {
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
                  connector.ip,
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
            // eslint-disable-next-line guard-for-in
            for (const key in store.controllers) {
              let isValid = true;
              for (let i = 0; i < msg.dog_ids.length; i += 1) {
                if (key === msg.dog_ids[i]) {
                  isValid = false;
                  break;
                }
              }
              if (isValid) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                if (store.controllers[key].ip === connector.ip) delete store.controllers[key];
              }
            }
          })
        );
      };

      fetchRosips()
        .then(res => {
          res.data?.ips.forEach((ip: string) => {
            pushConnector(ip);
          });
        })
        .catch(err => {
          message.error(err);
        });
    }, 1000)
  }),
  getters: {
    getConnectors(): Connector[] {
      return this.connectors;
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
