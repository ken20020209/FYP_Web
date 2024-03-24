import ROSLIB from 'roslib';
import { Movement } from './Movement';
import { Camera } from './Camera';
import { Action } from './Action';
import { BasicNavigator } from './NavigationSever';

/**
 * @class Controller
 * @param {ROSLIB.Ros} ros - ROS connection
 * @param {string} name - Name of the robot dog
 * @param {number} domainID - Domain ID of the robot dog
 * @classdesc Controller class for the robot dog
 */
export class Controller {
  constructor(ros, name = '', domainID = 16) {
    this.name = name;
    this.namespace = '';
    this.ros = ros;
    this.ip = '';
    this.domainID = Number.parseInt(domainID, 10);

    // components
    this.movement = new Movement(ros);
    this.camera = new Camera(ros);
    this.action = new Action(ros);
    this.navigation = new BasicNavigator(ros);

    // extract ip from url
    const url = this.ros.socket.url;
    const ip = url.split(':')[1].split('//')[1];
    this.ip = ip;
    // console.log(this.ip);

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

  navigationOnCallback(msg) {
    this.navigation_on = msg.data;
  }
  slamOnCallback(msg) {
    this.slam_on = msg.data;
  }

  /**
   * Set the navigation status
   *
   * @function setNavigation
   * @param {boolean} status - Status of the navigation
   */
  setNavigation(status) {
    // console.log(typeof(status)==typeof(Boolean()));
    if (typeof status !== typeof Boolean()) {
      throw new TypeError('Invalid status type it should boolean');
    }
    const request = new ROSLIB.ServiceRequest({
      switch_service: status
    });
    this.navigation_switch_service.callService(request, this.setNavigationCallback);
  }
  setNavigationCallback(msg) {
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
   * @param {boolean} status - Status of the slam
   */
  setSlam(status) {
    if (typeof status !== typeof Boolean()) {
      throw new TypeError('Invalid status type it should boolean');
    }
    const request = new ROSLIB.ServiceRequest({
      switch_service: status
    });
    this.slam_switch_service.callService(request, this.setSlamCallback);
  }
  setSlamCallback(msg) {
    console.log(`${this}Slam status set to: ${msg.result}`);
  }
  startSlam() {
    this.setSlam(true);
  }
  stopSlam() {
    this.setSlam(false);
  }
}
