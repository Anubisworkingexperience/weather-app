const searchField = document.querySelector('#search');
const userLocation = document.querySelector('.user-location');
const locationDate = document.querySelector('.location-date');
const locationTime = document.querySelector('.location-time');
const degreesInfo = document.querySelector('.degrees');
const weatherText = document.querySelector('.weather-desc');
const weatherIcon = document.querySelector('.weather-icon');
const switchDegreesButton = document.querySelector('.switch-degrees');


fetch(`https://api.weatherapi.com/v1/current.json?key=c00761ba763b43ccb17175426240106&q=Moscow&aqi=yes`, {mode:'cors'}).then(response => {
  return response.json().then(function(response) {
    console.log(response);

    let location = response.location;
    let currentWeather = response.current;

    function switchDegreeValues() {
      let currentDegrees = 'c';
      switchDegreesButton.addEventListener('click', () => {
        if (currentDegrees === 'c') {
          currentDegrees = 'f';
          degreesInfo.textContent = currentWeather.temp_f + ' °F';
          switchDegreesButton.textContent = 'Switch to celcius';
        }
        else {
          currentDegrees = 'c';
          degreesInfo.textContent = currentWeather.temp_c + ' °C';
          switchDegreesButton.textContent = 'Switch to farenheit';
        }
      });
      }

    function formatDateAndTime() {
      const weekDayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      let currentDate = new Date(location.localtime);
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
  
    userLocation.textContent = location.name.concat(', ', location.country);
    weatherText.textContent = currentWeather.condition.text;
    weatherIcon.src = currentWeather.condition.icon;
    degreesInfo.textContent = currentWeather.temp_c + ' °C';
    switchDegreeValues();
  });
});

