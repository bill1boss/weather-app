// OpenWeatherMap API credentials and essential DOM element references
const apiKey = '693cad648dfa488bcfb6cd48bcc426c8'; // Replace with your actual OpenWeatherMap API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

// DOM references for displaying current weather details
const weatherInfo = document.getElementById('weather-info');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weather-desc');
const humidity = document.getElementById('humidity');

// DOM references for displaying the 3-day forecast cards
const forecastSection = document.getElementById('forecast-section');
const forecastContainer = document.getElementById('forecast-container');

// Event listener for button click to initiate weather query
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city !== '') {
    getWeather(city); // Fetch current weather if input is not empty
  }
});

// Event listener for pressing the Enter key inside the input field
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city !== '') {
      getWeather(city);
    }
  }
});

// Asynchronous function to fetch current weather data from OpenWeatherMap API
async function getWeather(city) {
  try {
    // API request for current weather data using metric units and English language
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&appid=${apiKey}`
    );

    // Throw an error if the city was not found or API request failed
    if (!response.ok) {
      throw new Error('City not found. Please check the spelling.');
    }

    // Parse the JSON data returned from the API
    const data = await response.json();

    // Populate current weather details into the HTML elements
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDesc.textContent = data.weather[0].description;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;

    // Make the current weather section visible
    weatherInfo.classList.remove('hidden');

    // Fetch the corresponding 3-day forecast data
    getForecast(city);

  } catch (error) {
    // Display alert message if an error occurs during fetch
    alert(error.message);
  }
}

// Asynchronous function to fetch 5-day / 3-hour forecast data and filter it for 3 days
async function getForecast(city) {
  try {
    // API request for forecast data
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=en&appid=${apiKey}`
    );

    const data = await response.json();
    forecastContainer.innerHTML = ''; // Clear previous forecast cards

    // Filter results to select midday forecasts (12:00 PM) for the next 3 days
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);

    // Loop through filtered data and dynamically construct DOM elements for each day
    dailyForecasts.forEach(item => {
      // Format timestamp into readable date (e.g. Mon, Oct 5)
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const temp = Math.round(item.main.temp);
      const icon = item.weather[0].icon;

      // Create HTML element for each forecast card
      const card = document.createElement('div');
      card.className = 'forecast-card';
      card.innerHTML = `
        <p><strong>${date}</strong></p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather icon">
        <p>${temp}°C</p>
      `;
      forecastContainer.appendChild(card);
    });

    // Make forecast container visible
    forecastSection.classList.remove('hidden');

  } catch (error) {
    console.error('Forecast error:', error);
  }
}