import ROSLIB, { Pose, Service, Topic } from 'roslib';

// basic nav2 simple commander api
export class BasicNavigator {
  ros: ROSLIB.Ros;
  namespace: string;
  is_task_complete_topic: ROSLIB.Topic<ROSLIB.Message>;
  feedback_topic: ROSLIB.Topic<ROSLIB.Message>;
  moveToPoint_client: ROSLIB.Service<any, any>;
  moveToPoints_client: ROSLIB.Service<any, any>;
  partrolPoints_client: ROSLIB.Service<any, any>;
  stopNavigation_client: ROSLIB.Service<any, any>;
  followObject_client: ROSLIB.Service<any, any>;
  constructor(ros: ROSLIB.Ros, namespace = '') {
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
  createPose2D(x: number, y: number, yaw: number) {
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
  moveToPoint(pose: ROSLIB.Pose, callback?: (msg: { result: string }) => void) {
    const request = new ROSLIB.ServiceRequest({
      pose
    });
    this.moveToPoint_client.callService(request, callback as any);
  }
  moveToPoints(poses: ROSLIB.Pose[], callback?: (msg: { result: string }) => void) {
    const request = new ROSLIB.ServiceRequest({
      poses
    });
    this.moveToPoints_client.callService(request, callback as any);
  }
  patrolPoints(poses: ROSLIB.Pose[], callback?: (msg: { result: string }) => void) {
    const request = new ROSLIB.ServiceRequest({
      poses
    });
    this.partrolPoints_client.callService(request, callback as any);
  }
  stopNavigation(callback?: (msg: { result: string }) => void) {
    const request = new ROSLIB.ServiceRequest({});
    this.stopNavigation_client.callService(request, callback as any);
  }
  followObject(object: any, callback: any) {
    throw new Error('Method not implemented.');
    const request = new ROSLIB.ServiceRequest({
      object
    });
    this.followObject_client.callService(request, callback);
  }
  // feedback
  onFeedback(callback: { (msg: { data: string }): void }) {
    this.feedback_topic.subscribe(callback as any);
  }
  // task complete
  isTaskComplete(callback: { (msg: { data: boolean }): void }) {
    this.is_task_complete_topic.subscribe(callback as any);
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
