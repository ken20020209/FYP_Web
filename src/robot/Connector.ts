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
  }
  /** @param {(response) => void} callback */
  getDogList(callback: (msg: msgGetRobotList) => void) {
    const request = new ROSLIB.ServiceRequest({});
    this.getDogListClient.callService(request, callback);
  }
}
