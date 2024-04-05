import ROSLIB from 'roslib';

export class Camera {
  constructor(ros) {
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
  getCameraStatus(index, callback) {
    if (index !== 0) {
      throw new Error('out of camera range');
    }
    this.camera_cur_enable.subscribe(callback);
  }
  getCameraNum() {
    return this.cameraNum;
  }
  subCamCapture(index, callback) {
    if (index !== 0) {
      throw new Error('out of camera range');
    }
    this.camera.subscribe(callback);
  }
  subCamSetting(index, callback) {
    if (index !== 0) {
      throw new Error('out of camera range');
    }
    this.camera_cur_setting.subscribe(callback);
  }
  unSubCamCapture(index) {
    if (index !== 0) {
      throw new Error('out of camera range');
    }
    this.camera.unsubscribe();
  }
  /*
   * @param index: camera index
   * @param affection: 0: no change, 1: object detect, 2: face detect, 3: other
   */
  changeEffect(index, affection = 0) {
    if (index !== 0) {
      throw new Error('out of camera range');
    }
    // throw new Error('Not implemented');
    this.camera_setting.publish(new ROSLIB.Message({ data: affection }));
  }
}
