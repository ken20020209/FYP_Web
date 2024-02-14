import ROSLIB from "roslib";
import { Movement } from "./Movement";
import { Camera } from "./Camera";
import { Action } from "./Action";
import { BasicNavigator } from "./Navigation";

/**
 * @class Controller
 * @classdesc Controller class for the robot dog
 * @param {ROSLIB.Ros} ros - ROS connection
 * @param {string} name - Name of the robot dog
 */
export class Controller {
  constructor(ros,name='') {
    this.name=name;
    this.ros = ros;
    this.movement = new Movement(ros);
    this.camera = new Camera(ros);
    this.action = new Action(ros);
    this.navigation = new BasicNavigator(ros, name);
  }
}