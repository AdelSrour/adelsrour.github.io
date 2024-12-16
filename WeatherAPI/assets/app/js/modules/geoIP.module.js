export default class API {

    constructor() {
        this.apiURL = "https://get.geojs.io/v1/ip/geo.json";
    }

    call(callbackFunc) {
        //Create request
        let request = new XMLHttpRequest();
        //Open GET Request from APIURL in constructor
        request.open("GET", this.apiURL);

        //When request is finished
        request.onload = function () {
            //If its successful
            if (request.status === 200) {
                //Send callback function current response and status as true
                callbackFunc({ status: true, response: JSON.parse(request.responseText) })
            } else {
                //Send callback function a false status
                callbackFunc({ status: false })
            }
        }

        request.send();
    }
}