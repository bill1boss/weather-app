const apiKey = "693cad648dfa488bcfb6cd48bcc426c8"; 
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=el&q=";

const weatherCard = document.getElementById("weather-card");
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

const errorMessage = document.getElementById("error-message");

async function checkWeather(city) {
  if (!city.trim()) return;

  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status === 401) {
      showError("⚠️ Το API Key δεν είναι έγκυρο ή ενεργό.");
      return;
    }

    if (response.status === 404) {
      showError("❌ Η πόλη δεν βρέθηκε. Δοκιμάστε ξανά!");
      return;
    }

    if (!response.ok) {
      showError(`⚠️ Σφάλμα: ${response.status}`);
      return;
    }

    const data = await response.json();

    cityName.textContent = `📍 ${data.name}, ${data.sys.country}`;
    temperature.textContent = Math.round(data.main.temp);
    description.textContent = data.weather[0].description;
    feelsLikeTemp.textContent = Math.round(data.main.feels_like);
    humidity.textContent = data.main.humidity + "%";
    wind.textContent = Math.round(data.wind.speed * 3.6) + " km/h";
    pressure.textContent = data.main.pressure + " hPa";

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");

  } catch (error) {
    console.error("Σφάλμα:", error);
    showError("📡 Πρόβλημα σύνδεσης στο δίκτυο.");
  }
}

searchBtn.addEventListener("click", () => checkWeather(cityInput.value));

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkWeather(cityInput.value);
  }
});