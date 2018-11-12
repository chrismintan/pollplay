import React, { Component } from 'react';
import {data} from '../dummy_data.js';
import SearchBar from './SearchBar.jsx';
import Song from './Song.jsx'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'Login',
      songBank: []
    };
    this.updateSongBank = this.updateSongBank.bind(this);
  }

  updateSongBank (songBank) {
    this.setState({
      songBank: songBank
    })
  }

  componentDidMount () {
    let songBank = []
    for (let i = 0; i < 5; i++) {
      console.log(data.tracks.items[i].name, '----',data.tracks.items[i].artists[0].name)
      let song = {
        title: data.tracks.items[i].name,
        artist: data.tracks.items[i].artists[0].name
      }
      songBank.push(song)
    }
    this.setState({
      songBank:songBank
    })
    
  } 

  render() {
    let component;
    if(this.state.currentPage === 'Login') {
      component = <Login />
    } else if (this.state.currentPage === 'CreateRoom') {
      component = <CreateRoom />
    } else if (this.state.currentPage === 'Main') {
      component = <Main />
    }
    // console.log(data.tracks.items);
    return (
      <div>
        <h1>Howdy, World!</h1>
        {/* {component} */}
        {this.state.songBank.map( (song,index)=> <Song title={song.title} artist={song.artist} key={index}  / >)}
        <SearchBar updateSongBank={this.updateSongBank}/>
      </div>
    )
  }
}

export default App;