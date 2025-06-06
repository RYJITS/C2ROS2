// Application Météo simple pour C2R OS
let weatherData = {
    cities: {
        'paris': { name: 'Paris, France', temp: 22, desc: 'Ensoleillé', icon: '☀️' },
        'london': { name: 'Londres, UK', temp: 18, desc: 'Nuageux', icon: '☁️' },
        'new york': { name: 'New York, USA', temp: 25, desc: 'Partiellement nuageux', icon: '⛅' },
        'tokyo': { name: 'Tokyo, Japon', temp: 28, desc: 'Chaud', icon: '🌤️' },
        'berlin': { name: 'Berlin, Allemagne', temp: 20, desc: 'Pluvieux', icon: '🌧️' },
        'madrid': { name: 'Madrid, Espagne', temp: 30, desc: 'Très ensoleillé', icon: '☀️' },
        'rome': { name: 'Rome, Italie', temp: 26, desc: 'Beau temps', icon: '🌤️' }
    }
};

// Initialisation de l'application météo
function initWeather() {
    console.log('🌤️ Initialisation de l\'application météo');
    
    // Ajouter l'événement Enter sur l'input
    const cityInput = document.getElementById('city-input');
    if (cityInput) {
        cityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                getWeather();
            }
        });
    }
    
    // Charger la météo par défaut
    updateWeatherDisplay('paris');
}

// Obtenir la météo pour une ville
function getWeather() {
    const cityInput = document.getElementById('city-input');
    if (!cityInput) return;
    
    const city = cityInput.value.toLowerCase().trim();
    
    if (!city) {
        showWeatherError('Veuillez entrer le nom d\'une ville');
        return;
    }
    
    // Simuler un délai de chargement
    showWeatherLoading();
    
    setTimeout(() => {
        if (weatherData.cities[city]) {
            updateWeatherDisplay(city);
        } else {
            // Générer des données aléatoires pour les villes non répertoriées
            generateRandomWeather(city);
        }
    }, 500);
}

// Afficher l'état de chargement
function showWeatherLoading() {
    const currentWeather = document.getElementById('current-weather');
    if (currentWeather) {
        currentWeather.innerHTML = `
            <div class="weather-icon">⏳</div>
            <div class="weather-info">
                <div class="temperature">--°C</div>
                <div class="description">Chargement...</div>
                <div class="location">Recherche en cours</div>
            </div>
        `;
    }
}

// Afficher une erreur météo
function showWeatherError(message) {
    const currentWeather = document.getElementById('current-weather');
    if (currentWeather) {
        currentWeather.innerHTML = `
            <div class="weather-icon">❌</div>
            <div class="weather-info">
                <div class="temperature">--°C</div>
                <div class="description">Erreur</div>
                <div class="location">${message}</div>
            </div>
        `;
    }
}

// Générer des données météo aléatoires
function generateRandomWeather(cityName) {
    const icons = ['☀️', '⛅', '☁️', '🌧️', '🌤️', '⛈️'];
    const descriptions = ['Ensoleillé', 'Nuageux', 'Pluvieux', 'Orageux', 'Partiellement nuageux', 'Brumeux'];
    
    const randomTemp = Math.floor(Math.random() * 30) + 5; // 5-35°C
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    const cityData = {
        name: cityName.charAt(0).toUpperCase() + cityName.slice(1),
        temp: randomTemp,
        desc: randomDesc,
        icon: randomIcon
    };
    
    // Sauvegarder pour les prochaines recherches
    weatherData.cities[cityName.toLowerCase()] = cityData;
    
    updateWeatherDisplay(cityName.toLowerCase());
}

// Mettre à jour l'affichage météo
function updateWeatherDisplay(cityKey) {
    const city = weatherData.cities[cityKey];
    if (!city) return;
    
    // Mettre à jour la météo actuelle
    const currentWeather = document.getElementById('current-weather');
    if (currentWeather) {
        currentWeather.innerHTML = `
            <div class="weather-icon">${city.icon}</div>
            <div class="weather-info">
                <div class="temperature">${city.temp}°C</div>
                <div class="description">${city.desc}</div>
                <div class="location">${city.name}</div>
            </div>
        `;
    }
    
    // Mettre à jour les détails (valeurs simulées)
    updateWeatherDetails(city.temp);
    
    // Mettre à jour les prévisions
    updateForecast(city.temp);
}

// Mettre à jour les détails météo
function updateWeatherDetails(baseTemp) {
    const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
    const wind = Math.floor(Math.random() * 20) + 5; // 5-25 km/h
    const visibility = Math.floor(Math.random() * 10) + 5; // 5-15 km
    const feelsLike = baseTemp + Math.floor(Math.random() * 6) - 3; // ±3°C
    
    const humidityEl = document.getElementById('humidity');
    const windEl = document.getElementById('wind');
    const visibilityEl = document.getElementById('visibility');
    const feelsLikeEl = document.getElementById('feels-like');
    
    if (humidityEl) humidityEl.textContent = `${humidity}%`;
    if (windEl) windEl.textContent = `${wind} km/h`;
    if (visibilityEl) visibilityEl.textContent = `${visibility} km`;
    if (feelsLikeEl) feelsLikeEl.textContent = `${feelsLike}°C`;
}

// Mettre à jour les prévisions
function updateForecast(baseTemp) {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
    const icons = ['⛅', '🌧️', '⛈️', '☀️', '🌤️'];
    
    const forecastList = document.getElementById('forecast-list');
    if (!forecastList) return;
    
    let forecastHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const variation = Math.floor(Math.random() * 10) - 5; // ±5°C
        const high = baseTemp + variation + Math.floor(Math.random() * 5);
        const low = high - Math.floor(Math.random() * 8) - 3;
        
        forecastHTML += `
            <div class="forecast-item">
                <div class="forecast-day">${days[i]}</div>
                <div class="forecast-icon">${icons[i]}</div>
                <div class="forecast-temps">
                    <span class="high">${high}°</span>
                    <span class="low">${low}°</span>
                </div>
            </div>
        `;
    }
    
    forecastList.innerHTML = forecastHTML;
}

// Actualiser la météo
function refreshWeather() {
    const cityInput = document.getElementById('city-input');
    if (cityInput && cityInput.value) {
        getWeather();
    } else {
        updateWeatherDisplay('paris');
    }
}

// Fonction de nettoyage pour C2R OS
function weatherCleanup() {
    console.log('🧹 Nettoyage de l\'application météo');
    weatherData = {
        cities: {
            'paris': { name: 'Paris, France', temp: 22, desc: 'Ensoleillé', icon: '☀️' },
            'london': { name: 'Londres, UK', temp: 18, desc: 'Nuageux', icon: '☁️' },
            'new york': { name: 'New York, USA', temp: 25, desc: 'Partiellement nuageux', icon: '⛅' },
            'tokyo': { name: 'Tokyo, Japon', temp: 28, desc: 'Chaud', icon: '🌤️' },
            'berlin': { name: 'Berlin, Allemagne', temp: 20, desc: 'Pluvieux', icon: '🌧️' },
            'madrid': { name: 'Madrid, Espagne', temp: 30, desc: 'Très ensoleillé', icon: '☀️' },
            'rome': { name: 'Rome, Italie', temp: 26, desc: 'Beau temps', icon: '🌤️' }
        }
    };
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeather);
} else {
    initWeather();
}
