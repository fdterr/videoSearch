# MLB Video Search

This is a simple tool I have put together to provide search functionality for MLB's game highlights.

The frontend is built on React, and the backend uses Express

## Setup

You just have to clone this repository and once inside run `npm i`

You will need postgres installed and a fresh database in order to start the server

Once you are able to run `npm run build-client` and `npm run start` _or_ just `npm run start-dev`, you are ready to create the player list

Navigate to `localhost:8080/api/createList`
if everything is working, you should get back a json of a list of MLB players, you should now be able to navigate to `localhost:8080`
