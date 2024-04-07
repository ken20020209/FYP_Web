import ROSLIB from 'roslib';

export class Movement {
  private ros: ROSLIB.Ros;
  private cmd_vel: ROSLIB.Topic;
  private linear: { x: number; y: number; z: number };
  private angular: { x: number; y: number; z: number };

  constructor(ros: ROSLIB.Ros) {
    this.ros = ros;

    this.cmd_vel = new ROSLIB.Topic({
      ros: this.ros,
      name: '/cmd_vel',
      messageType: 'geometry_msgs/Twist'
    });
    this.linear = {} as any;
    this.angular = {} as any;

    this.initTwist();
    // this.stop();
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
    const twist = new ROSLIB.Message({
      linear: this.linear,
      angular: this.angular
    });
    this.cmd_vel.publish(twist);
  }
  move_forward(speed: number = 0.5) {
    this.linear.x = speed;
    this.cmd_vel_publish();
  }
  move_backward(speed: number = -0.5) {
    this.linear.x = speed;
    this.cmd_vel_publish();
  }
  move_left(speed: number = 0.5) {
    this.linear.y = speed;
    this.cmd_vel_publish();
  }
  move_right(speed: number = -0.5) {
    this.linear.y = speed;
    this.cmd_vel_publish();
  }
  turn_left(speed: number = 0.5) {
    this.angular.z = speed;
    this.cmd_vel_publish();
  }
  turn_right(speed: number = -0.5) {
    this.angular.z = speed;
    this.cmd_vel_publish();
  }
  stop() {
    this.initTwist();
    this.cmd_vel_publish();
  }
}
