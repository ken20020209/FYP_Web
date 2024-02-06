import ROSLIB from "roslib";



export class Movement {
  constructor(ros) {
    this.ros = ros;
    this.ros.on("connection", () => {
      console.log("Connected to websocket server.");
    });
    this.ros.on("error", (error) => {
      console.log("Error connecting to websocket server: ", error);
    });
    this.ros.on("close", () => {
      console.log("Connection to websocket server closed.");
    });

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

export class Camera {
  constructor(ros) {
    this.ros = ros;
    this.ros.on("connection", () => {
      console.log("Connected to websocket server.");
    });
    this.ros.on("error", (error) => {
      console.log("Error connecting to websocket server: ", error);
    });
    this.ros.on("close", () => {
      console.log("Connection to websocket server closed.");
    });

    this.camera = new ROSLIB.Topic({
      ros: this.ros,
      name: "/camera/processed",
      messageType: "sensor_msgs/msg/CompressedImage",
    });
  }

  getCameraNum() {
    return 1;
  }
  subCamCapture(index, callback) {
    if (index != 0) {
      throw new Error("out of camera range");
    }
    this.camera.subscribe(callback);
  }
  unSubCamCapture(index) {
    this.camera.unsubscribe();
  }
  changeEffect(index, affection) {
    throw new Error("Not implemented");
  }
}

export class Action {
  actionList = {
    Lie_Down: ()=>this.#doAction(1),
    Stand_Up: ()=>this.#doAction(2),
    Crawl: ()=>this.#doAction(3),
    Turn_Around: ()=>this.#doAction(4),
    Mark_Time: ()=>this.#doAction(5),
    Squat: ()=>this.#doAction(6),
    Turn_Roll: ()=>this.#doAction(7),
    Turn_Pitch: ()=>this.#doAction(8),
    Turn_Yaw: ()=>this.#doAction(9),
    Axis_3: ()=>this.#doAction(10),
    pee: ()=>this.#doAction(11),
    Sit_Down: ()=>this.#doAction(12),
    Wave_Hand: ()=>this.#doAction(13),
    Stretch: ()=>this.#doAction(14),
    Wave_Body: ()=>this.#doAction(15),
    Swing: ()=>this.#doAction(16),
    Pray: ()=>this.#doAction(17),
    Seek: ()=>this.#doAction(18),
    Handshake: ()=>this.#doAction(19),
    Reset: ()=>this.#doAction(255),
  };
  constructor(ros) {
    this.ros = ros;
    this.ros.on("connection", () => {
      console.log("Connected to websocket server.");
    });
    this.ros.on("error", (error) => {
      console.log("Error connecting to websocket server: ", error);
    });
    this.ros.on("close", () => {
      console.log("Connection to websocket server closed.");
    });

    this.actionTopic = new ROSLIB.Topic({
      ros: this.ros,
      name: "/action",
      messageType: "std_msgs/Int32",
    });
  }
  //string action ref action list
  #doAction(action) {
    var actionMsg = new ROSLIB.Message({
      data: action,
    });
    // console.log(actionMsg);
    this.actionTopic.publish(actionMsg);
  }
}
