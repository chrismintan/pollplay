# PollPlay
[**PollPlay**](https://github.com/chrismintan/pollplay) is a Spotify-based song voting app. Users with Spotify-Premium accounts can create and host rooms. Rooms are accesible through the room code they choose. Upon entering a room, users can add songs and upvote existing songs. Songs will then be played through the host's Spotify account.

### Demo
You can see how the app works below:

![Demo Gif](https://github.com/chrismintan/pollplay/blob/master/public/project4-demo.gif)

[Link to App](https://pollplay.herokuapp.com/)

For more information about how I made the app, read on!

## Setting up
The app is already hosted by me on Heroku. However, if you would like to run it locally / edit and deploy it yourself, please see below for the necessary steps!
### Prerequisites
PollPlay requires [Node.js](https://nodejs.org/) v4+ to run.

### Installation
First, install the dependencies and dev-dependencies and start the server.
```
$ cd pollplay
$ npm install
```
Create your own database by running
```
$ psql -f tables.sql
```
Start the server in its own terminal
```
$ npm run server-dev
```
In a separate terminal run the client
```
$ npm run react-dev
```
### Spotify Setup
* Create a [Spotify Developer Account](https://developer.spotify.com/dashboard/login)
* Create a new app
* Add your SPOTIFY\_CLIENT\_ID and SPOTIFY\_CLIENT\_SECRET to your .env file and deployment environment
* Navigate to 'Edit Settings' in your developer account to whitelist your redirect uri

### Tech
PollPlay utilises a number of open source projects to work properly:
* [React.js](https://reactjs.org/) - Facebook's front-end framework
* [React Router](https://reacttraining.com/react-router/) - Declarative routing for React
* [Material-Ui](https://material-ui.com/) - React components that implement Google's Material Design
* [node.js](https://nodejs.org/en/) - evented I/O for the backend
* [Express](https://expressjs.com/) - node.js framework
* [Passport](http://www.passportjs.org/docs/oauth/) - Handling for Spotify authorization (OAuth)
* [Socket.Io](https://socket.io/) - Handle real-time voting and song addition using sockets and the chatroom
* [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - To render the music visualiser

## Author(s)
- Christopher Tan

This is a completely open source project! Feel free to submit pull requests or leave comments if you would like to give any feedback or encounter any bugs.

## Acknowledgements
This project is purely educational and expirimental. It would not have been possible without the following sources:

* [Spotify](https://www.spotify.com/) for their fantastic API framework for developers to make use of.

## License
ISC