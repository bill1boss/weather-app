const apiKey = "693cad648dfa488bcfb6cd48bcc426c8"; 
const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=el&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=el&q=";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

const weatherInfo = document.getElementById("weather-info");
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLikeTemp = document.getElementById("feels-like-temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const forecastContainer = document.getElementById("forecast-container");

const errorMessage = document.getElementById("error-message");

async function checkWeather(city) {
  if (!city.trim()) return;

  try {
    // 1. Fetch Current Weather
    const response = await fetch(currentWeatherUrl + city + `&appid=${apiKey}`);

    if (response.status === 401) {
      showError("⚠️ Το API Key δεν είναι έγκυρο ή ενεργό.");
      return;
    }

    if (response.status === 404) {
      showError("❌ Η πόλη δεν βρέθηκε. Δοκιμάστε ξανά!");
      return;
    }

    if (!response.ok) {
      showError(`⚠️️ Σφάλμα: ${response.status}`);
      return;
    }

    const data = await response.json();

    // Εμφάνιση σημερινών δεδομένων
    cityName.textContent = `📍 ${data.name}, ${data.sys.country}`;
    temperature.textContent = Math.round(data.main.temp);
    description.textContent = data.weather[0].description;
    feelsLikeTemp.textContent = Math.round(data.main.feels_like);
    humidity.textContent = data.main.humidity + "%";
    wind.textContent = Math.round(data.wind.speed * 3.6) + " km/h";
    pressure.textContent = data.main.pressure + " hPa";

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // 2. Fetch 3-Day Forecast
    await getForecast(city);

    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");

  } catch (error) {
    console.error("Σφάλμα:", error);
    showError("📡 Πρόβλημα σύνδεσης στο δίκτυο.");
  }
}

async function getForecast(city) {
  const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
  const data = await response.json();

  forecastContainer.innerHTML = ""; // Καθαρισμός προηγούμενων καρτών

  // Το API επιστρέφει δεδομένα ανά 3 ώρες (8 εγγραφές την ημέρα). 
  // Παίρνουμε δείγματα για τις επόμενες μέρες (π.χ. δείκτες 0 [Σήμερα/Τώρα], 8 [Αύριο], 16 [Μεθαύριο])
  const dayIndices = [0, 8, 16];
  const dayLabels = ["Σήμερα", "Αύριο", "Μεθαύριο"];

  dayIndices.forEach((index, i) => {
    const item = data.list[index];
    if (item) {
      const temp = Math.round(item.main.temp);
      const icon = item.weather[0].icon;

      const cardHtml = `
        <div class="forecast-card">
          <div class="forecast-day">${dayLabels[i]}</div>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="forecast icon">
          <div class="forecast-temp">${temp}°C</div>
        </div>
      `;
      forecastContainer.innerHTML += cardHtml;
    }
  });
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove("hidden");
  weatherInfo.classList.add("hidden");
}

searchBtn.addEventListener("click", () => checkWeather(cityInput.value));

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkWeather(cityInput.value);
  }
});