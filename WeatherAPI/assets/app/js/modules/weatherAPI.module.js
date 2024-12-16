export default class API {

    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiURL = "https://api.weatherapi.com/v1";
        this.apiMethods = {
            "currentWeather": "/current.json",
            "foreCast": "/forecast.json",
            "search": "/search.json",
            "ipLookup": "/ip.json"
        }
        this.cords = { lat: "", long: "" };
    }


    currentWeather(callbackFunc) {
        this.HTTPCall(this.apiMethods.currentWeather, `q=${this.cords.lat},${this.cords.long}`, callbackFunc);
    }

    foreCast(callbackFunc, numOfdays) {
        this.HTTPCall(this.apiMethods.foreCast, `q=${this.cords.lat},${this.cords.long}&days=${numOfdays}`, callbackFunc);
    }

    search(queryString, callbackFunc) {
        this.HTTPCall(this.apiMethods.search, `q=${queryString}`, callbackFunc);
    }

    HTTPCall(apiMethod, query, callbackFunc) {
        //Create request
        let request = new XMLHttpRequest();
        //Open GET Request from APIURL in constructor
        request.open("GET", this.apiURL + apiMethod + `?key=${this.apiKey}&${query}`);

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