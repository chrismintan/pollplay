import React from 'react';
import DropDownSongList from './DropDownSongList.jsx';
import {data} from '../../../dummy_data.js';
import axios from 'axios';

class SearchBar extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      spotifyResults: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.selectSong = this.selectSong.bind(this);
  }

  handleInputChange(e) {
    let input = e.target.value;
    this.setState({
      input: input,
    })
  }

  handleClick(e) {
    e.preventDefault();
    this.props.updateSongBank(this.state.input)
    console.log('Clicked!')

    let spotifyResults = []
    for ( let i = 0; i < 5; i++ ) {
      let song = {
        title: data.tracks.items[i].name,
        artist: data.tracks.items[i].artists[0].name,
      }
      spotifyResults.push(song);
    }
    this.setState({
      spotifyResults: spotifyResults,
    })
  }

  selectSong() {
    // Function to 'POST' song to databse
  }

  render() {
    return (
      <div>
        <form action="GET">
          <input type="text" value={this.state.input} onChange={this.handleInputChange} />
          <button onClick={this.handleClick}>Submit!</button>

          <DropDownSongList spotifyResults={this.state.spotifyResults} selectSong={this.selectSong} />
        </form>
      </div>
    )
  }
}

export default SearchBar;