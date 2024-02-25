import ROSLIB from "roslib";


export class Camera {
  constructor(ros) {
    this.ros = ros;

    this.camera = new ROSLIB.Topic({
      ros: this.ros,
      name: "/camera/processed",
      messageType: "sensor_msgs/msg/CompressedImage",
    });
    this.camera_enable = new ROSLIB.Topic({
      ros: this.ros,
      name: "/camera/enable",
      messageType: "std_msgs/msg/Bool",
    });
  }

  enableCamera(index=0) {
    this.camera_enable.publish(new ROSLIB.Message({ data: true }));
  }
  disableCamera(index=0) {
    this.camera_enable.publish(new ROSLIB.Message({ data: false }));
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