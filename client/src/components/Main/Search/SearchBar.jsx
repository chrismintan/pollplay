import React from 'react';
import DropDownSongList from './DropDownSongList.jsx';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import styling from './styling.scss';
// import IconButton from '@material-ui/core/IconButton';
// import ActionSearchIcon from '@material-ui/icons/search';

const styles = {
  appBar: {
    height: 60,
    background: 'transparent',
  },
  textField: {
    color: '#FEFEFEFF',
    borderBottom: '1px solid white',
    marginBottom: 5,
    width: '100%',
    zIndex: 200,
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
      this.handleTrackSearch(input);
    };
  }

  handleArtistInputChange(e) {
    let input = e.target.value;
    this.setState({
      artistInput: input,
    })
    if ( input.length > 3 ) {
      this.handleArtistSearch(input);
    };
  }

  handleTrackSearch(input) {

    let reactThis = this

    axios.get('/api/search', {
      params: {
        query: input,
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

  handleArtistSearch(input) {

    let reactThis = this

    axios.get('/api/searchArtist', {
      params: {
        query: input,
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
      <div className="contain">
      <div className="contain2">
        <div style={{ position: 'fixed' }}>
        <div className="top" style={{ lineHeight: '53.75px', backgroundColor: 'rgba(69,69,69)', position: 'fixed', zIndex: 100, display: 'block', width: '100%' }}></div>
          <form style={{ width: '48%', display: 'inline-block', float: 'left'}}>
            <TextField
              fullWidth
              onKeyPress={(event) => {
                if ( event.key == 'Enter' ) {
                  event.preventDefault();
                  this.handleArtistSearch(this.state.artistInput);
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
                  color: '#E6E6E5FF',
                  zIndex: 200,
                  fontWeight: 150,
                } }} />
          </form>

          <form style={{ width: '48%', display: 'inline-block', marginLeft: 5}}>
            <TextField
              fullWidth
              onKeyPress={(event) => {
                if ( event.key == 'Enter' ) {
                  event.preventDefault();
                  this.handleTrackSearch(this.state.trackInput);
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
              label='Search by Track...'
              InputLabelProps={{
                style: {
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  width: '100%',
                  color: '#E6E6E5FF',
                  zIndex: 200,
                  fontWeight: 150,
                } }}
                />
          </form>
        </div>
      <div className="scroll">
      <DropDownSongList spotifyResults={this.state.spotifyResults} addSong={this.props.addSong} songBank={this.props.songBank} />
      </div>
    </div>
    </div>
    )
  }
}

export default withStyles(styles)(SearchBar);