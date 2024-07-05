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
      query = searchField.value;
      console.log(query);
      fetchQuery(query);
    }
  });

  searchField.addEventListener('search', () => {
    if (searchField.value !== '') {
      query = searchField.value;
      console.log(query);
      fetchQuery(query);
    }
  });
}

searchForLocation();

let query = 'Moscow';

const fetchQuery = function(query) {
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
  });
});
}

fetchQuery(query);
