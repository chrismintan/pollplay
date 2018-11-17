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
      nextSong: "spotify:track:746bHsY27aWTMYpoxqECOm",
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
      voteHandler: []
    };

    this.socket = io.connect();

    // Adding songs to polling pool
    this.addSong = this.addSong.bind(this);
    this.saveSong = this.saveSong.bind(this);

    // Voting functions
    this.upVoteSong = this.upVoteSong.bind(this);
    this.updateVotes = this.updateVotes.bind(this);

    // Remove song from room
    this.removeSong = this.removeSong.bind(this);

    // Updating state from data received from socket
    this.updateSongBank = this.updateSongBank.bind(this);
    this.updateStatus = this.updateStatus.bind(this);

    this.nextSong = this.nextSong.bind(this);

    // For testing functions
    this.testing = this.testing.bind(this);
  }

  // Setting up player update function (for host)
  async componentWillMount() {

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
      let songBank = [];

      for ( let i = 0; i < data.length; i++ ) {
        let obj = { trackName: data[i].track,
                    artistName: data[i].artist,
                    albumImageURL: data[i].album_image,
                    trackURI: data[i].track_uri,
                    likes: data[i].upvote }

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
          axios.get('/spotify/currentSong')
          .then(({data}) => {
            playBackData = data;
            playBackData.access_token = reactThis.state.access_token;
            playBackData.updateStatus = true;
          })
          .catch(error => {
            console.log(error)
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
        reactThis.updateStatus(data)
      } else if ( data.addSong == true ) {
        let newArray = reactThis.state.songBank.concat(data);
        reactThis.setState({
          songBank: newArray,
        })
        if ( reactThis.state.host == true ) {
          reactThis.saveSong(data);
        }
      } else if ( data.upVote == true ) {
          console.log('shouldcomehere', data.trackURI)
          reactThis.updateSongBank(data.trackURI);
        if ( reactThis.state.host == true ) {
          reactThis.updateVotes(data);
        }
      }
    })
    // Socket listener
  }

  updateStatus(data) {
    console.log(data)
    let reactThis = this;
    this.setState({
      access_token: data.access_token,
      albumURI: data.item.album.uri,
      albumImageURL: data.item.album.images[0].url,
      trackName: data.item.name,
      albumName: data.item.album.name,
      artistName: data.item.artists[0].name,
      trackPosition: data.progress_ms,
      trackDuration: data.item.duration_ms,
      trackPlaying: data.is_playing,
      trackURI: data.item.uri,
    })
    // if ( data.is_playing == false && this.state.songBank.length > 0 ) {
    //   this.nextSong(this.state.songBank[0].trackURI);
    // };
    if ( data.item.duration_ms - data.progress_ms <= 3000 ) {
      let timeLeft =  data.item.duration_ms - data.progress_ms;
      reactThis.nextSong(reactThis.state.songBank[0].trackURI)
    }
  }

  // Main -> SearchBar -> DropDownList -> SearchResult (User adds song to polling pool)
  addSong(songData) {
    const {roomId} = this.props.match.params;
    // Emiting song added to everyone in room
    this.socket.emit(roomId, songData)
  }

  // After emitting songData to socket, update DB
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

  // Update songBank after receiving a vote
  updateSongBank(trackURI) {
    let songBank = this.state.songBank;
    for ( var i in songBank ) {
      if ( songBank[i].trackURI == trackURI ) {
        songBank[i].likes = parseInt(songBank[i].likes) + 1;
      }
    }

    // Sort songs from most likes to least
    function compare(a, b) {
      if ( parseInt(a.likes) > parseInt(b.likes) )
        return -1;
      if ( parseInt(a.likes) < parseInt(b.likes) )
        return 1;
      return 0;
    }

    // Sorting songBank by most likes
    songBank.sort(compare);

    // For some reason setting the state with only 1 change in variable doesnt re render the child component
    this.setState({
      songBank: [],
    })
    this.setState({
      songBank: songBank,
    })
  }

  upVoteSong(songData) {
    const {roomId} = this.props.match.params;
    songData.roomID = this.state.roomID;
    console.log('upVoteSong()', songData)
    this.socket.emit(roomId, songData);
  }

  updateVotes(songData) {
    if ( this.state.host == true ) {
      console.log('updateVotes()', songData);
      axios.put('/api/upVoteSong', songData)
      .then((data) => {
        console.log('Vote success!', data);
      })
      .catch(function(error) {
        console.log('Vote failed', error);
      })
    }
  }

  async getCurrentSong() {
    const {data: {songData}} = await axios.get('/spotify/currentSong');
    let curSong = Object.values(songData)
    this.setState({
      currentSong: curSong,
    })
  }

  async nextSong(song) {
    // Removing song from the queue + db
    let newSongBank = this.state.songBank.slice(1);
    let reactThis = this;
    let roomID = this.state.roomID;
    let trackURI = this.state.songBank[0].trackURI;
    this.setState({
      songBank: [],
    })
    this.setState({
      songBank: newSongBank,
    })
    let nextTrackURI = song
    if ( this.state.host == true ) {
      await axios.put('/spotify/playNext', {nextTrackURI})
      .then(({data}) => {
        console.log('Next song!')
        reactThis.removeSong(roomID, trackURI);
      })
      .catch(function(error) {
        console.log('Play next failed', error);
      })
    }
  }

  removeSong(roomID, song) {
    axios.delete('/api/removeSong', {
      params: {
        roomID: roomID,
        trackURI: song,
      }
    })
    .then(({data}) => {
      console.log('Removed successfully!')
    })
    .catch(function(error) {
      console.log('Removal failed.', error)
    })
  }

  testing() {
    this.setState({
      songBank: [],
    })
    console.log(this.state.songBank)
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className='mainbody'>
          <div className={classes.roots}>
            <Grid container spacing={24}>

              <Grid item xs={6} spacing={24}>
                <div className={classes.paper}>
                  <h1>Project 4!</h1>
                  <CurrentSong {...this.state} />
                  <button onClick={this.nextSong}>TEST BUTTON!</button>
                </div>
              </Grid>


              <Grid item xs={3} spacing={24}>
                <div className={classes.paper}>
                  <SongList songBank={this.state.songBank} upVoteSong={this.upVoteSong} />
                </div>
              </Grid>


              <Grid item xs={3} spacing={24}>
                <div className={classes.paper}>
                  <SearchBar addSong={this.addSong} songBank={this.state.songBank} access_token={this.state.access_token} />
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















