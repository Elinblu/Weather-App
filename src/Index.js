function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windspeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;

  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  temperatureElement.innerHTML = Math.round(temperature);
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windspeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" 
            class ="weather-app-icon">`;

  let description = response.data.condition.description.toLowerCase();
  updateBackground(description);
  updateTextColors(description);
  getForecast(response.data.city);
}

function updateBackground(description) {
  const body = document.body;

  const texture =
    "url('https://www.transparenttextures.com/patterns/old-map.png')";

  if (description.includes("clear")) {
    body.style.background = `${texture} no-repeat, linear-gradient(to bottom, #87CEEB, #FFA07A)`; // Clear sky
  } else if (
    description.includes("cloud") ||
    description.includes("overcast")
  ) {
    body.style.background = `${texture} no-repeat, linear-gradient(to bottom, #B597F6, #C6F8FF)`; // cloudy
  } else if (description.includes("rain") || description.includes("drizzle")) {
    body.style.background = `${texture} no-repeat, linear-gradient(to bottom, #5F9EA0, #A9A9A9)`; // rain
  } else if (description.includes("snow") || description.includes("sleet")) {
    body.style.background = `${texture} no-repeat, linear-gradient(to bottom, #B0E0E6, #FFFFFF)`; // Snow
  } else if (description.includes("mist") || description.includes("fog")) {
    body.style.background = `${texture} no-repeat, linear-gradient(to bottom, #696969, #DCDCDC)`; // fog
  } else {
    const temperature = parseFloat(
      document.querySelector("#temperature").textContent
    );
  }

  body.style.backgroundSize = "150px 150px, cover";
  body.style.backgroundBlendMode = "overlay";
  body.style.backgroundRepeat = "repeat";
}

function updateTextColors(description) {
  const humidityElement = document.querySelector("#humidity");
  const windspeedElement = document.querySelector("#wind-speed");
  const forecastTemperatures = document.querySelectorAll(
    ".weather-forecast-temperature"
  );

  console.log("Forecast Temperatures Found:", forecastTemperatures);

  let color;
  if (description.includes("clear")) {
    color = "#FFA500"; // orange
  } else if (
    description.includes("cloud") ||
    description.includes("overcast")
  ) {
    color = "#4682B4"; // Teal
  } else if (description.includes("rain") || description.includes("drizzle")) {
    color = "#5F9EA0"; // Dark blue-green
  } else if (description.includes("snow") || description.includes("sleet")) {
    color = "#87CEFA"; // Light blue
  } else if (description.includes("mist") || description.includes("fog")) {
    color = "#DCDCDC"; // Light grey
  } else {
    const temperature = parseFloat(
      document.querySelector("#temperature").textContent
    );
    if (temperature > 25) {
      color = "#FF4500"; // Red-orange
    } else if (temperature < 0) {
      color = "#4682B4"; // Dark blue
    } else {
      color = "#4A4A4A"; // Grey
    }
  }

  humidityElement.style.color = color;
  windspeedElement.style.color = color;

  forecastTemperatures.forEach((temperatureElement) => {
    console.log("Updating color for:", temperatureElement);
    temperatureElement.style.color = color;
  });
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "9520o814t03ab019b07fae5815434801";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "9520o814t03ab019b07fae5815434801";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&unit=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml += `
        <div class="weather-forecast-day">
          <div class="weather-forecast-date">${formatDay(day.time)}</div>
          <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
          <div class="weather-forecast-temperatures">
            <div class="weather-forecast-temperature">
              <strong>${Math.round(day.temperature.maximum)}°</strong>
            </div>
            <div class="weather-forecast-temperature">
              ${Math.round(day.temperature.minimum)}°
            </div>
          </div>
        </div>
      `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;

  let description = document
    .querySelector("#description")
    .innerText.toLowerCase();
  updateTextColors(description);
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Oslo");
