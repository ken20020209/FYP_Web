import ROSLIB from 'roslib';

export class Mapping {
  private ros: ROSLIB.Ros;
  saveMapClient: ROSLIB.Service<any, any>;
  constructor(ros: ROSLIB.Ros) {
    this.ros = ros;
    this.saveMapClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/save_map',
      serviceType: 'message/srv/SaveMap'
    });
  }
  saveMap(name: string, callback: (response: any) => void) {
    const request = new ROSLIB.ServiceRequest({
      name
    });
    this.saveMapClient.callService(request, callback);
  }
}
