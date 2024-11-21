let favoriteCities = [];

function refreshWeather(response) {
  const temperatureElement = document.querySelector("#temperature");
  const cityElement = document.querySelector("#city");
  const descriptionElement = document.querySelector("#description");
  const humidityElement = document.querySelector("#humidity");
  const windspeedElement = document.querySelector("#wind-speed");
  const timeElement = document.querySelector("#time");
  const date = new Date(response.data.time * 1000);
  const iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  temperatureElement.innerHTML = `${Math.round(
    response.data.temperature.current
  )}°C`;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windspeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon">`;

  const description = response.data.condition.description.toLowerCase();
  updateBackground(description);
  updateTextColors(description);
  getForecast(response.data.city);
}

function updateBackground(description) {
  const body = document.body;
  const texture =
    "url('https://www.transparenttextures.com/patterns/old-map.png')";

  if (description.includes("clear")) {
    body.style.background = `${texture} no-repeat, linear-gradient(to bottom, #87CEEB, #FFA07A)`;
  } else if (
    description.includes("cloud") ||
    description.includes("overcast")
  ) {
    body.style.background = `${texture} no-repeat, linear-gradient(to bottom, #B597F6, #C6F8FF)`;
  } else if (description.includes("rain") || description.includes("drizzle")) {
    body.style.background = `${texture} no-repeat, linear-gradient(to bottom, #5F9EA0, #A9A9A9)`;
  } else if (description.includes("snow") || description.includes("sleet")) {
    body.style.background = `${texture} no-repeat, linear-gradient(to bottom, #B0E0E6, #FFFFFF)`;
  } else if (description.includes("mist") || description.includes("fog")) {
    body.style.background = `${texture} no-repeat, linear-gradient(to bottom, #696969, #DCDCDC)`;
  }

  body.style.backgroundSize = "150px 150px, cover";
  body.style.backgroundBlendMode = "overlay";
  body.style.backgroundRepeat = "repeat";
}

function updateTextColors(description) {
  const humidityElement = document.querySelector("#humidity");
  const windspeedElement = document.querySelector("#wind-speed");

  let color;
  if (description.includes("clear")) {
    color = "#FFA500";
  } else if (
    description.includes("cloud") ||
    description.includes("overcast")
  ) {
    color = "#4682B4";
  } else if (description.includes("rain") || description.includes("drizzle")) {
    color = "#5F9EA0";
  } else if (description.includes("snow") || description.includes("sleet")) {
    color = "#87CEFA";
  } else if (description.includes("mist") || description.includes("fog")) {
    color = "#DCDCDC";
  }

  humidityElement.style.color = color;
  windspeedElement.style.color = color;
}

function addFavoriteCity() {
  const cityName = document.querySelector("#city").innerText;
  const temperature = document.querySelector("#temperature").innerText;
  const weatherIcon = document.querySelector("#icon img").src;

  if (!favoriteCities.some((city) => city.name === cityName)) {
    favoriteCities.push({
      name: cityName,
      temp: temperature,
      icon: weatherIcon,
    });
    displayFavorites();
  }
}

function displayFavorites() {
  const favoritesContainer = document.querySelector("#favorites-container");
  favoritesContainer.innerHTML = "";

  favoriteCities.forEach((city) => {
    const cityCard = document.createElement("div");
    cityCard.classList.add("favorite-card");
    cityCard.innerHTML = `
      <div>${city.name}</div>
      <img src="${city.icon}" alt="Weather Icon" />
      <div>${city.temp}</div>
    `;
    favoritesContainer.appendChild(cityCard);
  });
}

function formatDate(date) {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[date.getDay()];
  return `${day} ${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
}

function getForecast(city) {
  const apiKey = "9520o814t03ab019b07fae5815434801";
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&unit=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  const forecastElement = document.querySelector("#forecast");
  let forecastHtml = "";

  response.data.daily.forEach((day, index) => {
    if (index < 5) {
      forecastHtml += `
        <div class="weather-forecast-day">
          <div class="weather-forecast-date">${formatDay(day.time)}</div>
          <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
          <div>${Math.round(day.temperature.maximum)}°C</div>
        </div>
      `;
    }
  });

  forecastElement.innerHTML = forecastHtml;
}

function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function searchCity(city) {
  const apiKey = "9520o814t03ab019b07fae5815434801";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

const searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
});

searchCity("Oslo");
