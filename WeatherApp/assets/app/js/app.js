import weatherAPI from "./modules/weatherAPI.module.js";
import geoAPI from "./modules/geoIP.module.js"

//Prepare our API
var geolocation = new geoAPI();
var weather = new weatherAPI("9b23e2aa86bf4681b99134435241512");

//Get weather cords
setTimeout(() => {
    geolocation.call((geoInfo) => {
        if (geoInfo.status === true) {
            updateWeather(geoInfo.response.latitude, geoInfo.response.longitude);
        }
    });
}, 2000);

//Function to update weather
function updateWeather(lat, log) {
    //Set current cords
    weather.cords = { lat: lat, long: log };

    //Get forecast Weather also includes current weather
    weather.foreCast((result) => {

        if (result.status === false) {
            setTimeout(() => { updateWeather(lat, log); }, 5000);
            return;
        }

        document.getElementById("weatherNow").innerHTML = `${Math.round(result.response.current.temp_c)} <span class="degree">°c</span> <div class="currentIcon text-center"><img src="https://${result.response.current.condition.icon}" class="mw-100"> <span>${result.response.current.condition.text}</span></div>`;
        document.getElementById("weatherCity").innerHTML = `${result.response.location.name}`;
        document.getElementById("weatherStatus").innerHTML = `
                <i class="fa-solid fa-sun"></i> ${result.response.current.uv} UV
                <i class="fa-solid fa-droplet ms-2"></i> ${result.response.current.humidity}%
                <i class="fa-solid fa-wind ms-2"></i> ${result.response.current.wind_mph} MPH
        `


        let tablebody = ``;
        result.response.forecast.forecastday.forEach((forecastday, index) => {
            let currentDate = new Date(forecastday.date);
            let currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
            currentDay = index === 0 ? "Today" : currentDay;

            let condition = forecastday.day.condition.icon;
            let maxtemp = Math.round(forecastday.day.maxtemp_c);
            let mintemp = Math.round(forecastday.day.mintemp_c);

            tablebody += `
            <tr>
                <td>${currentDay}</td>
                <td><img src="https://${condition}" class="mw-100"></td>
                <td>${maxtemp}<span class="degree">°c</span></td>
                <td>${mintemp}<span class="degree">°c</span></td>
            </tr>
            `
        });
        document.getElementById("weatherTableBody").innerHTML = tablebody;

    }, 7);
}


//Function to get search results from API
function searchWeather(target) {
    weather.search(target.value, (response) => {

        //Check if input in focus
       if (document.activeElement != searchInput){
            return;
       }
        

        //Remove old search results
        searchResults.querySelectorAll("option").forEach((items) => {
            items.remove();
        });

        //If api request is ok
        if (response.status === true) {

            //Show results box
            searchResults.style.opacity = "1";

            //Add found results into results box
            response.response.forEach(result => {

                let selectOption = document.createElement("option");
                selectOption.innerText = `${result.name}, ${result.region}, ${result.country}`;
                selectOption.value = `${result.lat},${result.lon}`;
                searchResults.appendChild(selectOption);

            });

            //change results box height based on results
            if (searchResults.options.length > 0) {
                searchResults.style.height = ((searchResults.options[0].offsetHeight * (searchResults.options.length)) + 15) + "px";
            } else {
                //If nothing found add "nothing found text"
                let selectOption = document.createElement("option");
                selectOption.innerText = "No results found."
                selectOption.disabled = true;
                searchResults.appendChild(selectOption)
                searchResults.style.height = (searchResults.options[0].offsetHeight + 15) + "px";
            }
        }
    });
}

//On input search change, call search API and handle cooldown
let searchCooldown;
let searchResults = document.getElementById("ac-options");
let searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keydown", (event) => {
    clearTimeout(searchCooldown);
    searchCooldown = setTimeout(() => { searchWeather(event.target); clearTimeout(searchCooldown) }, 600);
});

//Search selected item
searchResults.addEventListener("click", (event) => {
    updateWeather(searchResults.value.split(",")[0], searchResults.value.split(",")[1]);
    searchResults.style.height = "0";
    searchResults.style.opacity = "0";
    searchInput.value = "";
    searchInput.placeholder = searchResults.options[searchResults.selectedIndex].innerText;
});