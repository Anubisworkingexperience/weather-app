import { conditionsArray } from "./conditions.js";

const userLocation = document.querySelector('.user-location');
const locationDate = document.querySelector('.location-date');
const locationTime = document.querySelector('.location-time');
const degreesInfo = document.querySelector('.degrees');
const weatherText = document.querySelector('.weather-desc');
const switchDegreesButton = document.querySelector('.switch-degrees');
const feelsLikeDegrees = document.querySelector('.feels-degrees');
const lastUpdated = document.querySelector('.last-updated');
const humidity = document.querySelector('.humidity');
const precipitation = document.querySelector('.precipitation');
const pressure = document.querySelector('.pressure');
const visibility = document.querySelector('.visibility');
const windDirection = document.querySelector('.wind-direction');
const windSpeed = document.querySelector('.wind-speed');

const searchForLocation = function() {
  const searchField = document.querySelector('#search');
  const searchIcon = document.querySelector('.search-icon');

  searchIcon.addEventListener('click', () => {
    if (searchField.value !== '') {
      searchError.textContent = '';
      let query = searchField.value;
      console.log(query);
      fetchCurrentWeatherQuery(query);
      removeLastForecast();
      fetchForecastQuery(query);
    }
  });

  searchField.addEventListener('search', () => {
    if (searchField.value !== '') {
      searchError.textContent = '';
      let query = searchField.value;
      console.log(query);
      fetchCurrentWeatherQuery(query);
      removeLastForecast();
      fetchForecastQuery(query);
    }
  });
}

const removeLastForecast = function() {
  const quickForecastContainer = document.querySelector('.quick-forecast-container');
  const forecastContainer = document.querySelector('.forecast-container');
  forecastContainer.removeChild(quickForecastContainer);  
}

searchForLocation();

const fetchCurrentWeatherQuery = function(query) {
  fetch(`https://api.weatherapi.com/v1/current.json?key=c00761ba763b43ccb17175426240106&q=${query}&aqi=yes`, {mode:'cors'}).then(response => {
  return response.json().then(function(response) {
    console.log(response);

    let location = response.location;
    let currentWeather = response.current;

    const switchDegreeValues = function() {
      let currentDegrees = 'c';
      switchDegreesButton.addEventListener('click', () => {
        if (currentDegrees === 'c') {
          currentDegrees = 'f';
          degreesInfo.textContent = currentWeather.temp_f + ' °F';
          switchDegreesButton.textContent = 'Switch to celcius';
          feelsLikeDegrees.textContent = 'Feels like: ' + currentWeather.feelslike_f + ' °F';
        }
        else {
          currentDegrees = 'c';
          degreesInfo.textContent = currentWeather.temp_c + ' °C';
          switchDegreesButton.textContent = 'Switch to fahrenheit';
          feelsLikeDegrees.textContent = 'Feels like: ' + currentWeather.feelslike_c + ' °C';
        }
      });
      }

    const formatDateAndTime = function() {
      const weekDayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      let currentDate = new Date(location.localtime);
      console.log(currentDate);
      let weekDay = weekDayArray[currentDate.getUTCDay()];
      let day = currentDate.getUTCDate();
      let month = monthArray[currentDate.getUTCMonth()];
      let year = currentDate.getUTCFullYear();

      let hour = currentDate.getHours();
      let minute = currentDate.getUTCMinutes();
      locationDate.textContent = `${weekDay}, ${day} ${month} ${year}`;
      
      if (hour < 10) {
        hour = '0' + hour.toString();
      }
      if (minute < 10) {
        minute = '0' + minute.toString();
      }
      locationTime.textContent = `${hour}:${minute}`;
    }

    formatDateAndTime();

    const setCurrentWeatherInformation = function() {
      userLocation.textContent = `${location.name}, ${location.country}`;

      weatherText.textContent = currentWeather.condition.text;

      degreesInfo.textContent = `${currentWeather.temp_c} °C`;
      feelsLikeDegrees.textContent = `Feels like: ${currentWeather.feelslike_c} °C`;
      
      lastUpdated.textContent = `Last updated: ${currentWeather.last_updated}`;
      
      humidity.textContent = `Humidity: ${currentWeather.humidity}%`;
      precipitation.textContent = `Precipitation: ${currentWeather.precip_mm} mm`;
      pressure.textContent = `Pressure: ${currentWeather.pressure_mb} mb`;
      visibility.textContent = `Visibility: ${currentWeather.vis_km} km`;
      
      windDirection.textContent = `Wind direction: ${currentWeather.wind_degree}° ${currentWeather.wind_dir}`;
      windSpeed.textContent = `Wind speed: ${currentWeather.wind_kph} km/h`;
    }

    setCurrentWeatherInformation();
    
    const setWeatherIcons = function() {
      let weatherIconCode = currentWeather.condition.code;
      console.log(weatherIconCode);
      let isDay = currentWeather.is_day;
      let currentWeatherIcon = document.querySelector('.currentWeatherIcon');
      currentWeatherIcon.className = '';
      currentWeatherIcon.classList.add('wi');
      currentWeatherIcon.classList.add('currentWeatherIcon');

      if (isDay) {
        if (weatherIconCode === 1000) {
          weatherText.textContent = 'Sunny';
          currentWeatherIcon.classList.add(`wi-day-sunny`);
        }
        else {
          for (let item of conditionsArray) {
            if (item.code !== 1000 && item.code === weatherIconCode) {
              currentWeatherIcon.classList.add(`wi-day-${item.icon}`);
            }
          }
        }
      }
      else {
        if (weatherIconCode === 1000) {
          weatherText.textContent = 'Clear';
          currentWeatherIcon.classList.add(`wi-night-clear`);
        }
        else {
          for (let item of conditionsArray) {
            if (item.code !== 1000 && item.code === weatherIconCode) {
            currentWeatherIcon.classList.add(`wi-night-${item.icon}`);
            }
          }
        }
      }      
    }

    setWeatherIcons();
  
    switchDegreeValues();
  })
  .catch(error => {
    const searchField = document.querySelector('#search');
    if (searchField.value !== '') {
      searchError.textContent = 'No matching location found';
      }
  });
});
  return location;
}

