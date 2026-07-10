const axios = require('axios');

const mapWmoToState = (code) => {
  if (code === 0) return 'Clear';
  if ([1, 2, 3, 45, 48].includes(code)) return 'Clouds';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86].includes(code)) return 'Rain';
  if ([95, 96, 99].includes(code)) return 'Storm';
  return 'Clear';
};

const mapWmoToDesc = (code) => {
  if (code === 0) return 'Açık, Güneşli';
  if (code === 1) return 'Çoğunlukla Açık';
  if (code === 2) return 'Parçalı Bulutlu';
  if (code === 3) return 'Kapalı, Bulutlu';
  if ([45, 48].includes(code)) return 'Sisli Gökyüzü';
  if ([51, 53, 55].includes(code)) return 'Hafif Çiseleyen Yağış';
  if ([56, 57, 61, 63, 65].includes(code)) return 'Kuvvetli Sağanak Yağışlı';
  if ([66, 67, 71, 73, 75, 77].includes(code)) return 'Kar Yağışlı ve Soğuk';
  if ([80, 81, 82, 85, 86].includes(code)) return 'Yoğun Yağmur Sağanağı';
  if ([95, 96, 99].includes(code)) return 'Gök Gürültülü Sağanak Fırtına';
  return 'Bilinmeyen Durum';
};

const fetchWeatherData = async (cityName) => {
  try {
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=tr&format=json`;
    console.log("Geocoding URL:", geocodeUrl);
    const geocodeRes = await axios.get(geocodeUrl);
    
    if (!geocodeRes.data.results || geocodeRes.data.results.length === 0) {
      throw new Error(`"${cityName}" adında bir şehir bulunamadı.`);
    }

    const { latitude, longitude, name, country } = geocodeRes.data.results[0];
    console.log("Geocoding result:", { latitude, longitude, name, country });

    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto&forecast_days=2`;
    console.log("Forecast URL:", forecastUrl);
    const forecastRes = await axios.get(forecastUrl);
    
    const current = forecastRes.data.current;
    const hourly = forecastRes.data.hourly;

    const daysOfWeek = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    
    const formattedForecast = [];
    for (let i = 0; i < 24; i++) {
      const timeIso = hourly.time[i];
      const date = new Date(timeIso);
      const hour = date.getHours();
      const dayLabel = daysOfWeek[date.getDay()];
      
      const temp = Math.round(hourly.temperature_2m[i]);
      const humidity = hourly.relative_humidity_2m[i];
      const windSpeed = Math.round(hourly.wind_speed_10m[i]);
      const wmoCode = hourly.weather_code[i];
      
      formattedForecast.push({
        time: `${String(hour).padStart(2, '0')}:00`,
        day: dayLabel,
        temp,
        windSpeed,
        humidity,
        weatherState: mapWmoToState(wmoCode),
        description: mapWmoToDesc(wmoCode)
      });
    }

    return {
      city: `${name}`,
      temp: Math.round(current.temperature_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      humidity: current.relative_humidity_2m,
      weatherState: mapWmoToState(current.weather_code),
      description: mapWmoToDesc(current.weather_code),
      forecast: formattedForecast
    };
  } catch (error) {
    console.error("Error occurred:", error.message);
    throw error;
  }
};

fetchWeatherData("Ankara")
  .then(res => console.log("Success! Data city:", res.city, "forecast count:", res.forecast.length))
  .catch(err => console.error("Test failed:", err));
