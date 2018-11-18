import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import styles from './style.scss'
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Grid from '@material-ui/core/Grid';

const styling = theme => ({
  card1: {
    display: 'flex',
    height: 'auto',
    alignItems: 'center',
    border: '1px solid transparent',
    borderRadius: 0,
    background: 'transparent',
    '&:hover': {
      background: 'rgb(33, 33, 33)',
    },
  },
  card2: {
    display: 'flex',
    height: 'auto',
    alignItems: 'center',
    border: '1px solid transparent',
    borderRadius: 0,
    background: '#535353',
    '&:hover': {
      background: '#212121',
    },
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
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
  },
  vote: {
    color: '#FE4365',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  noVote: {
    color: '#FE4365',
  },
  centered: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 20,
    color: 'rgb(87, 181, 96)',
  },
});

class Songs extends React.Component {
  constructor() {
    super();
    this.state = {
      upVoted: false,
      likes: '',
    }
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.setState({
      likes: this.props.likes,
    })
  }

  componentDidMount() {
    this.persistentState()
  }

  handleClick(e) {
    let persist = this.props.trackURI
    localStorage.setItem(persist, JSON.stringify(true))
    let likes = parseInt(this.state.likes) + 1
    this.setState({
      upVoted: true,
      likes: likes,
    })
    let songData = {
        trackName: this.props.title,
        artistName: this.props.artist,
        albumImageURL: this.props.image,
        trackURI: this.props.trackURI,
        upVote: true,
        likes: this.state.likes,
      }
    this.props.upVoteSong(songData)
  }

  persistentState() {
    let persist = this.props.trackURI
    for ( let upVoted in this.state ) {
      if ( localStorage.hasOwnProperty(persist) ) {
        let value = localStorage.getItem(persist);
        try {
          value = JSON.parse(value);
          this.setState({
            upVoted: value,
          });
        } catch(e) {
          console.log('catch(e)')
          this.setState({
            upVoted: value,
          })
        }
      }
    }
  }

  render() {
    const { classes } = this.props;

    let song;

    if ( this.state.upVoted == false ) {
      song =  <div>
                <Card className={classes.card1}>
                  <Grid container
                        spacing={24}
                        direction="row"
                        alignItems="center"
                        justify="center"
                  >
                    <Grid item xs={2}>
                      <CardMedia  className={classes.cover}
                                  image={this.props.image}
                      />
                    </Grid>
                    <Grid item xs={8}>
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
                    </Grid>
                    <Grid item xs={2}>
                      <div className={classes.centered} >{this.state.likes}&nbsp;<FavoriteBorder onClick={this.handleClick} className={classes.vote} /></div>
                    </Grid>
                  </Grid>
                </Card>
              </div>

    } else if ( this.state.upVoted == true ) {
      song =  <div>
                <Card className={classes.card1}>
                  <Grid container
                        spacing={24}
                        direction="row"
                        alignItems="center"
                        justify="center"
                  >
                    <Grid item xs={2}>
                      <CardMedia  className={classes.cover}
                                  image={this.props.image}
                      />
                    </Grid>
                    <Grid item xs={8}>
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
                    </Grid>
                    <Grid item xs={2}>
                      <div className={classes.centered}>{this.state.likes}&nbsp;<Favorite className={classes.noVote} /></div>
                    </Grid>
                  </Grid>
                </Card>
              </div>
    }

    return (
      <div>
        {song}
      </div>
    );
  }
}

export default withStyles(styling, { withTheme: true })(Songs);