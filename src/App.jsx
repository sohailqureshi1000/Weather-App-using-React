import { useState } from "react";
import "./App.css";

// Maps Open-Meteo's numeric weather codes to human-readable text + emoji.
// Reference: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
function describeWeatherCode(code) {
  const map = {
    0: { text: "Clear sky", icon: "☀️" },
    1: { text: "Mostly clear", icon: "🌤️" },
    2: { text: "Partly cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Fog", icon: "🌫️" },
    48: { text: "Depositing rime fog", icon: "🌫️" },
    51: { text: "Light drizzle", icon: "🌦️" },
    53: { text: "Moderate drizzle", icon: "🌦️" },
    55: { text: "Dense drizzle", icon: "🌦️" },
    61: { text: "Slight rain", icon: "🌧️" },
    63: { text: "Moderate rain", icon: "🌧️" },
    65: { text: "Heavy rain", icon: "🌧️" },
    71: { text: "Slight snow", icon: "🌨️" },
    73: { text: "Moderate snow", icon: "🌨️" },
    75: { text: "Heavy snow", icon: "🌨️" },
    80: { text: "Rain showers", icon: "🌦️" },
    81: { text: "Rain showers", icon: "🌦️" },
    82: { text: "Violent rain showers", icon: "⛈️" },
    95: { text: "Thunderstorm", icon: "⛈️" },
    96: { text: "Thunderstorm with hail", icon: "⛈️" },
    99: { text: "Thunderstorm with heavy hail", icon: "⛈️" },
  };
  return map[code] || { text: "Unknown", icon: "🌡️" };
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // Step 1: turn the city name into coordinates.
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          trimmedCity
        )}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError(`Couldn't find "${trimmedCity}". Check the spelling and try again.`);
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: fetch current weather for those coordinates.
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
      );
      const weatherData = await weatherRes.json();

      if (!weatherData.current) {
        setError("Weather data isn't available for this location right now.");
        setLoading(false);
        return;
      }

      setWeather({
        city: name,
        country,
        temperature: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: weatherData.current.wind_speed_10m,
        ...describeWeatherCode(weatherData.current.weather_code),
      });
    } catch (err) {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="weather-app">
      <h1>Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && <p className="status-message">Fetching weather…</p>}

      {error && !loading && <p className="status-message error">{error}</p>}

      {weather && !loading && !error && (
        <div className="weather-card">
          <p className="weather-location">
            {weather.city}
            {weather.country ? `, ${weather.country}` : ""}
          </p>
          <div className="weather-main">
            <span className="weather-icon">{weather.icon}</span>
            <span className="weather-temp">{Math.round(weather.temperature)}°C</span>
          </div>
          <p className="weather-condition">{weather.text}</p>
          <div className="weather-details">
            <span>💧 Humidity: {weather.humidity}%</span>
            <span>💨 Wind: {weather.windSpeed} km/h</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;