const timeEl = document.getElementById('time');
const dataEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezoneEl = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById ('weather-forecast');
const currentTempEl =document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December']

const API_KEY = '30552c1e8594ae98b41c25641fa95b1a'

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM'

  timeEl.innerHTML = (hoursIn12HrFormat < 10? '0' + hoursIn12HrFormat: hoursIn12HrFormat) + ':' + (minutes < 10? '0' + minutes: minutes) + `<span id="am-pm"> ${ampm} </span>`
  dataEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]
}, 500);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let {latitude, longitude} = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
        })
    })
}

function showWeatherData (data){
    let {humidity, temp, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML= '<b>Time Zone:  </b>' + data.timezone;
    countryEl.innerHTML = '<b>Coordinates:  </b>' + data.lat + 'N' + data.lon + 'E'

        currentWeatherItemsEl.innerHTML =
            `<div class="weather-items">
                <div>Current Temp:</div>
                <div>${temp}° F</div>
            </div>

            <div class="weather-items">
                <div>Humidity:</div>
                <div>${humidity}%</div>
            </div>


            <div class="weather-items">
                <div>Wind Speed:</div>
                <div>${wind_speed} mph</div>
            </div>
            
            <div class="weather-items">
                <div>Sunrise:</div>
                <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
            </div>
            
            <div class="weather-items">
                <div>Sunset:</div>
                <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
            </div>`;

        let otherDayForecast = ''
        data.daily.forEach((day, idx) => {
            if(idx == 0){
                currentTempEl.innerHTML = `
                   <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                    <div class="temp">Night - ${day.temp.night}° F</div>
                    <div class="temp">Day - ${day.temp.day}° F</div>
                </div>
                `
            }else{
                otherDayForecast += `
                <div class="weather-forecast-item">
                    <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Night - ${day.temp.night}° F</div>
                    <div class="temp">Day - ${day.temp.day}° F</div>
                </div>`
            }
        })
        weatherForecastEl.innerHTML = otherDayForecast;
}