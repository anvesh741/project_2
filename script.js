const locationEl = document.getElementById('location');
const iconEl = document.getElementById('icon');
const tempEl = document.getElementById('temp');
const conditionEl = document.getElementById('condition');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const aqiEl = document.getElementById('aqi');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');

const apiKey = '16241807aeef44ddb6251031252504';

function clearDisplay() {
    locationEl.textContent = '';
    iconEl.src = '';
    iconEl.alt = '';
    tempEl.textContent = '';
    conditionEl.textContent = '';
    humidityEl.textContent = '';
    windEl.textContent = '';
    aqiEl.textContent = '';
    errorEl.style.display = 'none';
    errorEl.textContent = '';
}

async function fetchWeather(city) {
    if (!city) {
        errorEl.style.display = 'block';
        errorEl.textContent = 'Please enter a city name.';
        return;
    }

    clearDisplay();
    loadingEl.style.display = 'block';

    try {
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=yes`);
        if (!response.ok) {
            throw new Error('City not found or API error');
        }
        const data = await response.json();

        locationEl.textContent = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        iconEl.src = data.current.condition.icon;
        iconEl.alt = data.current.condition.text;
        tempEl.textContent = `${data.current.temp_c.toFixed(1)}°C`;
        conditionEl.textContent = data.current.condition.text;
        humidityEl.textContent = `${data.current.humidity}%`;
        windEl.textContent = `${data.current.wind_kph} kph`;

        if (data.current.air_quality && data.current.air_quality['us-epa-index'] !== undefined) {
            const aqiIndex = data.current.air_quality['us-epa-index'];
            aqiEl.textContent = `${aqiIndex} (${getAqiText(aqiIndex)})`;
        } else {
            aqiEl.textContent = 'N/A';
        }
    } catch (error) {
        errorEl.style.display = 'block';
        errorEl.textContent = error.message;
        clearDisplay();
    } finally {
        loadingEl.style.display = 'none';
    }
}

function getAqiText(index) {
    switch (index) {
        case 1: return 'Good';
        case 2: return 'Moderate';
        case 3: return 'Unhealthy for Sensitive Groups';
        case 4: return 'Unhealthy';
        case 5: return 'Very Unhealthy';
        case 6: return 'Hazardous';
        default: return 'Unknown';
    }
}

searchBtn.addEventListener('click', () => {
    fetchWeather(cityInput.value.trim());
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value.trim());
    }
});
