import React from 'react';
import {data} from '../../dummy_data.js';
import axios from 'axios';
import SearchBar from './Search/SearchBar.jsx';
import SongList from './SongList.jsx';
import Song from './Song.jsx';
import CurrentSong from './NowPlaying/CurrentSong.jsx';
import io from 'socket.io-client';
import styles from './style.scss';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

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

    this.updateSongBank = this.updateSongBank.bind(this);
    this.dropDownSongs = this.dropDownSongs.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);
    this.nextSong = this.nextSong.bind(this);

    // For testing functions
    this.testing = this.testing.bind(this);
    this.socket = io.connect();
    // this.socket.on('updatePlayer', function(data) {
    //   console.log(data)
    // })

  }

  updateSongBank(input) {
    this.state.songBank.push(input)
  }

  dropDownSongs() {
    console.log('this.state.songBank', this.state.songBank)
  }

  async componentDidMount() {
    var playBackData;
    const {roomId} = this.props.match.params;

    let reactThis = this

    // Socket listener
    this.socket.on('message', function(data) {
      console.log('DATAAAA!', data)
      let access_token = data.access_token
      let albumURI = data.item.album.uri;
      let albumImageURL = data.item.album.images[0].url;
      let trackName = data.item.name;
      let albumName = data.item.album.name;
      let artistName = data.item.artists[0].name;
      let trackPosition = data.progress_ms;
      let trackDuration = data.item.duration_ms;
      let trackPlaying = data.is_playing
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
    })
    let room = roomId;
    this.socket.emit('room', room)
    // Socket listener

    await axios.get(`/spotify/rooms/${roomId}`, {
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
      console.log(err);
    });

    await axios.get('/auth/isLoggedIn')
    .then(({data}) => {
      if ( data.spotify_id == reactThis.state.spotify_id ) {
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

            // player state
            var artistName = '';
            var albumImageURL = '';
            var albumName = '';
            var albumURI = '';
            var visibleAlbumURI = '';
            var nextVectorData = null;
            var trackDuration = 180000;
            var trackURI = '';
            var trackPosition = 0;
            var trackPlaying = false;
            var trackName = '';

            playBackData = responseJson;

            playBackData.access_token = reactThis.state.access_token

            let data = responseJson;

            if (data.item) {
              albumURI = data.item.album.uri;
              albumImageURL = data.item.album.images[0].url;
              trackName = data.item.name;
              albumName = data.item.album.name;
              artistName = data.item.artists[0].name;
              trackPosition = data.progress_ms;
              trackDuration = data.item.duration_ms;
              trackPlaying = data.is_playing;
              trackURI = data.item.uri;
            }
          })
          reactThis.socket.emit(roomId, playBackData)
        }, 3000)
        // Socket emitting (only host)
      } else {
        console.log('Voter has entered!')
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  testing() {
    console.log('here!')
    axios.put('/spotify/testing');

  }

  // testing() {
  //   let jsonData = {
  //     name: 'PollPlay Playlist',
  //     public: true,
  //     description: 'Vote Away'
  //   };

  //   // Send entered data to create a playlist in Spotify
  //   axios({
  //     method: 'POST',
  //     url: `https://api.spotify.com/v1/users/1190683361/playlists`,
  //     data: jsonData,
  //     dataType: 'json',
  //     headers: {
  //       'Authorization': `Bearer BQApQWXOG9PDicEvi2axl8kHvbKcsamM44-w37J0rC-NKrWKoV24ERweMUKAFtTcyLJKsnGz4JUKXIUUOKXaVAegi5h400HlhGtuPq-sb91edAP6ZxFpJL2rFi-tileDeBVkEZSmprQnZzyNhH-w56P3kE_cIPoXEUmLQqhnN9ya0J2Eg4Qo6HNIpQ2UBysKtK-ptMRFBrfQ3rrGCU_Vmeqm2CO7k-CgDGkYGNjHHhEfTekzLw0bcyJaOdwFxS0x13hTBN-rdM8prw`,
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   .then(res => {
  //     const data = {
  //       name: res.data.name,
  //       externalUrl: res.data.external_urls.spotify,
  //       playlistId: res.data.id,
  //     }
  //     console.log(data)
  //   })

  // // fetch(`https://api.spotify.com/v1/users/1190683361/playlists`, {
  // //   headers: {
  // //     Authorization: `Bearer BQCcCGP0GHTVqAb8GHxQ49xgrBqSU57wuG9xhJR6WfHFhyFs6EPWwBBn9yTnfszHCHrkY30m2k4aPWXAJRlU4Pq3pA-acJMLb2OPipKSXlVP8SAS6aflkzgqP_BgxY_jsaeo28ajivPnN6gB5BtmkanZo6J4reaphiTW9Jmpv0L8LW6v4TNfnT6wYGwxff1eawvirBEgd8kc1IHMM8j424L8_BJGwXBBbBZGp_WTICv_RX9yFIifhCtPdoeZ3d0sYgsHXEin-ytQEQ`
  // //   },
  // //   contentType: 'application/json',
  // //   method: 'POST',
  // //   body: JSON.stringify({
  // //     "name": `PollPlay Playlist!`,
  // //     "description": `Vote Away!`
  // //   })
  // // }).then(playlist => {
  // //   console.log(playlist);
  // //   return playlist.json();
  // // }).catch(err => {
  // //   console.log(err);
  // // })
  //   // const {data} = await axios.post('/spotify/initPlaylist');
  //   // console.log(data)
  // }

  async getCurrentSong() {
    const {data: {songData}} = await axios.get('/spotify/currentSong');
    let curSong = Object.values(songData)
    this.setState({
      currentSong: curSong,
    })
  }

  async nextSong() {
    // 👇🏻 Why doesnt this work??

    // axios.post('/spotify/playNextSong')
    // .then(() => this.getCurrentSong())

    let reactThis = this;

    const response = await axios.post('/spotify/playNextSong');
    if ( response.statusText == "OK" ) {
      // Using setTimeout because async / await / .then doesn't seem to work
      setTimeout(function(){reactThis.getCurrentSong()}, 500);
    }
  }

  render() {
    const { classes } = this.props;

    let {roomId} = this.props.match.params;

    let currentSong = (window.location.href.includes(roomId)) ? <CurrentSong {...this.state} /> : "";
    return (
      <div>
        <div className='mainbody'>

          <div className={classes.roots}>
            <Grid container spacing={24}>
              <Grid item xs spacing={24}>
                <div className={classes.paper}>
                  <h1>Project 4!</h1>
                  {currentSong}
                  <button onClick={this.getCurrentSong}>Get Current Song</button>
                  <button onClick={this.nextSong}>Next Song</button>
                  <button onClick={this.testing}>TEST BUTTON!</button>
                </div>
              </Grid>


              <Grid item xs spacing={24}>
                <div className={classes.paper}>
                  <SearchBar updateSongBank={this.updateSongBank} access_token={this.state.access_token} />
                </div>
              </Grid>



              <Grid item xs spacing={24}>
                <div className={classes.paper}>
                  <SearchBar updateSongBank={this.updateSongBank} access_token={this.state.access_token} />
                </div>
              </Grid>
            </Grid>
          </div>

        </div>
      </div>
    )
  }
}

export default withStyles(styling)(Main);















