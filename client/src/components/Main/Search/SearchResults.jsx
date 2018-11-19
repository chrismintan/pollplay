import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    display: 'flex',
    height: 'auto',
    alignItems: 'center',
    border: '1px solid transparent',
    borderRadius: 0,
    background: 'transparent',
    '&:hover': {
      background: 'rgb(33, 33, 33)',
      cursor: 'pointer',
    },
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  artist: {
    fontSize: 12,
    color: '#FEFEFEFF',
  },
  title: {
    fontSize: 17,
    color: 'white',
  }
};

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    let reactThis = this
    // Disabling multiple instances of song in the song queue
    if ( reactThis.props.songBank.some(e => e.trackURI === reactThis.props.trackURI ) == true ) {
      this.setState({
        disabled: true,
      })
    } else {
      // Sending song data from SearchResults -> DropDownList -> SearchBar -> Main
      let songData = {
        trackName: reactThis.props.title,
        artistName: reactThis.props.artist,
        albumImageURL: reactThis.props.image,
        trackURI: reactThis.props.trackURI,
        addSong: true,
        likes: 0,
      }
      reactThis.props.addSong(songData);
      // Host will then add song to SongList
      reactThis.setState({
        disabled: true,
      })
    }
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <div onClick={this.handleClick}>

        <Card className={classes.card}>
          <CardMedia  className={classes.cover}
                      image={this.props.image}
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography className={classes.title}>
                {this.props.title}
              </Typography>
              <Typography className={classes.artist}>
                {this.props.artist}
              </Typography>
            </CardContent>
          </div>
        </Card>

      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SearchResults);