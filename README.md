# About
Project comes in 3 parts:
- a REST API,
- a backoffice,
- a frontend,

The API denies access to resources, but to the backoffice via a middleware.
On API url where it expects formated data (PUT, PATCH), a GET request has to be made to know which data and type it wants.
The backoffice makes an abusive use of this to auto-generate dynamic page-components.
The front-end is just a form where the user can fill in his time and budget constraints.

Path-finding is made as follow:
Each line of bus is a set of cities, ie a N-sized ensemble.
From this, we extract the part that the user is interested in, the one which goes from his departure to his arrival.
Based on the user's constraints, we define the number of steps available to him, budget allows to skip cities, time allows to stop in them.
In this reduced set, departure and arrivals are then removed to generate every possible k-combination (with k based on the constraints), then they're put back.

# Configuration

Project comes with default settings, if you want/have to change some, here's how can do so:

- In file api/config.js 
```
const database = {
	name: 'autocar',
	port: 27042, // The port mongod service is running on
};

const api = {
	url: 'localhost',
	port: 8000, // The port you will use to connect to the API
};

const backoffice = {
	host: 'localhost',
	port: 3000,
};
```
The database object defines how the API will connect to the mongo service, the api object defines how third-parties will connect to it, the backoffice object tells who is allowed to modify resources.

- In file backoffice/src/config.js you need to put the same api options than previously
- In file frontend/src/config.js you need to put the same api options than previously
- In file backoffice/package.json you need to force the port (default 3000)

```
"scripts": {
    "start": "PORT=3000 react-scripts start", // change the port here
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
```
# Installation

Dependencies are handled by webpack, hence installtion is easy

```
cd api/
npm install
```
```
cd backoffice/
npm install
```
```
cd frontend/
npm install
```

# Running
First, you'll need to run the mongo service with the port you put in api/config.js (default 27042)
```
mongod --port 27042
```
Then you can start the API server
```
cd api/
npm start
```
Then the backoffice
```
cd backoffice/
npm start
```
Then the client
```
cd frontend/
npm start
```

# Usage
Now, creates some cities from the back-office.
Create a few lines too, be careful to add cities in the appropriate order.
You should be able to find your best options from the front-end.
