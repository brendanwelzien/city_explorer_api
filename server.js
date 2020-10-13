'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const response = require('express');
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
function Location (locationObj) {
    this.formatted_query = locationObj[0].display_name;
    this.latitude = locationObj[0].lat;
    this.longitude = locationObj[0].lon;
}
function Weather(weatherObj) {
    
    this.forecast = weatherObj[0].weather.description;
    this.time = weatherObj[0].datetime;
}

function Trails(trailObj) {
    this.name = trailObj.trails[0].name;
    this.location = trailObj.trails[0].location;
    this.length = trailObj.trails[0].length;
    this.stars = trailObj.trails[0].stars;
    this.star_votes = trailObj.trails[0].starVotes;
    this.summary = trailObj.trails[0].summary;
    this.conditions = trailObj.trails[0].conditionStatus;
    this.condition_date = trailObj.trails[0].conditionDate;
    this.condition_time = trailObj.trails[0].conditionDetails;
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
const cityData = req.query.city;
const GEOCODEAPI = process.env.GEOCODE_API_KEY;
const weatherURL = `https://api.weatherbit.io/v2.0/current?city=${cityData}&key=${GEOCODEAPI}`; 

console.log(weatherURL);
// superagent process is GET > SET > THEN > RETURN XXXX > CATCH?
superagent.get(weatherURL)

.set('key', GEOCODEAPI)
    .then(weatherRetrievalInfo => {
        const weatherObj = weatherRetrievalInfo.body;

        let weatherCollection = weatherObj.data.map( objIndex => {
            const weatherMapFcn = new Weather(objIndex);
            return weatherMapFcn;
        })
        response.send(weatherCollection);
    }); // this is the request / response promise
}


// location request and response
app.get('/location', (request, response) => {
    const cityDataTwo = request.query.city;
    const LOCATIONIQAPI = process.env.LOCATIONIQ_API_KEY;
    const locationURL = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQAPI}&q=${cityDataTwo}`
    superagent.get(locationURL)
        .then(locationInfo => {
            const locationObj = locationInfo.body;
            const locationNew = new Location(locationObj);
            response.send(locationNew);
        })
        .catch(error => {
            return response.status(500).send(error);
        });
});

//trails 
app.get('trails', trailFcn);

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
app.listen(PORT);