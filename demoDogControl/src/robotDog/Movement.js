import ROSLIB from "roslib";

export class Movement {
    constructor(ros) {
      this.ros = ros;
  
      this.cmd_vel = new ROSLIB.Topic({
        ros: this.ros,
        name: "/cmd_vel",
        messageType: "geometry_msgs/Twist",
      });
      this.linear = {};
      this.angular = {};
  
      this.initTwist();
      this.stop();
    }
    initTwist() {
      this.linear.x = 0;
      this.linear.y = 0;
      this.linear.z = 0;
      this.angular.x = 0;
      this.angular.y = 0;
      this.angular.z = 0;
    }
    cmd_vel_publish() {
      // debug message
      // console.log(this.linear);
      var twist = new ROSLIB.Message({
        linear: this.linear,
        angular: this.angular,
      });
      this.cmd_vel.publish(twist);
    }
    move_forward(speed) {
      this.linear.x = speed || 0.5;
      this.cmd_vel_publish();
    }
    move_backward(speed) {
      this.linear.x = speed || -0.5;
      this.cmd_vel_publish();
    }
    move_left(speed) {
      this.linear.y = speed || 0.5;
      this.cmd_vel_publish();
    }
    move_right(speed) {
      this.linear.y = speed || -0.5;
      this.cmd_vel_publish();
    }
    turn_left(speed) {
      this.angular.z = speed || 1;
      this.cmd_vel_publish();
    }
    turn_right(speed) {
      this.angular.z = speed || -1;
      this.cmd_vel_publish();
    }
    stop() {
      this.initTwist();
      this.cmd_vel_publish();
    }
  }