import React from 'react';
import {data} from '../../dummy_data.js';
import axios from 'axios';
import SearchBar from './Search/SearchBar.jsx';
import SongList from './SongList.jsx';
import Song from './Song.jsx';
import CurrentSong from './CurrentSong.jsx';

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      currentSong: [1,2,3],
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
  }

  testing() {
    axios.get('/testing', {
      params: {
        roomID: 3,
      }
    })
    .then(({data}) => {
      console.log('GOT DATA', data)
      this.setState({
        songBank: data
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  async getCurrentSong() {
    const {data: {songData}} = await axios.get('/spotify/currentSong');
    console.log('SONGDATA: ', songData)
    let curSong = Object.values(songData)
    console.log('here',curSong)
    this.setState({
      currentSong: curSong,
    })
  }

  async nextSong() {
    // Why doesnt this work??

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
    return (
      <div>
        <h1>Project 4!</h1>
        <SongList songBank={this.state.songBank} dropDownSongs={this.dropDownSongs} />
        <SearchBar updateSongBank={this.updateSongBank} />
        <button onClick={this.testing}>TEST BUTTON!</button>
        <a href='/auth/login'>Log in</a>
        <div>
          <CurrentSong image={this.state.currentSong[2]} title={this.state.currentSong[0]} artist={this.state.currentSong[1]} />
          <button onClick={this.getCurrentSong}>Get Current Song</button>
          <button onClick={this.nextSong}>Next Song</button>
        </div>
      </div>
    )
  }
}

export default Main;















