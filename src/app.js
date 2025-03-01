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
  const hourForecastContainer = document.querySelector('.hour-forecast-container');
  forecastContainer.removeChild(quickForecastContainer);
  forecastContainer.removeChild(hourForecastContainer);  
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
      return {weekDayArray, monthArray};
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
  .catch(function() {
    const searchField = document.querySelector('#search');
    if (searchField.value !== '') {
      searchError.textContent = 'No matching location found';
      }
  });
});
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
      let counter = 0;

      for (let day of forecastArray) {
        counter += 1
        let dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.style.borderRadius = '5px 5px 0 0';

        if (counter === 1) {
        dayElement.classList.add('selected-day');
        }
        quickForecastContainer.appendChild(dayElement);

        const weekDayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        let date = document.createElement('div');
        let formattedDate = new Date(day.date);
        date.textContent = `${weekDayArray[formattedDate.getDay()]}, ${formattedDate.getDate()} ${monthArray[formattedDate.getMonth()]}`;
        dayElement.appendChild(date);

        let minTemperature = document.createElement('div');
        minTemperature.classList.add('min');
        minTemperature.textContent = day.day.mintemp_c > 0 ? '+' + day.day.mintemp_c : day.day.mintemp_c;
        dayElement.appendChild(minTemperature);

        let maxTemperature = document.createElement('div');
        maxTemperature.classList.add('max');
        maxTemperature.textContent = day.day.maxtemp_c > 0 ? '+' + day.day.maxtemp_c : day.day.maxtemp_c;
        dayElement.appendChild(maxTemperature);

        let temperatureContainer = document.createElement('div');
        temperatureContainer.classList.add('quick-forecast-temperature');
        temperatureContainer.appendChild(minTemperature);
        temperatureContainer.appendChild(maxTemperature);
        dayElement.appendChild(temperatureContainer);

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
        temperatureContainer.appendChild(condition);
      }
    }
    
    showQuickForecast();

    const hourForecastContainer = document.createElement('div');
    hourForecastContainer.classList.add('hour-forecast-container');
    forecastContainer.appendChild(hourForecastContainer);

    const hourContainer = document.createElement('div');
    hourContainer.classList.add('hour-container');
    hourForecastContainer.appendChild(hourContainer);

    const hourForecastDegreeContainer = document.createElement('div');
    hourForecastDegreeContainer.classList.add('hour-forecast-degree-container');
    hourForecastContainer.appendChild(hourForecastDegreeContainer);

    const showDayHourForecast = function(day) {
      let hourArray = day.hour;

      for (let i = 1; i < hourArray.length; i += 3) {
      let date = new Date(hourArray[i].time);

      let hourElement = document.createElement('div');
      hourElement.classList.add('hour');
      hourForecastContainer.appendChild(hourElement);

      let hourTime = document.createElement('div');
      hourTime.textContent = `${date.getHours()}:${date.getMinutes()}0`;
      hourElement.appendChild(hourTime);

      hourContainer.appendChild(hourElement);

      let temperatureDegreesElement = document.createElement('div');
      temperatureDegreesElement.classList.add('hour-degree');
      temperatureDegreesElement.textContent = `${hourArray[i].temp_c}`;
      hourForecastDegreeContainer.appendChild(temperatureDegreesElement);
      }
    }

    let firstDay = forecastArray[0];
    console.log(firstDay);

    showDayHourForecast(firstDay);

    const removePreviousHourForecast = function() {
      hourContainer.textContent = '';
      hourForecastDegreeContainer.textContent = '';
    }

    const changeHourForecastDay = function() {
      let forecastDays = document.querySelectorAll('.day');

      for (let i = 0; i < forecastDays.length; i++) {
        forecastDays[i].addEventListener('click', () => {
          removePreviousHourForecast();
          showDayHourForecast(forecastArray[i]);

          let currentlySelected = document.querySelector('.selected-day');
          console.log(currentlySelected);
          if (currentlySelected) {
            currentlySelected.classList.remove('selected-day');
          }

          forecastDays[i].classList.add('selected-day');
        });
      }
    }

    changeHourForecastDay();

    const temperatureText = document.createElement('div');
    temperatureText.classList.add('hour-temperature-text');
    temperatureText.style.textAlign = 'center';
    temperatureText.textContent = `Temperature, °C`;
    hourForecastContainer.insertBefore(temperatureText, hourForecastDegreeContainer);
    });
  })
  .catch(function() {
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
