import React from 'react';
import { Link, Route, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
    width: '100%',
  },
  textFieldCreate: {
    color: '#FEFEFE',
    borderBottom: '3px solid #1db954',
    marginBottom: 5,
    width: '100%',

  },
  textFieldJoin: {
    color: '#E6E6E5',
    borderBottom: '2px solid #4DB6AC',
    marginBottom: 5,
    width: '100%',

  },
  'input-label': {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: '100%',
    color: 'red',
    textAlign: 'center',
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
  },
  root: {
    color: red[600],
    '&$checked': {
      color: red[500],
    },
  },
});

class CreateRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      roomCode: '',
      spotifyId: '',
      counter: 0,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRoomCodeChange = this.handleRoomCodeChange.bind(this);
    this.joinRoom = this.joinRoom.bind(this);

    this.testButton = this.testButton.bind(this);
    this.clear = this.clear.bind(this);
    this.persistentState = this.persistentState.bind(this);
  }

  componentWillUnmount() {
    localStorage.clear();
    // Hackerish way to relead script
    window.location.reload();
  }

  componentDidMount() {
    this.persistentState()
    axios.get('/auth/isLoggedIn')
    .then(({data}) => {
      this.props.setUserID(data.userId);
      this.setState({
        spotifyId: data.spotify_id,
      })
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleInputChange(event) {
    this.setState({
      input: event.target.value,
    })
  }

  handleClick(event) {
    event.preventDefault();

    if ( this.state.input.length > 4 ) {
      axios.post('/api/createRoom', {
        roomName: this.state.input,
        spotifyId: this.state.spotifyId,
      })
      .then(({data}) => {
        this.props.setRoomID(data);
        this.props.history.push(`/rooms/${data}`);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  handleRoomCodeChange(event) {
    this.setState({
      roomCode: event.target.value,
    });
  }

  joinRoom(event) {
    let roomCode = this.state.roomCode;
    this.props.setRoomID(roomCode);
    this.props.history.push(`/rooms/${roomCode}`);
  }

  testButton(event) {
    event.preventDefault();
    let newCount = this.state.counter + 1
    this.setState({
      counter: this.state.counter + 1
    })
    localStorage.setItem('counter', JSON.stringify(newCount));
  }

  clear(event) {
    event.preventDefault();
    localStorage.clear();
  }

  persistentState() {
    for ( let counter in this.state ) {
      if ( localStorage.hasOwnProperty('counter') ) {
        let value = localStorage.getItem('counter');

        try {
          value = JSON.parse(value);
          this.setState({
            counter: value,
          });
        } catch(e) {
          this.setState({
            counter: value,
          })
        }
      }
    }
  }

  render() {
    const { classes } = this.props;

    let component;
    if (this.props.userID) {
      component = (
        <div>
          <form onSubmit={this.handleClick}>
            <TextField
              value={this.state.input}
              onChange={this.handleInputChange}
              fullWidth
              InputProps={{
                disableUnderline: true,
                classes: {
                  input: classes.textFieldCreate,
                },
              }}
              // hintStyle={{ width: '600px', textAlign: 'center' }}
              style={{ width: '33%', paddingTop: 15 }}
              label='Create a room!'
              InputLabelProps={{
                style: {
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  width: '100%',
                  color: '#1db954',
                  fontSize: 30,
                }
              }}
            />
          </form>
        </div>
      )
    } else {
      component = <a style={{ color: "#1db954", fontStyle: 'bold' }} href='/auth/login'>Please Login to Create a Room!</a>
    }

    return (
      <div>
        <Grid container spacing={0}>
          <div className={classes.paper}>
            {component}
            <div>
              <p style={{ color: "#FB0106FF", fontSize: 24, marginTop: 40 }}>or join an existing room!</p>
              <div>
                <form>
                  <TextField
                    value={this.state.roomCode}
                    onChange={this.handleRoomCodeChange}
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                      classes: {
                        input: classes.textFieldJoin,
                      },
                    }}
                    // hintStyle={{ width: '600px', textAlign: 'center' }}
                    style={{ width: '27%', paddingTop: 10 }}
                    label='or join a room!'
                    InputLabelProps={{
                      style: {
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        width: '100%',
                        color: '#4DB6AC',
                        fontSize: 27,
                      }
                    }}
                  />
                </form>
              </div>
            </div>
          </div>
        </Grid>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(CreateRoom));












