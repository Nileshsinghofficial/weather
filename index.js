
let cityName = document.getElementById('cityName');
let val;

const API_CONFIG = {
    baseurl: 'https://api.openweathermap.org/data/2.5/weather',
    api_key: '3392ed9f2456b902a0bef58f07a70e1e'

}

function showProgressLoader(callback) {
    const loaderContainer = document.getElementById('loaderContainer');
    const loaderText = document.getElementById('loaderText');
    const loaderFill = document.getElementById('loaderFill');
    
    loaderContainer.style.display = 'block';
    document.getElementById('secondDiv').innerHTML = '';


    let progress = 0;
    let interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5; // Random speed
        if (progress > 100) progress = 100;
        loaderText.textContent = `Loading ${progress}%`;
        loaderFill.style.width = progress + "%";

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loaderContainer.style.display = 'none';
                if (callback) callback();
            }, 200); // small delay for effect
        }
    }, 100);
}

async function fetchWeather(city) {
    showProgressLoader(async () => {
    try {

        let url = `${API_CONFIG.baseurl}?q=${city}&appid=${API_CONFIG.api_key}&units=metric`
        let responce = await fetch(url);
        let result = await responce.json();

        cityName.value = ''

        // console.log(result)
        if(result.cod === 200){
            displayWeather(result);
        } else {
            document.getElementById('secondDiv').innerHTML = `<h1>${result.message || 'something went wrong'}</h1>`
        }
        
        
    } catch (err){
        console.log("Error fetching weather",err);
        document.getElementById('secondDiv').innerHTML =  `<h1>Unable to fetch data</h1>`
    }

    });

}

async function fetchloc(leti, logni){
    showProgressLoader(async () => {
    try {
        let url = `${API_CONFIG.baseurl}?lat=${leti}&lon=${logni}&appid=${API_CONFIG.api_key}&units=metric`
        let responce = await fetch(url);
        let result = await responce.json();
        // console.log(result)
        if(result.cod === 200){
            displayWeather(result);
        } else {
            document.getElementById('secondDiv').innerHTML = `<h1>${result.message || 'something went wrong'}</h1>`
        }
        
    } catch (err){
        console.log("Error fetching weather",err);
        document.getElementById('secondDiv').innerHTML =  `<h1>Unable to fetch data</h1>`
    }

    });

}

document.getElementById('searchBtn').addEventListener('click',() => {
    let city = cityName.value.trim();
    if(cityName.value == ''){
        alert('Enter City name');
    }
    else{
        document.getElementById('secondDiv').innerHTML = `<p>Loading....</p>`
        fetchWeather(city)
    }

    
    
})

function displayWeather({name = '-', main = {}, wind = {}}){
    let temp = main.temp ?? '-' ;
    let speed = wind.speed ?? '-' ;
    let pressure = main.pressure ?? '-';
    let humidity = main.humidity ?? '-';
    div = `
        <div id="weatherInfo">
            <p id="temp">${temp}°C</p>
            <P id="city">${name}</P>
            <div class="otherInfo">
                <div class="wind">
                    <p>Wind</p>
                    <p>${speed}/h</p>
                </div>
                <div class="wind">
                    <p>Pressure<p>
                    <p>${pressure}</p>
                </div>
                <div class="wind">
                    <p>Humidity</p>
                    <p>${humidity}</p>
                </div>
            </div>
        </div>`


    document.getElementById('secondDiv').innerHTML = div
    
}

document.getElementById('locBtn').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition( position => {
        let leti = position.coords.latitude;
        let logni = position.coords.longitude;
        fetchloc(leti, logni)
    })
     
})




