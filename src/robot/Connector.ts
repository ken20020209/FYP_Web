import ROSLIB from 'roslib';

export interface msgGetRobotList {
  dog_ids: string[];
  ports: number[];
  domain_ids: number[];
  types: string[];
  batterys: number[];
}

export class Connector {
  ros: ROSLIB.Ros;
  getDogListClient: ROSLIB.Service;
  subDogList: ROSLIB.Topic;
  ip: string;
  port: string;
  constructor(ip: string, port: string) {
    this.ip = ip;
    this.port = port;
    this.ros = new ROSLIB.Ros({
      url: `ws://${ip}:${port}`
    });
    this.getDogListClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/dog/list',
      serviceType: 'service/srv/GetDogList'
    });
    this.subDogList = new ROSLIB.Topic({
      ros: this.ros,
      name: '/dog/list',
      messageType: 'message/msg/DogList'
    });
  }
  /** @param {(response) => void} callback */
  getDogList(callback: (msg: msgGetRobotList) => void) {
    const request = new ROSLIB.ServiceRequest({});
    this.getDogListClient.callService(request, callback);
  }

  addDogListListener(callback: (msg: msgGetRobotList) => void) {
    this.subDogList.subscribe((msg: any) => {
      callback(msg);
    });
  }
}
