import React from 'react';
import DropDownSongList from './DropDownSongList.jsx';
import {data} from '../../../dummy_data.js';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { createMuiTheme } from '@material-ui/core/styles';
import styling from './styling.scss';

const styles = {
  textField: {
    color: '#FEFEFEFF',
    borderBottom: '1px solid white',
    marginBottom: 5,
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
      input: '',
      spotifyResults: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.selectSong = this.selectSong.bind(this);
  }

  handleInputChange(e) {
    console.log('input change')
    console.log(this.props)
    let input = e.target.value;
    this.setState({
      input: input,
    })
    if ( input.length > 3 ) {
      this.handleClick();
    };

    if ( input.length < 2 ) {
      this.setState({
        spotifyResults: [],
      })
    }
  }

  handleClick(event) {

    console.log('123')

    let reactThis = this

    console.log(this.props.access_token)

    axios.get('/api/search', {
      params: {
        query: reactThis.state.input,
        token: reactThis.props.access_token
      }
    })
    .then(({data: {items}}) => {

      console.log('DATA:', data)
      console.log('items', items)

      // Artist = items[0].artists[0].name
      // Track = items[0].name
      // Album = items[0].album.name
      // Album Image = items[0].album.images[2].url

      reactThis.setState({
        spotifyResults: items,
      });
      }).catch(function(error){
        console.log(error)
    })
    this.props.updateSongBank(this.state.input)
  }

  selectSong() {
    // Function to 'POST' song to databse
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <form>
        <TextField
          onKeyPress={(event) => {
            if ( event.key == 'Enter' ) {
              event.preventDefault();
            }
          }}
          value={this.state.input}
          onChange={this.handleInputChange}
          InputProps={{
            disableUnderline: true,
            classes: {
              input: classes.textField,
            },
          }}
          label='Type to search...'
          InputLabelProps={{
            style: {
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              width: '100%',
              color: '#E6E6E5FF'
            } }} />
        </form>
        <DropDownSongList spotifyResults={this.state.spotifyResults} selectSong={this.selectSong} />
      </div>
    )
  }
}

export default withStyles(styles)(SearchBar);