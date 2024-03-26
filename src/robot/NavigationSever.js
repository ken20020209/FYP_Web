import ROSLIB, { Pose, Service, Topic } from 'roslib';

// basic nav2 simple commander api
export class BasicNavigator {
  constructor(ros, namespace = '') {
    this.ros = ros;
    this.namespace = namespace;

    // create the subscribers
    this.is_task_complete_topic = new Topic({
      ros: this.ros,
      name: `${namespace}/nav2/is_task_complete`,
      messageType: 'std_msgs/Bool'
    });
    this.feedback_topic = new Topic({
      ros: this.ros,
      name: `${namespace}/nav2/feedback`,
      messageType: 'std_msgs/String'
    });

    // create the service
    this.moveToPoint_client = new Service({
      ros: this.ros,
      name: `${namespace}/nav2/move_to_point`,
      serviceType: 'message/srv/MoveToPoint'
    });
    this.moveToPoints_client = new Service({
      ros: this.ros,
      name: `${namespace}/nav2/move_to_points`,
      serviceType: 'message/srv/MoveToPoints'
    });
    this.partrolPoints_client = new Service({
      ros: this.ros,
      name: `${namespace}/nav2/patrol_points`,
      serviceType: 'message/srv/PatrolPoints'
    });
    this.stopNavigation_client = new Service({
      ros: this.ros,
      name: `${namespace}/nav2/stop_navigation`,
      serviceType: 'message/srv/StopNavigation'
    });
    this.followObject_client = new Service({
      ros: this.ros,
      name: `${namespace}/nav2/follow_object`,
      serviceType: 'message/srv/FollowObject'
    });
  }
  // craete 2d pose by x, y, and yaw
  // eslint-disable-next-line class-methods-use-this
  createPose2D(x, y, yaw) {
    return new Pose({
      position: {
        x,
        y
      },
      orientation: {
        z: Math.sin(yaw / 2),
        w: Math.cos(yaw / 2)
      }
    });
  }

  // move to a single point
  moveToPoint(pose, callback) {
    const request = new ROSLIB.ServiceRequest({
      pose
    });
    this.moveToPoint_client.callService(request, callback);
  }
  moveToPoints(poses, callback) {
    const request = new ROSLIB.ServiceRequest({
      poses
    });
    this.moveToPoints_client.callService(request, callback);
  }
  patrolPoints(poses, callback) {
    const request = new ROSLIB.ServiceRequest({
      poses
    });
    this.partrolPoints_client.callService(request, callback);
  }
  stopNavigation(callback) {
    const request = new ROSLIB.ServiceRequest({});
    this.stopNavigation_client.callService(request, callback);
  }
  followObject(object, callback) {
    throw new Error('Method not implemented.');
    const request = new ROSLIB.ServiceRequest({
      object
    });
    this.followObject_client.callService(request, callback);
  }
  // feedback
  onFeedback(callback) {
    this.feedback_topic.subscribe(callback);
  }
  // task complete
  isTaskComplete(callback) {
    this.is_task_complete_topic.subscribe(callback);
  }
  // cancel feedback
  cancelFeedback() {
    this.feedback_topic.unsubscribe();
  }
  // cancel task complete
  cancelTaskComplete() {
    this.is_task_complete_topic.unsubscribe();
  }
}
