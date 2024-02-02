import ROSLIB from "roslib";


export class DogConnector {
    dogList={};
    constructor(ros) {
        this.ros = ros;
        this.getDogListClient = new ROSLIB.Service({
            ros: this.ros,
            name: '/dog/list',
            serviceType: 'service/srv/GetDogList'
        });
    }
    getDogList() {
        const request = new ROSLIB.ServiceRequest({});
        this.getDogListClient.callService(request, (result) => {
            console.log(result);
            this.dogList = result;
        });

    }
}