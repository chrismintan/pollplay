import React from 'react';
import {data} from '../../dummy_data.js';
import axios from 'axios';
import SearchBar from './Search/SearchBar.jsx';
import SongList from './SongList.jsx';
import CurrentSong from './NowPlaying/CurrentSong.jsx';
import io from 'socket.io-client';
import styles from './style.scss';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';

const styling = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
  },
});

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      host: false,
      songBank: [],
      roomID: null,
      access_token: null,
      spotify_id: null,
      artistName: '',
      albumImageURL: '',
      albumName: '',
      albumURI: '',
      visibleAlbumURI: '',
      nextVectorData: null,
      trackDuration: 180000,
      trackURI: '',
      trackPosition: 0,
      trackPlaying: false,
      trackName: '',
    };

    this.addSong = this.addSong.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.saveSong = this.saveSong.bind(this);
    this.socket = io.connect();
    this.updateSongBank = this.updateSongBank.bind(this);
    this.upVoteSong = this.upVoteSong.bind(this);


    // For testing functions
    this.testing = this.testing.bind(this);
  }

  // Setting up player update function (for host)
  async componentWillMount() {

    // Giving a 'unique' cookie to each user
    function cookie(length) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    const cookies = new Cookies();

    if ( typeof cookies.get('state') === 'undefined' ) {
      let state = cookie(10)
      cookies.set('state', state, { path: '/' })
    }

    var playBackData;

    const {roomId} = this.props.match.params;
    let reactThis = this;

        // Get all songs in songBank
    await axios.get('/api/getAllSongs', {
      params: {
        roomId: roomId,
      }
    })
    .then(({data}) => {
      console.log(data)
      let songBank = [];

      for ( let i = 0; i < data.length; i++ ) {
        let obj = { trackName: data[i].track,
                    artistName: data[i].artist,
                    albumImageURL: data[i].album_image,
                    trackURI: data[i].track_uri }

        songBank = songBank.concat(obj)
      }
      this.setState({
        songBank: songBank,
      })
    })
    .catch(err => {
      console.log(err)
    })

    await axios.get(`/api/rooms/${roomId}`, {
      params: {
        query: roomId
      }
    })
    .then(({data}) => {
      this.setState({
        spotify_id: data[0].spotify_id,
        roomID: data[0].name,
        access_token: data[0].access_token,
      })
    })
    .catch(err => {
      console.error();
    });

    await axios.get('/auth/isLoggedIn')
    .then(({data}) => {
      if ( data.spotify_id == reactThis.state.spotify_id ) {
        // Setting state for host to be true
        this.setState({
          host: true,
        })

        console.log('Host is in the building!')
        // Socket emitting (only host)
        let reactThis = this;
        setInterval(function() {
          var url = `https://api.spotify.com/v1/me/player`
          fetch(url, {
            method: `GET`,
            headers: {
              Authorization: `Bearer ${reactThis.state.access_token}`
            }
          })
          .then((response) => response.json())
          .then((responseJson) => {

            playBackData = responseJson;

            playBackData.access_token = reactThis.state.access_token;

            playBackData.updateStatus = true;

          })
          reactThis.socket.emit(roomId, playBackData)
        }, 3000)
        // Socket emitting (only host)
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  async componentDidMount() {
    const {roomId} = this.props.match.params;

    let reactThis = this

    // Socket listener
    this.socket.emit('room', roomId)
    this.socket.on('message', function(data) {
      // console.log('SOCKET DATA!:', data)
      if ( data.updateStatus == true ) {
        let access_token = data.access_token;
        let albumURI = data.item.album.uri;
        let albumImageURL = data.item.album.images[0].url;
        let trackName = data.item.name;
        let albumName = data.item.album.name;
        let artistName = data.item.artists[0].name;
        let trackPosition = data.progress_ms;
        let trackDuration = data.item.duration_ms;
        let trackPlaying = data.is_playing;
        reactThis.setState({
          access_token: access_token,
          albumURI: data.item.album.uri,
          albumImageURL: data.item.album.images[0].url,
          trackName: data.item.name,
          albumName: data.item.album.name,
          artistName: data.item.artists[0].name,
          trackPosition: data.progress_ms,
          trackDuration: data.item.duration_ms,
          trackPlaying: data.is_playing,
        })
      } else if ( data.addSong == true ) {
        console.log(data);
        let newArray = reactThis.state.songBank.concat(data);
        reactThis.setState({
          songBank: newArray,
        })
        if ( reactThis.state.host == true ) {
          reactThis.saveSong(data);
        }
      } else if ( data.upVote == true ) {
        reactThis.upVoteSong(data);
      }
    })
    // Socket listener
  }

  // Not binded to anything at the moment
  updateSongBank(input) {
    this.state.songBank.push(input)
  }

  upVoteSong(songData) {
    console.log('Upvoted!', songData)
  }

  // Main -> SearchBar -> DropDownList -> SearchResult (User adds song to polling pool)
  addSong(songData) {
    const {roomId} = this.props.match.params;
    // Emiting song added to everyone in room
    this.socket.emit(roomId, songData)
  }

  async getCurrentSong() {
    const {data: {songData}} = await axios.get('/spotify/currentSong');
    let curSong = Object.values(songData)
    this.setState({
      currentSong: curSong,
    })
  }

  async nextSong() {
    let reactThis = this;

    const response = await axios.post('/spotify/playNextSong');
    if ( response.statusText == "OK" ) {
      // Using setTimeout because async / await / .then doesn't seem to work
      setTimeout(function(){reactThis.getCurrentSong()}, 500);
    }
  }

  saveSong(songData) {
    let songObj = songData
    songObj.roomID = this.state.roomID
    axios.post('/api/saveSong', songObj)
    .then(() => {
      console.log('Song Added!');
    })
    .catch(function(error) {
      console.log('POST failed', error)
    });
  }

  testing() {

  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className='mainbody'>
          <div className={classes.roots}>
            <Grid container spacing={24}>

              <Grid item xs spacing={24}>
                <div className={classes.paper}>
                  <h1>Project 4!</h1>
                  <CurrentSong {...this.state} />
                  <button onClick={this.getCurrentSong}>Get Current Song</button>
                  <button onClick={this.nextSong}>Next Song</button>
                  <button onClick={this.testing}>TEST BUTTON!</button>
                </div>
              </Grid>


              <Grid item xs spacing={24}>
                <div className={classes.paper}>
                  <SongList songBank={this.state.songBank} upVoteSong={this.upVoteSong} />
                </div>
              </Grid>


              <Grid item xs spacing={24}>
                <div className={classes.paper}>
                  <SearchBar addSong={this.addSong} songBank={this.state.songBank} access_token={this.state.access_token} />
                </div>
              </Grid>

            </Grid>
          </div>
        </div><button onClick={this.testing}>TEST!</button>
      </div>
    )
  }
}

export default withStyles(styling)(Main);















