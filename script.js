// Weather App //

// some variables
let lat, lon;
let cityName = document.getElementById("findlocation");
const apiKey = "93cceba7e6550a182e95da64d5b28944";
const showResult = document.getElementById("showResult");
const showMyHistory = document.getElementById("showHistory");
const details = document.querySelector(".weather");
let history = {};

// make h2 headings hidden at first load
const smallHeadings = document.querySelectorAll("h2");
smallHeadings.forEach((h2) => (h2.style.display = "none"));

document.querySelector(".search").onsubmit = (e) => {
  e.preventDefault();
  cityName = document.getElementById("findLocation").value.toUpperCase();

  addHistory(cityName);

  // api call for location data
  const geocodingApi = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;
  fetch(geocodingApi)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((geoData) => {
      // get lat & lon data
      lat = geoData[0].lat;
      lon = geoData[0].lon;

      const weatherApi = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${apiKey}`;
      fetch(weatherApi)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((weatherData) => {
          // search summary
          const li = document.createElement("li");
          li.textContent = `${cityName} Latitude: ${weatherData.lat} Longitude: ${weatherData.lon} Timezone: ${weatherData.timezone}`;
          showResult.prepend(li);

          // add data to table
          showData(weatherData);

          // clear searchbar
          document.getElementById("findLocation").value = "";

          //make h2 visible again
          smallHeadings.forEach((h2) => (h2.style.display = "block"));
        });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      alert("An error occured while fetching data. Please enter a valid city.");
    });
};

// implementing data to html

function showData(weatherData) {
  const tableHTML = `
    <table id="details">
            <thead>
              <tr>
                <th><p>${cityName}</p><img src="https://openweathermap.org/img/wn/${
    weatherData.current.weather[0].icon
  }@2x.png" alt="weather icon"></th>
                <th>Current</th>
                <th>Today</th>
                <th>Tomorrow</th>
                <th>The Day After Tomorrow</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Temperature</td>
                <td>${weatherData.current.temp + "° C"}</td>
                <td>${weatherData.daily[0].temp.day + "° C"}</td>
                <td>${weatherData.daily[1].temp.day + "° C"}</td>
                <td>${weatherData.daily[2].temp.day + "° C"}</td>
              </tr>
              <tr>
                <td>Humiditiy</td>
                <td>${"% " + weatherData.current.humidity}</td>
                <td>${"% " + weatherData.daily[0].humidity}</td>
                <td>${"% " + weatherData.daily[1].humidity}</td>
                <td>${"% " + weatherData.daily[2].humidity}</td>
              </tr>
              <tr>
                <td>Feels Like</td>
                <td>${weatherData.current.feels_like + "° C"}</td>
                <td>${weatherData.daily[0].feels_like.day}</td>
                <td>${weatherData.daily[1].feels_like.day}</td>
                <td>${weatherData.daily[2].feels_like.day}</td>
              </tr>
              <tr>
                <td>Sunrise</td>
                <td>${formatTime(weatherData.current.sunrise)}</td>
                <td>${formatTime(weatherData.daily[0].sunrise)}</td>
                <td>${formatTime(weatherData.daily[1].sunrise)}</td>
                <td>${formatTime(weatherData.daily[2].sunrise)}</td>
              </tr>
              <tr>
                <td>Sunset</td>
                <td>${formatTime(weatherData.current.sunset)}</td>
                <td>${formatTime(weatherData.daily[0].sunset)}</td>
                <td>${formatTime(weatherData.daily[1].sunset)}</td>
                <td>${formatTime(weatherData.daily[2].sunset)}</td>
              </tr>
            </tbody>
            <tfoot>
                <tr>
                <th>Summary</th>
                <td>${weatherData.current.weather[0].description}</td>
                <td>${weatherData.daily[0].summary}</td>
                <td>${weatherData.daily[1].summary}</td>
                <td>${weatherData.daily[2].summary}</td>
                </tr>
            </tfoot>
          </table>
    `;
  details.insertAdjacentHTML("afterbegin", tableHTML);
}

// Unix time convertion

function formatTime(unixTime) {
  const date = new Date(unixTime * 1000);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const newTime = `${hours}:${minutes}`;
  return newTime;
}

// local storage

// add to local storage
function addHistory(cityName) {
  let searchHistory = localStorage.getItem("searchHistory");
  if (!searchHistory) {
    searchHistory = [];
  } else {
    searchHistory = JSON.parse(searchHistory);
  }
  searchHistory.push(cityName);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  //showHistory();
}
// addHistory(cityName);

// display local storage

function showHistory() {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (searchHistory && searchHistory.length > 0) {
    searchHistory.forEach((search) => {
      const li = document.createElement("li");
      li.textContent = search;
      showMyHistory.appendChild(li);
    });
  }
}
window.addEventListener("DOMContentLoaded", showHistory);
