# City Explorer API

## WorkFlow
[Trello](https://trello.com/b/8SmmqQxV/cityexplorerapi?menu=filter&filter=label:Lab%206,label:Lab%207,label:Lab%208,label:Lab%209)
**Author**: Brendan Welzien
**Version**: 1.0.0 (increment the patch/fix version number if you make more commits past your first submission)

## Site
[Heroku](https://cityexplorerapi888.herokuapp.com/)
## Overview
This app requests data from several APIs, requests specific information by searching through data, and then returns it to the user. API information includes weather, movies, restaurants, and maps. Data is also stored into a database and and is illustrated to the user reducing the amount of API requests performed - this makes the application more time-efficient and saves memory.

1. Repository setup
2. Deploy live site through Heroku
3. Trello Workflow
4. Build and sync server
5. Create and synchronize /location route
    - Construct objects by using the following information:
        - User search
        - Address
        - Latitude
        - Longitude
6. Create and synchronize /weather route
    - Construct objects by using the following information:
        - Forecast
        - Time
7. Create and synchronize /movie route
    - Construct objects by using the following information:
        - Title
        - Average Votes
        - Total Votes
        - Image URL
        - Popularity
        - Release Date
8. Create and synchronize /yelp route
    - Construct objects by using the following information:
        - Name
        - Image URL
        - Price
        - Rating
        - URL
9. Create a function to add data, remove data, and check for data inside a SQL database
10. Add a feature to alert the user if an invalid search is made
11. Add a feature to refresh stored data if it is outdated

## Architecture

1. Languages: JavaScript, HTML, CSS, SQL
2. Libraries: express, cors, dotenv, superagent, pg
3. Tools: Github, Heroku, Trello


## Time Estimate

## Feature 1 : Repository Setup
Estimate of time needed to complete: __70min___

Start time: __1:30pm___

Finish time: __2:50pm___

Actual time needed to complete: __90min___

## Feature 2 : Location setup
Estimate of time needed to complete: __50min___

Start time: __2:55pm__

Finish time: __3:25pm___

Actual time needed to complete: __30min___

## Feature 3 : Weather setup
Estimate of time needed to complete: __60min___

Start time: ___3:30pm__

Finish time: __4:00pm___

Actual time needed to complete: _30min____
## Feature 4 : Error setup
Estimate of time needed to complete: _20min____

Start time: ___4:00pm__

Finish time: ___4:15pm__

Actual time needed to complete: __15min___

<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples:

01-01-2001 4:59pm - Application now has a fully-functional express server, with a GET route for the location resource.

## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->
-->