// ==========================================================================
// INTERACTIVE WEATHER APP LOGIC
// ==========================================================================

// Βάλε εδώ το δικό σου API Key από το OpenWeatherMap μέσα στα εισαγωγικά
const apiKey = "ΕΔΩ_ΒΑΖΕΙΣ_ΤΟ_KEY_ΣΟΥ"; 
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=el&q=";

// DOM Elements
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

// Ασύγχρονη συνάρτηση με βελτιωμένο έλεγχο σφαλμάτων
async function checkWeather(city) {
  if (!city.trim()) return;

  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    // 1. Αν το API key δεν έχει ενεργοποιηθεί ακόμα ή είναι λάθος (Status 401)
    if (response.status === 401) {
      showError("Το API Key δεν έχει ενεργοποιηθεί ακόμα (περιμένετε λίγα λεπτά) ή είναι λάθος.");
      return;
    }

    // 2. Αν η πόλη δεν βρέθηκε (Status 404)
    if (response.status === 404) {
      showError("Η πόλη δεν βρέθηκε. Παρακαλώ δοκιμάστε ξανά.");
      return;
    }

    if (!response.ok) {
      showError(`Σφάλμα API: Status ${response.status}`);
      return;
    }

    const data = await response.json();

    // Ενημέρωση Κειμένων
    cityName.textContent = data.name + ", " + data.sys.country;
    temperature.textContent = Math.round(data.main.temp);
    description.textContent = data.weather[0].description;
    feelsLikeTemp.textContent = Math.round(data.main.feels_like);
    humidity.textContent = data.main.humidity + "%";
    wind.textContent = Math.round(data.wind.speed * 3.6) + " km/h";
    pressure.textContent = data.main.pressure + " hPa";

    // Εικονίδιο & Theme
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    updateTheme(data.weather[0].main);

    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");

  } catch (error) {
    console.error("Σφάλμα:", error);
    showError("Προέκυψε σφάλμα δικτύου. Ελέγξτε τη σύνδεσή σας.");
  }
}

// Συνάρτηση αλλαγής Theme της Κάρτας
function updateTheme(weatherState) {
  weatherCard.classList.remove("theme-clear", "theme-clouds", "theme-rain", "theme-snow");

  if (weatherState === "Clear") {
    weatherCard.classList.add("theme-clear");
  } else if (weatherState === "Clouds") {
    weatherCard.classList.add("theme-clouds");
  } else if (weatherState === "Rain" || weatherState === "Drizzle" || weatherState === "Thunderstorm") {
    weatherCard.classList.add("theme-rain");
  } else if (weatherState === "Snow") {
    weatherCard.classList.add("theme-snow");
  }
}

// Βοηθητική Συνάρτηση για Σφάλματα
function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove("hidden");
  weatherInfo.classList.add("hidden");
  weatherCard.classList.remove("theme-clear", "theme-clouds", "theme-rain", "theme-snow");
}

// Event Listeners
searchBtn.addEventListener("click", () => checkWeather(cityInput.value));

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkWeather(cityInput.value);
  }
});