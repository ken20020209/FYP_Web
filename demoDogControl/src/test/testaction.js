import ROSLIB from "roslib";

const ros = new ROSLIB.Ros({ url: "ws://localhost:9090" });

const fib=new ROSLIB.Action({
    ros: ros,
    name:  "/fibonacci",
    actionType: "action_tutorials_interfaces/action/Fibonacci",
});

let id=0;
id=fib.sendGoal({order: 5}
    , (result) => {
        console.log("result: ", result);
    }
    , (feedback) => {
        console.log("feedback: ", feedback);
        fib.cancelGoal(id);
    }
    , (error) => {
        console.log("error: ", error);
    }
);

// fib.sendGoal({order: 5}
//     , (result) => {
//         console.log("result: ", result);
//     }
//     , (feedback) => {
//         console.log("feedback: ", feedback);
//     }
//     , (error) => {
//         console.log("error: ", error);
//     }
// );

// fib.cancelGoal();