import ROSLIB from 'roslib';

export class Camera {
  camera_enable: ROSLIB.Topic<ROSLIB.Message>;
  ros: ROSLIB.Ros;
  cameraNum: number;
  camera: ROSLIB.Topic<ROSLIB.Message>;
  camera_cur_enable: ROSLIB.Topic<ROSLIB.Message>;
  camera_setting: ROSLIB.Topic<ROSLIB.Message>;
  camera_cur_setting: ROSLIB.Topic<ROSLIB.Message>;
  constructor(ros: ROSLIB.Ros) {
    this.ros = ros;
    this.cameraNum = 1;

    this.camera = new ROSLIB.Topic({
      ros: this.ros,
      name: '/camera/processed',
      messageType: 'sensor_msgs/msg/CompressedImage'
    });
    this.camera_enable = new ROSLIB.Topic({
      ros: this.ros,
      name: '/camera/enable',
      messageType: 'std_msgs/msg/Bool'
    });
    this.camera_cur_enable = new ROSLIB.Topic({
      ros: this.ros,
      name: '/camera/enable/current',
      messageType: 'std_msgs/msg/Bool'
    });

    this.camera_setting = new ROSLIB.Topic({
      ros: this.ros,
      name: '/camera/setting',
      messageType: 'std_msgs/msg/Int32'
    });
    this.camera_cur_setting = new ROSLIB.Topic({
      ros: this.ros,
      name: '/camera/setting/current',
      messageType: 'std_msgs/msg/Int32'
    });
  }

  enableCamera(index = 0) {
    if (index !== 0) {
      throw new Error('out of camera range');
    }
    this.camera_enable.publish(new ROSLIB.Message({ data: true }));
  }
  disableCamera(index = 0) {
    if (index !== 0) {
      throw new Error('out of camera range');
    }
    this.camera_enable.publish(new ROSLIB.Message({ data: false }));
  }
  getCameraStatus(index: number, callback: { (msg: { data: boolean }): void }) {
    if (index !== 0) {
      throw new Error('out of camera range');
    }
    this.camera_cur_enable.subscribe(callback as any);
  }
  getCameraNum() {
    return this.cameraNum;
  }
  subCamCapture(index: number, callback: { (msg: { data: String }): void }) {
    if (index !== 0) {
      throw new Error('out of camera range');
    }
    this.camera.subscribe(callback as any);
  }
  subCamSetting(index: number, callback: { (msg: { data: number }): void }) {
    if (index !== 0) {
      throw new Error('out of camera range');
    }
    this.camera_cur_setting.subscribe(callback as any);
  }
  unSubCamCapture(index: number) {
    if (index !== 0) {
      throw new Error('out of camera range');
    }
    this.camera.unsubscribe();
  }
  /*
   * @param index: camera index
   * @param affection: 0: no change, 1: object detect, 2: face detect, 3: other
   */
  changeEffect(index: number, affection = 0) {
    if (index !== 0) {
      throw new Error('out of camera range');
    }
    // throw new Error('Not implemented');
    this.camera_setting.publish(new ROSLIB.Message({ data: affection }));
  }
}
