import ROSLIB from 'roslib';

export class Action {
  private ros: ROSLIB.Ros;
  private actionTopic: ROSLIB.Topic;
  public actionList: { [key: string]: () => void } = {
    lie_down: () => this.doAction(1),
    stand_up: () => this.doAction(2),
    crawl: () => this.doAction(3),
    turn_around: () => this.doAction(4),
    mark_time: () => this.doAction(5),
    squat: () => this.doAction(6),
    turn_roll: () => this.doAction(7),
    turn_pitch: () => this.doAction(8),
    turn_yaw: () => this.doAction(9),
    axis_3: () => this.doAction(10),
    pee: () => this.doAction(11),
    sit_down: () => this.doAction(12),
    wave_hand: () => this.doAction(13),
    stretch: () => this.doAction(14),
    wave_body: () => this.doAction(15),
    swing: () => this.doAction(16),
    pray: () => this.doAction(17),
    seek: () => this.doAction(18),
    handshake: () => this.doAction(19),
    reset: () => this.doAction(255)
  };
  constructor(ros: ROSLIB.Ros) {
    this.ros = ros;

    this.actionTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/action',
      messageType: 'std_msgs/Int32'
    });
  }
  // string action ref action list
  doAction(action: number) {
    const actionMsg = new ROSLIB.Message({
      data: action
    });
    // console.log(actionMsg);
    this.actionTopic.publish(actionMsg);
  }
}
