import React from 'react';
import {data} from '../../dummy_data.js';
import axios from 'axios';
import SearchBar from './Search/SearchBar.jsx';
import SongList from './SongList.jsx';
import Song from './Song.jsx';
import CurrentSong from './NowPlaying/CurrentSong.jsx';
import NavBar from '../NavBar.jsx';
import io from 'socket.io-client';
import styles from './style.scss';

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      currentSong: null,
      songBank: [],
      roomID: 3,
    };

    this.updateSongBank = this.updateSongBank.bind(this);
    this.dropDownSongs = this.dropDownSongs.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);

    this.nextSong = this.nextSong.bind(this);

    // For testing functions
    this.testing = this.testing.bind(this);
  }

  updateSongBank(input) {
    this.state.songBank.push(input)
  }

  dropDownSongs() {
    console.log('this.state.songBank', this.state.songBank)
  }

  componentDidMount() {
    let songBank = []
    for ( let i = 0; i < 5; i++ ) {
      let song = {
        title: data.tracks.items[i].name,
        artist: data.tracks.items[i].artists[0].name
      }
      songBank.push(song)
    }
    this.setState({
      songBank: songBank,
    })
    this.getCurrentSong();
  }

  testing() {
    let jsonData = {
      name: 'PollPlay Playlist',
      public: true,
      description: 'Vote Away'
    };

    // Send entered data to create a playlist in Spotify
    axios({
      method: 'POST',
      url: `https://api.spotify.com/v1/users/1190683361/playlists`,
      data: jsonData,
      dataType: 'json',
      headers: {
        'Authorization': `Bearer BQApQWXOG9PDicEvi2axl8kHvbKcsamM44-w37J0rC-NKrWKoV24ERweMUKAFtTcyLJKsnGz4JUKXIUUOKXaVAegi5h400HlhGtuPq-sb91edAP6ZxFpJL2rFi-tileDeBVkEZSmprQnZzyNhH-w56P3kE_cIPoXEUmLQqhnN9ya0J2Eg4Qo6HNIpQ2UBysKtK-ptMRFBrfQ3rrGCU_Vmeqm2CO7k-CgDGkYGNjHHhEfTekzLw0bcyJaOdwFxS0x13hTBN-rdM8prw`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      const data = {
        name: res.data.name,
        externalUrl: res.data.external_urls.spotify,
        playlistId: res.data.id,
      }
      console.log(data)
    })

  // fetch(`https://api.spotify.com/v1/users/1190683361/playlists`, {
  //   headers: {
  //     Authorization: `Bearer BQCcCGP0GHTVqAb8GHxQ49xgrBqSU57wuG9xhJR6WfHFhyFs6EPWwBBn9yTnfszHCHrkY30m2k4aPWXAJRlU4Pq3pA-acJMLb2OPipKSXlVP8SAS6aflkzgqP_BgxY_jsaeo28ajivPnN6gB5BtmkanZo6J4reaphiTW9Jmpv0L8LW6v4TNfnT6wYGwxff1eawvirBEgd8kc1IHMM8j424L8_BJGwXBBbBZGp_WTICv_RX9yFIifhCtPdoeZ3d0sYgsHXEin-ytQEQ`
  //   },
  //   contentType: 'application/json',
  //   method: 'POST',
  //   body: JSON.stringify({
  //     "name": `PollPlay Playlist!`,
  //     "description": `Vote Away!`
  //   })
  // }).then(playlist => {
  //   console.log(playlist);
  //   return playlist.json();
  // }).catch(err => {
  //   console.log(err);
  // })
    // const {data} = await axios.post('/spotify/initPlaylist');
    // console.log(data)
  }

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
    let currentSong = this.state.currentSong ? <CurrentSong image={this.state.currentSong[2]} title={this.state.currentSong[0]} artist={this.state.currentSong[1]} /> : "";
    return (
      <div>
        <NavBar />
        <div className='mainbody'>
          <h1>Project 4!</h1>
          <SearchBar updateSongBank={this.updateSongBank} />
          <div>
            {currentSong}
            <button onClick={this.getCurrentSong}>Get Current Song</button>
            <button onClick={this.nextSong}>Next Song</button>
            <button onClick={this.testing}>TEST BUTTON!</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Main;















