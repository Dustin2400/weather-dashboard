var inputEl = document.querySelector("#city");
var searchFormEl = document.querySelector("#search");
var fiveDayEl = document.createElement("div");
var historyEl = document.querySelector(".history");
var searchHistory = [];

function searchHandler (event) {
    event.preventDefault();
    var city = inputEl.value.trim();
    var capSentence = [];
    var sentence = city.split(" ");
    for(i=0; i<sentence.length; i++) {
        var word = sentence[i];
        word = word.split('')
        word[0] = word[0].toUpperCase();
        word = word.join('');
        capSentence.push(word);
        }
    city = capSentence.join(" ");
    fetchInfo(city);
}

function fetchInfo(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=0d3b4e2432d34a50dd223536499db182";
    fetch(apiUrl).then(function(response){
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                var urb = city;
                searchHistory.push({
                    city: urb
                });
                createSearchHistoryButton(city);
                
                var lat = data.coord.lat;
                var long = data.coord.lon;
                var advancedApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&units=imperial&appid=0d3b4e2432d34a50dd223536499db182";
                fetch(advancedApiUrl).then(function(response1) {
                    response1.json().then(function(data1){
                        createForecast(data1, city);
                    });
                });
            });
        } else {
            alert("Nonexistent City");
        }
    });
}

function createSearchHistoryButton(city){
    
    saveCities();
    displayCities();
}

function saveCities() {
    localStorage.setItem("cities", JSON.stringify(searchHistory));
}

function displayCities() {
    historyEl.innerHTML = "";
    searchHistory = JSON.parse(localStorage.getItem("cities"));
    if (!searchHistory){
        searchHistory=[];
    }
    console.log(searchHistory);
    for(i=0; i<searchHistory.length; i++) {
        var buttonEl = document.createElement("button");
        buttonEl.classList = "historical-button"
        var city = searchHistory[i].city;
        buttonEl.innerHTML = city;
        buttonEl.addEventListener("click", historicalButtonHandler);
        historyEl.appendChild(buttonEl);
    }
}

function historicalButtonHandler(event) {
    event.preventDefault;
    var city = this.innerHTML;
    fetchInfo(city);
}

function createForecast(data, city) {
    var forecastEl = document.querySelector("#forecast");
    forecastEl.innerHTML = "";
    var cityNameEl = document.createElement("h2");
    cityNameEl.classList = "forecast-city";
    cityNameEl.textContent = city+" ("+moment().format('L')+")";
    forecastEl.appendChild(cityNameEl);
    var forecastIconEl = document.createElement("i");
    iconClass = getIcon(data.current.weather[0].id);
    forecastIconEl.classList = "wi "+iconClass+" forecast-icon";
    forecastEl.appendChild(forecastIconEl);
    console.log(data);
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: "+data.current.temp+ " F";
    var windEl = document.createElement("p");
    windEl.textContent = "Wind: "+data.current.wind_speed+ " MPH";
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: "+data.current.humidity +" %";
    var uvEl = document.createElement("p");
    var uv = data.current.uvi;
    var uvIntensity= getUvIntensity(uv);
    uvEl.innerHTML = "UV Index: <span class='"+uvIntensity+"'>"+uv+"</span>";
    var dataEl = document.createElement("div");
    dataEl.classList = "weather-data";

    forecastEl.appendChild(dataEl);
    dataEl.appendChild(tempEl);
    dataEl.appendChild(windEl);
    dataEl.appendChild(humidityEl);
    dataEl.appendChild(uvEl);

    createFiveDay(data);
}


function createFiveDay(data) {
    var body = document.querySelector(".body");
    fiveDayEl.classList = "five-day";
    body.appendChild(fiveDayEl);
    fiveDayEl.innerHTML = "";
    for (i=1; i<6; i++) {
        var card = document.createElement("div");
        card.classList = "card";
        var day = document.createElement("h3");
        day.innerHTML = moment().add(i,'days').format("L");
        fiveDayEl.appendChild(card);
        card.appendChild(day);
        var cardIcon = document.createElement("i")
        var cardIconClass = getIcon(data.daily[i].weather[0].id);
        cardIcon.classList = "wi "+cardIconClass+" card-icon";
        card.appendChild(cardIcon);
        var cardTempEl = document.createElement("p");
        cardTempEl.textContent = "Temp: "+data.daily[i].temp.day+ " F";
        cardTempEl.classList = "card-data";
        var cardWindEl = document.createElement("p");
        cardWindEl.textContent = "Wind: "+data.daily[i].wind_speed+ " MPH";
        cardWindEl.classList = "card-data";
        var cardHumidityEl = document.createElement("p");
        cardHumidityEl.textContent = "Humidity: "+data.daily[i].humidity +" %";
        cardHumidityEl.classList = "card-data";
        
        card.appendChild(cardTempEl);
        card.appendChild(cardWindEl);
        card.appendChild(cardHumidityEl);
    }
}

function getIcon(id) {
    switch (id) {
    case 800:
        var time = getTime();
        if (time == "day")
            return "wi-day-sunny";
        else {
            return "wi-night-clear";
        }
    case 701:
    case 711:
    case 721:
    case 751:
    case 761:
    case 762:
    case 781:
    case 741:
        var status = getStatus(id);
        return "wi-" + status;
    default:
        var status = getStatus(id);
        var time = getTime();
        return "wi-"+time+"-"+status;
    }
}

function getStatus(id) {
    switch (id) {
        case 210:
        case 211:
        case 221:
            return "lightning";
        case 202:
        case 212:
            return "thunderstorm";
        case 200:
        case 201:
        case 230:
        case 231:
        case 232:
            return "storm-showers";
        case 300:
        case 301:
        case 302:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 321:
            return "sprinkle";
        case 500:
        case 520:
        case 521:
            return "showers";
        case 501:
        case 502:
        case 503:
        case 504:
            return "rain";
        case 511:
        case 522:
        case 531:
        case 615:
        case 616:
            return "rain-mix";
        case 613:
        case 612:
            return "sleet";
        case 600:
        case 601:
        case 602:
        case 620:
        case 621:
        case 622:
            return "snow";
        case 741:
            return "fog";
        case 701:
        case 711:
        case 721:
        case 751:
        case 761:
            return "dust";
        case 762:
            return "volcano";
        case 771:
            return "gusts";
        case 781:
            return "tornado";
        case 800:
            return "sunny";
        case 804:
        case 801:
        case 802:
        case 803:
            return "cloudy";
    }
}

function getTime() {
    var sunrise = moment().set({'hour': 6, 'minute': 00});
    var sunset = moment().set({'hour': 18, 'minute': 00});
    if (moment().isAfter(sunset)) {
        return "night-alt";
    } else if (moment().isAfter(sunrise)) {
        return "day";
    } else {
        return "night-alt";
    }
}

function getUvIntensity(uvi) {
    if (uvi >= 11) {
        return "severe";
    } else if (uvi > 8) {   
        return "bad";
    } else if (uvi > 6) {
        return "moderate";
    } else if (uvi > 3) {
        return "good";
    } else {
        return "fair";
    }
}


searchFormEl.addEventListener("click", searchHandler);

displayCities();