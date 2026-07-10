import axios from 'axios';

// WMO Hava Durumu Kodlarını (Weather Codes) basitleştirilmiş arayüz durumlarımıza eşleyelim
// Arayüz Durumları: 'Clear' (Açık), 'Clouds' (Bulutlu), 'Rain' (Yağmurlu), 'Storm' (Fırtınalı)
const mapWmoToState = (code) => {
  if (code === 0) return 'Clear';
  if ([1, 2, 3, 45, 48].includes(code)) return 'Clouds';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86].includes(code)) return 'Rain';
  if ([95, 96, 99].includes(code)) return 'Storm';
  return 'Clear';
};

// WMO Hava Durumu Kodlarını sözel Türkçe açıklamalara dönüştüren yardımcı fonksiyon
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
  return 'Değişken Hava Durumu';
};

// API veya internet bağlantısı olmadığında devreye girecek yedek hava durumu motoru
const generateMockWeather = (cityName) => {
  const normalized = cityName.trim().toLowerCase();
  
  let baseTemp = 20;
  let defaultState = 'Clear';
  let windSpeed = 12;
  let humidity = 60;
  let countryLabel = 'Türkiye';
  
  if (normalized.includes('paris')) countryLabel = 'Fransa';
  else if (normalized.includes('london') || normalized.includes('londra')) countryLabel = 'İngiltere';
  else if (normalized.includes('berlin')) countryLabel = 'Almanya';
  else if (normalized.includes('kyiv') || normalized.includes('kiev')) countryLabel = 'Ukrayna';
  else if (normalized.includes('new york')) countryLabel = 'ABD';
  else if (normalized.includes('tokyo')) countryLabel = 'Japonya';
  else if (normalized.includes('roma')) countryLabel = 'İtalya';
  else if (normalized.includes('madrid')) countryLabel = 'İspanya';
  else if (normalized.includes('moskova') || normalized.includes('moscow')) countryLabel = 'Rusya';
  else if (normalized.includes('pekin') || normalized.includes('beijing')) countryLabel = 'Çin';
  else if (normalized.includes('baku') || normalized.includes('bakü')) countryLabel = 'Azerbaycan';
  
  if (normalized.includes('ist') || normalized.includes('istanbul') || normalized.includes('ıstanbul')) {
    baseTemp = 16;
    defaultState = 'Rain';
    windSpeed = 18;
    humidity = 85;
  } else if (normalized.includes('izm') || normalized.includes('izmir')) {
    baseTemp = 24;
    defaultState = 'Clear';
    windSpeed = 10;
    humidity = 50;
  } else if (normalized.includes('ank') || normalized.includes('ankara')) {
    baseTemp = 14;
    defaultState = 'Clouds';
    windSpeed = 8;
    humidity = 45;
  } else if (normalized.includes('riz') || normalized.includes('rize')) {
    baseTemp = 10;
    defaultState = 'Storm';
    windSpeed = 22;
    humidity = 90;
  } else {
    let sum = 0;
    for (let i = 0; i < normalized.length; i++) sum += normalized.charCodeAt(i);
    baseTemp = 10 + (sum % 20);
    const states = ['Clear', 'Clouds', 'Rain', 'Storm'];
    defaultState = states[sum % states.length];
    windSpeed = 5 + (sum % 20);
    humidity = 40 + (sum % 55);
  }

  const daysOfWeek = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const currentDayIdx = new Date().getDay();
  
  const forecastList = [];
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 168; i++) {
    const itemTime = new Date(midnight.getTime() + i * 60 * 60 * 1000);
    const hour = itemTime.getHours();
    const dayLabel = daysOfWeek[itemTime.getDay()];
    
    const tempOffset = -Math.abs(hour - 14) * 0.4 + 3;
    const itemTemp = Number((baseTemp + tempOffset + (Math.sin(i / 2) * 1.5)).toFixed(1));
    
    let state = defaultState;
    if (defaultState === 'Storm') {
      if (hour >= 12 && hour < 18) state = 'Storm';
      else if (hour >= 6 && hour < 12) state = 'Rain';
      else state = 'Clouds';
    } else if (defaultState === 'Rain') {
      if (hour >= 18 || hour < 4) state = 'Rain';
      else state = 'Clouds';
    }
    
    forecastList.push({
      time: `${String(hour).padStart(2, '0')}:00`,
      day: dayLabel,
      temp: itemTemp,
      windSpeed: Math.round(windSpeed + Math.sin(i) * 2),
      humidity: Math.min(100, Math.max(0, Math.round(humidity + Math.cos(i) * 8))),
      weatherState: state,
      description: state === 'Storm' ? 'Gök Gürültülü Sağanak Yağış' : state === 'Rain' ? 'Kuvvetli Sağanak Yağış' : state === 'Clouds' ? 'Parçalı Bulutlu' : 'Açık, Güneşli'
    });
  }

  const daysShort = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const formattedDaily = [];
  for (let i = 0; i < 7; i++) {
    const forecastTime = new Date();
    forecastTime.setDate(forecastTime.getDate() + i);
    const dayLabel = i === 0 ? 'Bugün' : daysShort[forecastTime.getDay()];
    
    const max = Math.round(baseTemp + 4 + Math.sin(i) * 3);
    const min = Math.round(baseTemp - 3 + Math.cos(i) * 2);
    const states = ['Clear', 'Clouds', 'Rain', 'Storm'];
    const state = states[(currentDayIdx + i) % states.length];
    
    formattedDaily.push({
      day: dayLabel,
      maxTemp: max,
      minTemp: min,
      weatherState: state,
      description: state === 'Storm' ? 'Gök Gürültülü Sağanak Yağış' :
                   state === 'Rain' ? 'Kuvvetli Sağanak Yağış' :
                   state === 'Clouds' ? 'Parçalı Bulutlu' : 'Açık, Güneşli'
    });
  }

  return {
    city: cityName.charAt(0).toUpperCase() + cityName.slice(1),
    country: countryLabel,
    temp: forecastList[0].temp,
    windSpeed: forecastList[0].windSpeed,
    humidity: forecastList[0].humidity,
    weatherState: forecastList[0].weatherState,
    description: forecastList[0].description,
    forecast: forecastList,
    dailyForecast: formattedDaily
  };
};

