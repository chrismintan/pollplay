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

For more information on how I made the app read on!
## Application and Development Process
### Spotify OAuth 2.0
![OAuth](https://github.com/chrismintan/pollplay/blob/master/public/oauth1.png)

Have you visited a site recently, where you are given the option of connecting or signing up using Google, Facebook or Twitter? Sure you have! This is basically what OAuth is all about; granting third-party services permission to do something for you-like you logging in.

OAuth is a framework that gives users the ability to grant access to their information stored in one place, from another place. The idea is that a user is giving Spotify certain permission to access their Facebook details, so that Fadcebook can provide Spotify with enough inbformation to sign them in, enhance their profile details, or display what their friends are listening to.

![OAuth](https://github.com/chrismintan/pollplay/blob/master/public/oauth2.png)

Why is this important? It is because without an API for exchanging this information, a user would have to give a third party site their Facebook username and password thereby **giving them too much power**. This is where OAuth comes in. I have included it in this project as using Facebook to authenticate the Spotify login is immensely more convenient.

### OAuth Problems
##### Access Tokens
When a user logs in my app via OAuth, Spotify returns us an access token which represents their authorisation to access the user's information (such as playback information). These access tokens have an expiry time so as to limit damage due to malicious use of the token.
##### Refresh Tokens
Refresh tokens are a special type of token that can be help securely with the express purpose of being able to request a new access token once the original access token has expired. These also expire but are generally long lived expiry times as long as they are refreshed in an adequate time frame.
### Spotify's OAuth
Spotify's access tokens last 1hr. Meaning every hour PollPlay would have to either request that the user login again or use the refresh token to attain a new token. Therefore, everytime an API call to Spotify is being made, the access token has to be checked and a request for another token has to be made with the given refresh token.

## Spotify API
### API Rate Limit
For the rendering of the playback meter, API calls have to be made every few seconds to determine the current playback data (such as song title, song playback duration etc). Initially the plan was to have the access token stored in the database and have the users in the room make calls to Spotify's API every 3 seconds to determine the playback data. This evidently became problematic with more users as an API call was being made every 3 seconds per user in the room.

This was initially solved by storing the playback data in the database and having users in the room make AJAX calls to the database every 3 seconds. This however did not work out as well as under heavy load, Heroku's free account did not let that much Postgres queries to go through.
### Enter Sockets!
To counter this problem, [Socket.Io](https://socket.io/) was used instead. The idea was that only one user in the room makes the API requests to Spotify every 3 seconds. The host makes the API requests and sends the playback info via sockets to everyone in the room. This is done via the following code:
```
// Server side
const io = require('socket.io')(server);

io.sockets.on('connection', (socket) => {

  socket.on('room', (room, data) => {
    socket.join(room);

    socket.on(room, function(data) {
      io.in(room).emit('message', data)
    })
  })
})

// Client side
const {roomId} = this.props.match.params;
this.socket.emit('room', roomId)
this.socket.on('message', function(data) {
  // Insert emitting code here
})
```
As seen above, when a user enters the room, he emits to the socket server the roomId and on the server side, it joins the room for the user. This segregates different rooms so that what happens in one hosted room does not affect the other.

## Author(s)
- Christopher Tan

This is a completely open source project! Feel free to submit pull requests or leave comments if you would like to give any feedback or encounter any bugs.

## Acknowledgements
This project is purely educational and expirimental. It would not have been possible without the following sources:

* [Spotify](https://www.spotify.com/) for their fantastic API framework for developers to make use of.

## License
ISC