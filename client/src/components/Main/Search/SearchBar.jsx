import React from 'react';
import DropDownSongList from './DropDownSongList.jsx';
import {data} from '../../../dummy_data.js';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { createMuiTheme } from '@material-ui/core/styles';
// import IconButton from '@material-ui/core/IconButton';
// import ActionSearchIcon from '@material-ui/icons/search';

const styles = {
  textField: {
    color: '#FEFEFEFF',
    borderBottom: '1px solid white',
    marginBottom: 5,
    width: '100%',
  },

  'input-label': {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: '100%',
    color: 'red',
  },

  hidden: {
    display: 'none',
  },

  'input': {
    '&::placeholder': {
      textOverflow: 'ellipsis !important',
      color: 'blue',
      backgroundColor: 'white',
    }
  }
};

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trackInput: '',
      artistInput: '',
      spotifyResults: [],
    };

    this.handleArtistInputChange = this.handleArtistInputChange.bind(this);
    this.handleTrackInputChange = this.handleTrackInputChange.bind(this);
    this.handleTrackSearch = this.handleTrackSearch.bind(this);
    this.handleArtistSearch = this.handleArtistSearch.bind(this);
  }

  handleTrackInputChange(e) {
    let input = e.target.value;
    this.setState({
      trackInput: input,
    })
    if ( input.length > 3 ) {
      this.handleTrackSearch();
    };
  }

  handleArtistInputChange(e) {
    let input = e.target.value;
    this.setState({
      artistInput: input,
    })
    if ( input.length > 3 ) {
      this.handleArtistSearch();
    };
  }

  handleTrackSearch(event) {

    let reactThis = this

    axios.get('/api/search', {
      params: {
        query: reactThis.state.trackInput,
        token: reactThis.props.access_token
      }
    })
    .then(({data: {items}}) => {

      if ( items.length != 0 ) {
        reactThis.setState({
          spotifyResults: items,
        });
      }

      }).catch(function(error){
        console.log(error)
    })
  }

  handleArtistSearch(event) {

    let reactThis = this

    axios.get('/api/searchArtist', {
      params: {
        query: reactThis.state.artistInput,
        token: reactThis.props.access_token
      }
    })
    .then(({data: {items}}) => {

      if ( items.length != 0 ) {
        reactThis.setState({
          spotifyResults: items,
        });
      }

      }).catch(function(error){
        console.log(error)
    })
    // this.props.updateSongBank(this.state.input)
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <form style={{ width: '45%', display: 'inline-block', marginRight: 5}}>
          <TextField
            fullWidth
            onKeyPress={(event) => {
              if ( event.key == 'Enter' ) {
                event.preventDefault();
                this.handleArtistSearch();
              }
            }}
            style={{ width: '100%', display: 'inline-block'}}
            value={this.state.artistInput}
            onChange={this.handleArtistInputChange}
            InputProps={{
              disableUnderline: true,
              classes: {
                input: classes.textField,
              },
            }}
            label='Search by Artist...'
            InputLabelProps={{
              style: {
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: '100%',
                color: '#E6E6E5FF'
              } }} />
        </form>

        <form style={{ width: '45%', display: 'inline-block', marginLeft: 5}}>
          <TextField
            fullWidth
            onKeyPress={(event) => {
              if ( event.key == 'Enter' ) {
                event.preventDefault();
                this.handleTrackSearch();
              }
            }}
            value={this.state.trackInput}
            onChange={this.handleTrackInputChange}
            InputProps={{
              disableUnderline: true,
              classes: {
                input: classes.textField,
              },
            }}
            style={{ width: '100%', display: 'inline-block'}}
            label='Search by Track Name...'
            InputLabelProps={{
              style: {
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: '100%',
                color: '#E6E6E5FF'
              } }}
              />
        </form>
        <DropDownSongList spotifyResults={this.state.spotifyResults} addSong={this.props.addSong} songBank={this.props.songBank} />
      </div>
    )
  }
}

export default withStyles(styles)(SearchBar);