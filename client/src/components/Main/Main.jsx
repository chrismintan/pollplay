import React from 'react';
import {data} from '../../dummy_data.js';
import axios from 'axios';
import SearchBar from './Search/SearchBar.jsx';
import SongList from './SongList.jsx';
import Song from './Song.jsx';

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      songBank: [],
    };

    this.updateSongBank = this.updateSongBank.bind(this);
    this.dropDownSongs = this.dropDownSongs.bind(this);
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

  render() {
    return (
      <div>
        <h1>Project 4!</h1>
        <SongList songBank={this.state.songBank} dropDownSongs={this.dropDownSongs} />
        <SearchBar updateSongBank={this.updateSongBank} />
      </div>
    )
  }
}

export default Main;