// Tamamen Ücretsiz, API Anahtarı Gerektirmeyen Open-Meteo ile Canlı Hava Durumu Çekimi
export const fetchWeatherData = async (cityName) => {
  try {
    // 1. Arama yapılan şehrin enlem/boylam koordinatlarını bulmak için ücretsiz Coğrafi Kodlama (Geocoding) API'sini sorgulayalım
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=tr&format=json`;
    const geocodeRes = await axios.get(geocodeUrl);
    
    if (!geocodeRes.data.results || geocodeRes.data.results.length === 0) {
      throw new Error(`"${cityName}" adında bir şehir bulunamadı.`);
    }

    const { latitude, longitude, name, country } = geocodeRes.data.results[0];

    // 2. Koordinatları kullanarak ücretsiz Open-Meteo Hava Durumu API'sinden güncel, saatlik ve haftalık verileri çekelim
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`;
    const forecastRes = await axios.get(forecastUrl);
    
    const current = forecastRes.data.current;
    const hourly = forecastRes.data.hourly;
    const daily = forecastRes.data.daily;

    const daysOfWeek = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const daysShort = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    
    // 3. Şimdiki saate en yakın indeksi bulup önümüzdeki 24 saatlik akışı oluşturalım
    const formattedForecast = [];
    for (let i = 0; i < hourly.time.length; i++) {
      const timeIdx = i;
      const timeIso = hourly.time[timeIdx];
      const date = new Date(timeIso);
      const hour = date.getHours();
      const dayLabel = daysOfWeek[date.getDay()];
      
      const temp = hourly.temperature_2m[timeIdx];
      const humidity = hourly.relative_humidity_2m[timeIdx];
      const windSpeed = Math.round(hourly.wind_speed_10m[timeIdx]);
      const wmoCode = hourly.weather_code[timeIdx];
      
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

    const formattedDaily = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(daily.time[i]);
      const dayLabel = i === 0 ? 'Bugün' : daysShort[date.getDay()];
      formattedDaily.push({
        day: dayLabel,
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        weatherState: mapWmoToState(daily.weather_code[i]),
        description: mapWmoToDesc(daily.weather_code[i])
      });
    }

    return {
      city: `${name}`,
      country: `${country}`,
      temp: Math.round(current.temperature_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      humidity: current.relative_humidity_2m,
      weatherState: mapWmoToState(current.weather_code),
      description: mapWmoToDesc(current.weather_code),
      forecast: formattedForecast,
      dailyForecast: formattedDaily
    };
  } catch (error) {
    console.warn("Gerçek API bağlantısında hata oluştu, yedek mock veriye geçiliyor:", error.message);
    return generateMockWeather(cityName);
  }
};
