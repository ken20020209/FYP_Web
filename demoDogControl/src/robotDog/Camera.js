import ROSLIB from "roslib";


export class Camera {
  constructor(ros) {
    this.ros = ros;

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