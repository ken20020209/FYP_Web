import ROSLIB from 'roslib';
import { Movement } from './Movement';
import { Camera } from './Camera';
import { Action } from './Action';
import { BasicNavigator } from './NavigationSever';

interface msgSwitchService {
  result: string;
}

export class Controller {
  name: string;
  namespace: string;
  ros: ROSLIB.Ros;
  ip: string;
  port: string;
  domainID: number;
  type: string;
  battery: number;

  movement: Movement;
  camera: Camera;
  action: Action;
  navigation: BasicNavigator;

  navigation_on: boolean;
  slam_on: boolean;
  navigation_on_sub: ROSLIB.Topic;
  slam_on_sub: ROSLIB.Topic;
  navigation_switch_service: ROSLIB.Service;
  slam_switch_service: ROSLIB.Service;

  // eslint-disable-next-line max-params
  constructor(
    ip: string,
    port: string,
    name: string = '',
    domainID: string = '16',
    type: string = 'dog',
    battery: number = 100
  ) {
    this.name = name;
    this.namespace = '';
    this.ros = new ROSLIB.Ros({ url: `ws://${ip}:${port}` });
    this.ip = ip;
    this.port = port;
    this.domainID = Number.parseInt(domainID, 10);
    this.type = type;
    this.battery = battery;

    // components
    this.movement = new Movement(this.ros);
    this.camera = new Camera(this.ros);
    this.action = new Action(this.ros);
    this.navigation = new BasicNavigator(this.ros);

    this.navigation_on = false;
    this.slam_on = false;

    // topics
    this.navigation_on_sub = new ROSLIB.Topic({
      ros: this.ros,
      name: `${this.namespace}/controller/navigation`,
      messageType: 'std_msgs/msg/Bool'
    });
    this.slam_on_sub = new ROSLIB.Topic({
      ros: this.ros,
      name: `${this.namespace}/controller/slam`,
      messageType: 'std_msgs/msg/Bool'
    });
    this.navigation_on_sub.subscribe(this.navigationOnCallback);
    this.slam_on_sub.subscribe(this.slamOnCallback);

    // services
    this.navigation_switch_service = new ROSLIB.Service({
      ros: this.ros,
      name: `${this.namespace}/controller/navigation_switch`,
      serviceType: 'message/srv/SwitchService'
    });
    this.slam_switch_service = new ROSLIB.Service({
      ros: this.ros,
      name: `${this.namespace}/controller/slam_switch`,
      serviceType: 'message/srv/SwitchService'
    });
  }

  navigationOnCallback(msg: any) {
    this.navigation_on = msg.data;
  }
  slamOnCallback(msg: any) {
    this.slam_on = msg.data;
  }

  /**
   * Set the navigation status
   *
   * @function setNavigation
   * @param {boolean} status - Status of the navigation
   */
  setNavigation(status: Boolean) {
    // console.log(typeof(status)==typeof(Boolean()));
    // if (typeof status !== typeof Boolean()) {
    //   throw new TypeError('Invalid status type it should boolean');
    // }
    const request = new ROSLIB.ServiceRequest({
      switch_service: status
    });
    this.navigation_switch_service.callService(request, this.setNavigationCallback);
  }
  setNavigationCallback(msg: msgSwitchService) {
    console.log(`${this}Navigation status set to: ${msg.result}`);
  }
  startNavigation() {
    this.setNavigation(true);
  }
  stopNavigation() {
    this.setNavigation(false);
  }

  /**
   * Set the slam status
   *
   * @function setSlam
   * @param {Boolean} status - Status of the slam
   */
  setSlam(status: Boolean) {
    // if (typeof status !== typeof Boolean()) {
    //   throw new TypeError('Invalid status type it should boolean');
    // }
    const request = new ROSLIB.ServiceRequest({
      switch_service: status
    });
    this.slam_switch_service.callService(request, this.setSlamCallback);
  }
  setSlamCallback(msg: msgSwitchService) {
    console.log(`${this}Slam status set to: ${msg.result}`);
  }
  startSlam() {
    this.setSlam(true);
  }
  stopSlam() {
    this.setSlam(false);
  }
}
