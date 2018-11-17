import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Cookies from 'universal-cookie';

const styles = {
  card: {
    display: 'flex',
    height: 'auto',
    alignItems: 'center',
    border: '1px solid transparent',
    borderRadius: 0,
    background: '#383838',
    '&:hover': {
      background: 'black',
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

class Songs extends React.Component {
  constructor() {
    super();
    this.state = {
      upVoted: false,
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    console.log('Songs - upVote()')
    let songData = {
        trackName: this.props.title,
        artistName: this.props.artist,
        albumImageURL: this.props.image,
        trackURI: this.props.trackURI,
        upVote: true,
      }
    this.props.upVoteSong(songData)
    axios.get('/api/upVoteSong')
    console.log('HERE')
    const cookies = new Cookies();
    console.log(cookies.get('state'))
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

export default withStyles(styles, { withTheme: true })(Songs);