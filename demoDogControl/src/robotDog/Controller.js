import ROSLIB from "roslib";
import { Movement } from "./Movement";
import { Camera } from "./Camera";
import { Action } from "./Action";
import { BasicNavigator } from "./NavigationSever";

/**
 * @class Controller
 * @classdesc Controller class for the robot dog
 * @param {ROSLIB.Ros} ros - ROS connection
 * @param {string} name - Name of the robot dog
 */
export class Controller {
  constructor(ros,name='',domainID=16) {
    this.name=name;
    this.namespace = "";
    this.ros = ros;
    this.ip="";
    this.domainID=domainID;

    // components
    this.movement = new Movement(ros);
    this.camera = new Camera(ros);
    this.action = new Action(ros);
    this.navigation = new BasicNavigator(ros);
    
    //extract ip from url
    let url = this.ros.socket.url;
    let ip = url.split(":")[1].split("//")[1];
    this.ip = ip;
    // console.log(this.ip);

    this.navigation_on=false;
    this.slam_on=false;

    // topics
    this.navigation_on_sub = new ROSLIB.Topic({
      ros: this.ros,
      name: this.namespace+"/controller/navigation",
      messageType: "std_msgs/msg/Bool",
    });
    this.slam_on_sub = new ROSLIB.Topic({
      ros: this.ros,
      name: this.namespace+"/controller/slam",
      messageType: "std_msgs/msg/Bool",
    });
    this.navigation_on_sub.subscribe(this._navigationOnCallback);
    this.slam_on_sub.subscribe(this._slamOnCallback);
    
    // services
    this.navigation_switch_service = new ROSLIB.Service({
      ros: this.ros,
      name: this.namespace+"/controller/navigation_switch",
      serviceType: "message/srv/SwitchService",
    });
    this.slam_switch_service = new ROSLIB.Service({
      ros: this.ros,
      name: this.namespace+"/controller/slam_switch",
      serviceType: "message/srv/SwitchService",
    });
  }

  _navigationOnCallback(msg){
    this.navigation_on=msg.data;
  }
  _slamOnCallback(msg){
    this.slam_on=msg.data;
  }

  /**
   * @function setNavigation
   * @description Set the navigation status
   * @param {boolean} status - Status of the navigation
   */
  setNavigation(status) {

    if(typeof(status)!=Boolean){
      throw new Error("Invalid status type it should boolean");
    }
    let request = new ROSLIB.ServiceRequest({
      switch_service: status,
    });
    this.navigation_switch_service.callService(request, _setNavigationCallback);
  }
  _setNavigationCallback(msg){
    console.log("Navigation status set to: "+msg.result);
  }
  startNavigation(){
    this.setNavigation(true);
  }
  stopNavigation(){
    this.setNavigation(false);
  }

  /**
   * @function setSlam
   * @description Set the slam status
   * @param {boolean} status - Status of the slam
   */
  setSlam(status) {
    if(typeof(status)!=Boolean){
      throw new Error("Invalid status type it should boolean");
    }
    let request = new ROSLIB.ServiceRequest({
      switch_service: status,
    });
    this.slam_switch_service.callService(request, _setSlamCallback);
  }
  _setSlamCallback(msg){
    console.log("Slam status set to: "+msg.result);
  }
  startSlam(){
    this.setSlam(true);
  }
  stopSlam(){
    this.setSlam(false);
  }


}