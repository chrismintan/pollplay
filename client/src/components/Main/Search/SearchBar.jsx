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

    axios.get('/spotify/search', {
      params: {
        query: this.state.input
      }
    })
    .then(({data: {items}}) => {
      console.log('ITEMS:   ', items)

      // Artist = items[0].artists[0].name
      // Track = items[0].name
      // Album = items[0].album.name
      // Album Image = items[0].album.images[2].url

      this.setState({
        spotifyResults: items,
      });
      }).catch(function(error){
        console.log(error)
    })
  }

  selectSong() {
    // Function to 'POST' song to databse
  }

  render() {
    return (
      <div>
        <form>
          <input type="text" value={this.state.input} onChange={this.handleInputChange} />
          <button onClick={this.handleClick}>Search!</button>
        </form>
        <DropDownSongList spotifyResults={this.state.spotifyResults} selectSong={this.selectSong} />
      </div>
    )
  }
}

export default SearchBar;