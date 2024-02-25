import { Pose, ROSLIB, Action, Topic } from "roslib";

//basic nav2 simple commander api
export class BasicNavigator {
    constructor(ros, namespace) {
        this.ros = ros;

        this.action=null;
        this.actionGoalId=null;

        this.follow_waypoints_client = new Action({
            ros: this.ros,
            name: namespace + "/FollowWaypoints",
            actionType: "nav2_msgs/action/FollowWaypoints",
        });

        this.nav_to_pose_client = new Action({
            ros: this.ros,
            name: namespace + "/navigate_to_pose",
            actionType: "nav2_msgs/action/NavigateToPose",
        });

        this.initial_pose_pub=new Topic({
            ros: this.ros,
            name: namespace + "/initialpose",
            messageType: "geometry_msgs/PoseWithCovarianceStamped",
        });
    }
    /**
     * @param {Pose} initial_pose
     * Sets the initial goal pose to the current robot pose.
     */
    setInitGoalPose(initial_pose) {
        let currentTime = new Date();
        let secs = Math.floor(currentTime.getTime()/1000);
        let nsecs = Math.round(1000000000*(currentTime.getTime()/1000-secs));
        let msg = {
            header:{
                stamp:{
                    sec:secs,
                    nanosec:nsecs
                },
                frame_id:'map'
            },
            pose:{
                pose:initial_pose,
                covariance:[
                    0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0
                ]
            }
        };
        console.log(msg)
        this.info(`Setting initial goal pose to: ${initial_pose}....`);
        this.initial_pose_pub.publish(msg);
    }
    /**
     *
     * @param {pose} pose
     * Requests the robot to drive to a pose (PoseStamped).
     */
    goToPose(pose,behavior_tree='') {
        if(this.action!=null){
            this.cancelTask();
        }
        let currentTime = new Date();
        let secs = Math.floor(currentTime.getTime()/1000);
        let nsecs = Math.round(1000000000*(currentTime.getTime()/1000-secs));
        let goal_msg={
            pose:{
                header:{
                    stamp:{
                        sec:secs,
                        nanosec:nsecs
                    },
                    frame_id:'map'
                },
                pose:pose

            },
            behavior_tree:behavior_tree
        };
        this.info(`Going to pose: ${pose}....`);
        this.action=this.nav_to_pose_client;
        this.actionGoalId = this.nav_to_pose_client.sendGoal(
            goal_msg,
            this.resultCallback,
            this.feedbackCallback
        );
     }

    feedbackCallback(feedback) {
        // console.log(`Navigation feedback:`);
        // console.log(feedback);
    }
    resultCallback(result) {
        console.log(`Navigation result: `);
        console.log(result);
    }
    /**
     *
     * @param {Pose[]} poses
     *
     */
    followWaypoints(poses) {
        if(this.action!=null){
            this.cancelTask();
        }
        let currentTime = new Date();
        let secs = Math.floor(currentTime.getTime()/1000);
        let nsecs = Math.round(1000000000*(currentTime.getTime()/1000-secs));
        let goal_msg = {
            poses: [],
        };
        poses.forEach(pose=>{
            goal_msg.poses.push({
                header:{
                    stamp:{
                        sec:secs,
                        nanosec:nsecs
                    },
                    frame_id:'map'
                },
                pose:pose
            });
        });

        
        this.info(`Following waypoints: ${poses} goals....`);
        this.action=this.follow_waypoints_client;
        this.actionGoalId = this.follow_waypoints_client.sendGoal(
            goal_msg,
            this.resultCallback,
            this.feedbackCallback
        );
    }

    /**
     *
     * @param {string} map_filepath
     * Requests a change from the current map to map_filepath’s yaml.
     */
    changeMap(map_filepath) { 
        throw new Error("Not implemented");
    }
    /**
     *
     * Cancel an ongoing task, including route tasks.
     * Requests a change from the current map to map_name.
     */
    cancelTask() { 
        this.action.cancelGoal(this.actionGoalId);
        this.action=null;
        this.actionGoalId=null;
    }


    info(msg) {
        console.log(msg);
    }
    warn(msg) {
        console.warn(msg);
    }
    error(msg) {
        console.error(msg);
    }
    debug(msg) {
        console.debug(msg);
    }
}
