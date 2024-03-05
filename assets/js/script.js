const apiKey = 'daa02f6c9c98da5a4b18502ae93a3b77';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    getWeather(city);
    cityInput.value = '';
});

function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`; // Changed units to imperial for Fahrenheit and mph
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            displayForecast(data);
            addToSearchHistory(city);
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

function displayCurrentWeather(data) {
    const current = data.list[0];
    const cityName = data.city.name;
    const date = new Date(current.dt * 1000).toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}.png`;
    const temperature = current.main.temp;
    const humidity = current.main.humidity;
    const windSpeed = current.wind.speed;

    currentWeather.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h2 class="card-title">${cityName} (${date})</h2>
                <img src="${iconUrl}" alt="${current.weather[0].description}" class="weather-icon">
                <p class="card-text">Temperature: ${temperature}°F</p>
                <p class="card-text">Humidity: ${humidity}%</p>
                <p class="card-text">Wind Speed: ${windSpeed} mph</p>
            </div>
        </div>
    `;
}

function displayForecast(data) {
    forecast.innerHTML = ''; // Clear previous forecast data
    // forecast.innerHTML = `<h3 class="mb-4">5-Day Forecast:</h3>`;
    for (let i = 0; i < data.list.length; i += 8) { // Display forecast for every 24 hours (every 8th item in the list)
        const forecastData = data.list[i];
        const date = new Date(forecastData.dt * 1000).toLocaleDateString();
        const iconUrl = `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`;
        const temperature = forecastData.main.temp;
        const humidity = forecastData.main.humidity;
        const windSpeed = forecastData.wind.speed;

        forecast.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <h3 class="card-title">${date}</h3>
                    <img src="${iconUrl}" alt="${forecastData.weather[0].description}" class="weather-icon">
                    <p class="card-text">Temperature: ${temperature}°F</p>
                    <p class="card-text">Humidity: ${humidity}%</p>
                    <p class="card-text">Wind Speed: ${windSpeed} mph</p>
                </div>
            </div>
        `;
    }
}

function addToSearchHistory(city) {
    const historyItem = document.createElement('div');
    historyItem.textContent = city;
    historyItem.classList.add('search-history-item'); // Add a class for styling
    searchHistory.appendChild(historyItem);
 
    // Add event listener to history item
    historyItem.addEventListener('click', () => {
        getWeather(city); // Trigger getWeather function with the clicked city
    });
 }
 