const searchError = document.querySelector('.search-error');
const defaultCurrentWeatherQuery = 'Moscow';

fetchCurrentWeatherQuery(defaultCurrentWeatherQuery);

const fetchForecastQuery = function(query) {
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=c00761ba763b43ccb17175426240106&q=${query}&days=10&aqi=no&alerts=yes`, {mode: "cors"}).then(response => {
    return response.json().then(function(response){
      console.log(response);

      let isDay = response.current.is_day;

      const forecastContainer = document.querySelector('.forecast-container');
      const forecastArray = response.forecast.forecastday;
      const quickForecastContainer = document.createElement('div');
      quickForecastContainer.classList.add('quick-forecast-container');
      forecastContainer.appendChild(quickForecastContainer);

      console.log(forecastArray);

      const showQuickForecast = function() {
      for (let day of forecastArray) {
        let dayElement = document.createElement('div');
        dayElement.classList.add('day');
        quickForecastContainer.appendChild(dayElement);

        let date = document.createElement('div');
        date.textContent = day.date;
        dayElement.appendChild(date);

        let minTemperature = document.createElement('div');
        minTemperature.textContent = day.day.mintemp_c;
        dayElement.appendChild(minTemperature);

        let maxTemperature = document.createElement('div');
        maxTemperature.textContent = day.day.maxtemp_c;
        dayElement.appendChild(maxTemperature);

        let condition = document.createElement('i');
        condition.className = '';
        condition.classList.add('wi');

        dayElement.appendChild(condition);
        let dayConditionCode = day.day.condition.code;

        conditionsArray.map(function(item) {
          if (isDay) {
            if (item.code !== 1000 && item.code === dayConditionCode) {
              condition.classList.add(`wi-day-${item.icon}`);
            }
            else {
              if (item.code === 1000) {
              condition.classList.add(`wi-day-sunny`);
              }
            }
          }
          else {
            if (item.code !== 1000 && item.code === dayConditionCode) {
              condition.classList.add(`wi-night-${item.icon}`);
            }
            else {
              if (item.code === 1000)
              condition.classList.add(`wi-night-clear`);
            }
          }
          return item;
        });
      }
    }
    
    showQuickForecast();
    });
  })
  .catch(error => {
    const searchField = document.querySelector('#search');
    const previousLocation = userLocation.textContent.split(',')[0];
    console.log(previousLocation);
    if (searchField.value !== '') {
    searchError.textContent = 'No matching location found';
    }
    console.log(userLocation);
    fetchForecastQuery(previousLocation);
  });
}

const defaultForecastQuery = 'Moscow';

fetchForecastQuery(defaultForecastQuery);