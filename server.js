'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const response = require('express');
const superagent = require('superagent');
const pg = require('pg');


//to accept incoming traffic
const PORT = process.env.PORT || 3001;
const movieAPI = process.env.MOVIE_API_KEY;
const yelpAPI = process.env.YELP_API_KEY;



// allows for public server
app.use(cors());

//server route to homepage
app.get('/', (request, response) => {
    response.send('homepage');
});

const client = new pg.Client(dbURL); //connecting to database

// functions
function Location (locationObj, city) {
    this.search_query = city;
    this.formatted_query = locationObj.display_name;
    this.latitude = locationObj.lat;
    this.longitude = locationObj.lon;
}
function Weather(weatherObj) {
    
    this.forecast = weatherObj.weather.description;
    this.time = weatherObj.datetime;
}

function Trails(trailObj) {
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

function yelpRestaurant(yelpObj) {
    this.name = yelpObj.name;
    this.image_url = yelpObj.image_url;
    this.price = yelpObj.price;
    this.rating = yelpObj.rating;
    this.url = yelpObj.url;
}

function Movie(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.average_votes = movieObj.vote_average;
    this.total_votes = movieObj.vote_count;
    this.image_url =`https://image.tmdb.org/t/p/w500/${movieObj.poster_path}`;
    this.popularity = movieObj.popularity;
    this.released_on = movieObj.release_date;
}


app.get('/weather', weatherConfig);
function weatherConfig (request, response){
const cityData = request.query.search_query;
const GEOCODEAPI = process.env.GEOCODE_API_KEY;
const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityData}&days=7&key=${GEOCODEAPI}`; 


// superagent process is GET > SET > THEN > RETURN XXXX > CATCH?
superagent.get(weatherURL)

    .then(weatherRetrievalInfo => {
        const weatherObj = weatherRetrievalInfo.body;
        
        let weatherCollection = weatherObj.data.map( objIndex => {
            const weatherMapFcn = new Weather(objIndex);
            return weatherMapFcn;
        })
        response.send(weatherCollection);
    })
        .catch(error => {
            response.status(500).send(error);
        }); // this is the request / response promise
}


// location request and response
app.get('/location', (request, response) => {
    
    const cityDataTwo = request.query.city;
    const LOCATIONIQAPI = process.env.LOCATIONIQ_API_KEY;
    const locationURL = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQAPI}&q=${cityDataTwo}&format=json`
    superagent.get(locationURL)
        .then(locationInfo => {
            
            const locationObj = locationInfo.body;
            const locationNew = new Location(locationObj, cityDataTwo);
            response.send(locationNew);
        })
        .catch(error => {
            
            return response.status(500).send(error);
        });
    

    // RECEIVED HELP FROM TA CHANCE IN LAB 7 / 8
app.get('/location', (request, response) => {

    const selectSQL = 'SELECT * FROM location;';
    const cityDataTwo = request.query.city;

    console.log(request.query.city);
    client.query(selectSQL)


        .then(dataSQL => {
            let grabValues = dataSQL.rows.map(city => city.search_query.toLowerCase());
            console.log(grabValues);

            if(grabValues.includes(cityDataTwo)){
                client.query(`SELECT * FROM location WHERE search_query = '${cityDataTwo}'`)

                .then(placeStuff => {
                    response.send(placeStuff.rows[0]);
                });
            } else {
                const locationURL = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQAPI}&q=${cityDataTwo}&format=json`;
                console.log('in superagent');

                superagent.get(locationURL)
                .then(sqlConfig => {
                    const sqlArr = sqlConfig.body[0];


                    console.log(sqlArr); // (locationObj, city)
                    const locationNew = new Location(sqlArr, cityDataTwo);
                    //response.send(locationNew);
                    const cityName = locationNew.search_query;
                    const cityInfo = locationNew.formatted_query;

                    const cityLat = parseFloat(locationNew.latitude);

                    const cityLon = parseFloat(locationNew.longitude);

                    const cityString = 'INSERT INTO location (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)';

                    const cityLayout = [cityName, cityInfo, cityLat, cityLon];
                    client.query(cityString, cityLayout)
                     // this utilizes crud / rest with formatting
                     .then (() => {
                         response.status(200).send(locationNew);
                     })
                     .catch(error => {
                         response.status(500).send(error);
                });
            })
           .catch(error => {
                response.status(500).send(error); // error is for retrieving location
            });
        }
});
});
//trails 
app.get('/trails', trailFcn);

function trailFcn(request, response) {
   // const TRAILSAPI = process.env.TRAILS_API_KEY;
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
    })
    .catch(error => {
        response.status(500).send(error.message);
    });  
}

//Yelp
app.get('/yelp', restaurantConfig);

function restaurantConfig(request, response) {
    const latData = request.query.latitude;
    const longData =request.query.longitude;
    const yelpURL = `https://api.yelp.com/v3/businesses/search?latitude=${latData}&longitude=${longData}`;
    
    superagent.get(yelpURL)
    .set('Authorization',`Bearer ${yelpAPI}`)

    .then(yelpData => {
        const yelpObj = yelpData.body;
        console.log(yelpObj);

        let yelpCollection = yelpObj.businesses.map(yelpIndex => {
            const restaurantNew = new yelpRestaurant(yelpIndex);
            return restaurantNew;
        });
        let sliceYelp = yelpCollection.slice(0,5);
        response.send(sliceYelp);
    });
}

//Movie
app.get('/movies',movieConfig);

function movieConfig(request, response) {
   
    const movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${movieAPI}&query=${request.query.search_query}`;

    superagent.get(movieURL)
    .set('key', movieAPI)
    .then(movieData => {
        const movieObj = movieData.body;
        
        let movieCollection = movieObj.results.map(movieIndex => {
           
            const movieNew = new Movie(movieIndex);
            return movieNew;
        });
        response.send(movieCollection);
    })
    .catch(err => {
        response.status(500).send(err);
    });
}






app.listen(PORT, () => {
    console.log(`server is up on ${PORT}`);
});
})
.catch( error => {
    console.error('connection error', error);
}) // taken from lecture example