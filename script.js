// CLASS-TAUGHT: fetch API, JSON parsing, DOM manipulation

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const timeOfDay = document.getElementById('timeOfDay');

// Event listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeather(city);
    }
  }
});

// Fetch weather data from Open-Meteo API
function fetchWeather(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

  fetch(geoUrl)
    .then(res => res.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const location = data.results[0];
        getWeatherData(location.latitude, location.longitude, city);
      } else {
        cityName.textContent = 'City not found';
        temperature.textContent = '--°C';
        condition.textContent = '--';
        weatherIcon.textContent = '❓';
      }
    })
    .catch(err => {
      console.error('Error:', err);
      cityName.textContent = 'Error';
    });
}

// Get weather data
function getWeatherData(lat, lon, city) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weather_code&timezone=auto`;

  fetch(weatherUrl)
    .then(res => res.json())
    .then(data => {
      const current = data.current;
      const temp = current.temperature_2m;
      const isDay = current.is_day;
      const code = current.weather_code;

      // Update DOM with live data
      cityName.textContent = city;
      temperature.textContent = `${Math.round(temp)}°C`;
      timeOfDay.textContent = isDay ? 'Daytime' : 'Nighttime';

      // Set condition and icon based on weather code
      const weatherData = getWeatherInfo(code, isDay);
      condition.textContent = weatherData.name;
      weatherIcon.textContent = weatherData.icon;
    })
    .catch(err => console.error('Error:', err));
}

// Get weather condition and icon
function getWeatherInfo(code, isDay) {
  if (code === 0 || code === 1) {
    return { name: isDay ? 'Sunny' : 'Clear Night', icon: isDay ? '☀️' : '🌙' };
  }
  if (code === 2 || code === 3) {
    return { name: 'Cloudy', icon: '☁️' };
  }
  if (code >= 51 && code <= 67) {
    return { name: 'Rainy', icon: '🌧️' };
  }
  if (code >= 71 && code <= 77) {
    return { name: 'Snowy', icon: '❄️' };
  }
  if (code >= 90 && code <= 99) {
    return { name: 'Thunderstorm', icon: '⛈️' };
  }
  return { name: 'Unknown', icon: '❓' };
}

// Load default city on page load
window.addEventListener('load', () => {
  fetchWeather('Toronto');
});
