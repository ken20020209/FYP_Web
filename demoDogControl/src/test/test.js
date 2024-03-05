import ROSLIB from "roslib";

const ros = new ROSLIB.Ros({ url: "ws://localhost:9090" });

// ros.getTopics((topics) => {
//     console.log(topics);
//     }
// );

// ros.getServices((services) => {
//     console.log(services);
//     }
// );

let start = new Date().getTime();
let state = 0;
let error = "error";
let count = 1;
const times = 1000;
const getNodes = () => {
  ros.getNodes((nodes) => {
    // console.log(1);
    if (state == 1) {
    //   console.log(error);
      state = 0;
    }
    state = 1;
    count++;
    if (count % 100 == 0) {
      console.log(count);
    }
    if (count == times * 2) {
      let end = new Date().getTime();
      console.log("time:" + (end - start).toString());
    }
  });
  ros.getTopics((topics) => {
    if (state == 2) {
    //   console.log(error);
      state = 0;
    }
    state = 2;
    count++;
    if (count % 100 == 0) {
      console.log(count);
    }
    if (count == times * 2) {
      let end = new Date().getTime();
      console.log("time:" + (end - start).toString());
    }
  });
};

for (let i = 0; i < times; i++) {
  getNodes();
}
let end = new Date().getTime();
console.log(end - start);
// ros.close();
