'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const superagent = require('superagent');

//to accept incoming traffic
const PORT = process.env.PORT || 3001;




// allows for public server
app.use(cors());

//server route to homepage
app.get('/', (request, response) => {
    response.send('homepage');
});

// functions
function Location (locationObj, city) {
    this.search_query = city;
    this.formatted_query = locationObj[0].display_name;
    this.latitude = locationObj[0].lat;
    this.longitude = locationObj[0].lon;
}
function Weather(weatherObj) {
    
    this.forecast = weatherObj.weather.description;
    this.time = weatherObj.datetime;
}

function Trails(trailObj) {
    console.log(trailObj);
    this.name = trailObj.name;
    this.location = trailObj.location;
    this.length = trailObj.length;
    this.stars = trailObj.stars;
    this.star_votes = trailObj.starVotes;
    this.summary = trailObj.summary;
    this.conditions = trailObj.conditionStatus;
    this.condition_date = trailObj.conditionDate;
    this.condition_time = trailObj.conditionDetails;
}

// weather request and response

 /*   let weatherArr = [];
    let obj = require('./data/weather.json');
    obj.data.forEach(label => {
        let weatherStuff = new Weather(label);
        console.log(label);
        weatherArr.push(weatherStuff);
    });
    response.send(weatherArr);
    app.get('*', (request, response) => {
        response.status(404).send('Sorry, something went wrong,');
    });
}
*/
app.get('/weather', weatherConfig);
function weatherConfig (request, response){
const cityData = request.query.search_query;
const GEOCODEAPI = process.env.GEOCODE_API_KEY;
const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityData}&days=7&key=${GEOCODEAPI}`; 

console.log(weatherURL);
// superagent process is GET > SET > THEN > RETURN XXXX > CATCH?
superagent.get(weatherURL)

    .then(weatherRetrievalInfo => {
        const weatherObj = weatherRetrievalInfo.body;
        console.log(weatherObj);
        let weatherCollection = weatherObj.data.map( objIndex => {
            const weatherMapFcn = new Weather(objIndex);
            return weatherMapFcn;
        })
        response.send(weatherCollection);
    }); // this is the request / response promise
}


// location request and response
app.get('/location', (request, response) => {
    console.log(request.query.city);
    const cityDataTwo = request.query.city;
    const LOCATIONIQAPI = process.env.LOCATIONIQ_API_KEY;
    const locationURL = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQAPI}&q=${cityDataTwo}&format=json`
    superagent.get(locationURL)
        .then(locationInfo => {
            console.log(locationInfo.body);
            const locationObj = locationInfo.body;
            const locationNew = new Location(locationObj, cityDataTwo);
            response.send(locationNew);
        })
        .catch(error => {
            console.log(error);
            return response.status(500).send(error);
        });
});

//trails 
app.get('/trails', trailFcn);

function trailFcn(request, response) {
    const TRAILSAPI = process.env.TRAILS_API_KEY;
    const lonData = request.query.longitude;
    const latData = request.query.latitude;
    const trailsURL = `https://hikingproject.com/data/get-trails?lat=${latData}&lon=${lonData}&maxDistance=30&key=${TRAILSAPI}`;
    // use superagent method ... .get .then return then response send
    superagent.get(trailsURL)
    .set('key', TRAILSAPI)
        .then(trailData => {
        const trailObj = trailData.body;
        
        let trailCollection = trailObj.trails.map(trailIndex => {
            console.log(trailIndex);
            const trailNew = new Trails(trailIndex);
            return trailNew;
        });
        response.send(trailCollection);
    });  
}


// simple error feature
/*function handleLocation(request, response) {
    try {
      // try to "resolve" the following (no errors)
      const geoData = require('./data/location.json');
      const city = request.query.city; // "seattle" -> localhost:3000/location?city=seattle
      const locationData = new Location(city, geoData);
      response.json(locationData);
    } catch {
      // otherwise, if an error is handed off, handle it here
      response.status(500).send('sorry, something broke.');
    }
  }
*/
app.listen(PORT, () => {
    console.log(`${PORT}`)
});