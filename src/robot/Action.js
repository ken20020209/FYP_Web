import ROSLIB from 'roslib';

export class Action {
  actionList = {
    Lie_Down: () => this.doAction(1),
    Stand_Up: () => this.doAction(2),
    Crawl: () => this.doAction(3),
    Turn_Around: () => this.doAction(4),
    Mark_Time: () => this.doAction(5),
    Squat: () => this.doAction(6),
    Turn_Roll: () => this.doAction(7),
    Turn_Pitch: () => this.doAction(8),
    Turn_Yaw: () => this.doAction(9),
    Axis_3: () => this.doAction(10),
    pee: () => this.doAction(11),
    Sit_Down: () => this.doAction(12),
    Wave_Hand: () => this.doAction(13),
    Stretch: () => this.doAction(14),
    Wave_Body: () => this.doAction(15),
    Swing: () => this.doAction(16),
    Pray: () => this.doAction(17),
    Seek: () => this.doAction(18),
    Handshake: () => this.doAction(19),
    Reset: () => this.doAction(255)
  };
  constructor(ros) {
    this.ros = ros;

    this.actionTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/action',
      messageType: 'std_msgs/Int32'
    });
  }
  // string action ref action list
  doAction(action) {
    const actionMsg = new ROSLIB.Message({
      data: action
    });
    // console.log(actionMsg);
    this.actionTopic.publish(actionMsg);
  }
}
