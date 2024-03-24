/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable guard-for-in */
// import ROSLIB from 'roslib';

// this class group the dog controller
// it will same same command to dog group
// it not  work for navigation

export class DogGroupFrontend {
  dogControllerList = {};
  constructor(ros) {
    this.ros = ros;
  }

  // change : the addDog and remove dog may use another parameter (not use dogController)
  addDog(dogController) {
    if (dogController.name in this.dogControllerList) {
      throw new Error('Dog name already exist');
    }
    this.dogControllerList[dogController.name] = dogController;
  }
  removeDog(dogController) {
    if (dogController.name in this.dogControllerList) {
      delete this.dogControllerList[dogController.name];
    }
  }

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

  action = { actionList: this.actionList };
  // action control
  doAction(action) {
    for (const key in this.dogControllerList) {
      this.dogControllerList[key].action.doAction(action);
    }
  }

  // movement control
  move_forward(speed) {
    for (const key in this.dogControllerList) {
      this.dogControllerList[key].movement.move_forward(speed);
    }
  }
  move_backward(speed) {
    for (const key in this.dogControllerList) {
      this.dogControllerList[key].movement.move_backward(speed);
    }
  }
  move_left(speed) {
    for (const key in this.dogControllerList) {
      this.dogControllerList[key].movement.move_left(speed);
    }
  }
  move_right(speed) {
    for (const key in this.dogControllerList) {
      this.dogControllerList[key].movement.move_right(speed);
    }
  }
  turn_left(speed) {
    for (const key in this.dogControllerList) {
      this.dogControllerList[key].movement.turn_left(speed);
    }
  }
  turn_right(speed) {
    for (const key in this.dogControllerList) {
      this.dogControllerList[key].movement.turn_right(speed);
    }
  }
  stop() {
    for (const key in this.dogControllerList) {
      this.dogControllerList[key].movement.stop();
    }
  }

  // camera custom by control camera class
}
