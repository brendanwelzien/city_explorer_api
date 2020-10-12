'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const response = require('express');
const app = express();

//to accept incoming traffic
const PORT = process.env.PORT || 3001;


// allows for public server
app.use(cors());

//server route to homepage
app.get('/', (request, response) => {
    response.send('homepage');
});

// functions
function Location (obj) {
    this.search_query = obj[0].display_name;
    this.formatted_query = obj[0].display_name;
    this.latitude = obj[0].lat;
    this.longitude = obj[0].lon;
}
function Weather(obj2) {
    this.city = obj2.city_name;
    this.forecast = obj2.weather.description;
    this.time = obj2.datetime;
}
// since there is an array, you need to make an instance of the characteristics
function weatherConfig (request, response){
    let weatherArr = [];
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

// location request and response
app.get('/location', (request, response) => {
    const locationData = require('./data/location.json');
    const createLocation = new Location(locationData);
    response.send(createLocation);
    let cityName = 'Lynnwood';
    if(request.query.city !== cityName){
        app.get('/', (request, response) => {
        response.status(500).send('Oops wrong city');
        });
    }
})

// weather request and response
app.get('/weather', weatherConfig);


// simple error feature
function handleLocation(request, response) {
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

app.listen(PORT,() => console.log(`Listening on port ${PORT}`));