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
    this.ros = ros;
    this.ip="";
    this.domainID=domainID;
    this.movement = new Movement(ros);
    this.camera = new Camera(ros);
    this.action = new Action(ros);
    this.navigation = new BasicNavigator(ros);

    // console.log(this.ros.socket.url);
    //extract ip from url
    let url = this.ros.socket.url;
    let ip = url.split(":")[1].split("//")[1];
    this.ip = ip;
    // console.log(this.ip);
  }
}