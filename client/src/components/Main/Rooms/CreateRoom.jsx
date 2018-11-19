import React from 'react';
import { Link, Route, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RedoIcon from '@material-ui/icons/Redo';
import FormControl from '@material-ui/core/FormControl';

import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
  title: {
    marginTop: '60px',
    fontSize: '50px',
    color: '#CCCCCBFF',
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
    width: '100%',
  },
  top: {
    marginTop: 30,
    color: '#FEFEFEFF',
  },
  bot: {
    marginTop: 30,
    color: '#FEFEFEFF',
  },
  textFieldCreate: {
    // marginTop: 20,
    color: '#FEFEFEFF',
    borderBottom: '1px solid #FEFEFEFF',
    // marginBottom: 5,
    width: '100%',

  },
  textFieldJoin: {
    color: '#FEFEFEFF',
    borderBottom: '1px solid #FEFEFEFF',
    marginBottom: 5,
    width: '100%',

  },
  'input-label': {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: '100%',
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
  icon: {
    color: 'white',
    marginTop: '25px',
  },
  iconTop: {
    color: 'white',
    marginTop: '17px',
  },
});

class CreateRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      roomCode: '',
      spotifyId: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRoomCodeChange = this.handleRoomCodeChange.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
  }

  componentWillUnmount() {
    localStorage.clear();
    // Hackerish way to relead script
    window.location.reload();
  }

  componentDidMount() {
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

  render() {
    const { classes } = this.props;

    let component;
    if (this.props.userID) {
      component = (
        <div>
          <form onSubmit={this.handleClick}>
            <FormControl style={{ width: '33%' }} className={classes.textFieldCreate}>
              <TextField
                value={this.state.input}
                onChange={this.handleInputChange}
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    input: classes.top,
                  },
                  endAdornment: (
                    <InputAdornment variant="filled" position="end">
                      <IconButton>
                        <AddCircleIcon className={classes.iconTop}/>
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                label='Create a room!'
                InputLabelProps={{
                  style: {
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '100%',
                    color: '#FEFEFEFF',
                    fontSize: 30,
                    fontWeight: 'lighter',
                    marginTop: 15,
                  }
                }}
              />
            </FormControl>
          </form>
        </div>
      )
    } else {
      component = <a style={{ color: "#1db954", fontStyle: 'bold', fontSize: 30, lineHeight: '100px' }} href='/auth/login'>Please Login to Create a Room!</a>
    }

    return (
      <div>
        <Grid container spacing={0}>
          <div className={classes.paper}>
          <h1 className={classes.title}>Welcome to PollPlay!</h1>
            {component}
            <div>
              <div>
                <form onClick={this.joinRoom}>
                  <FormControl style={{ width: '33%' }} className={classes.textFieldCreate}>
                    <TextField
                      value={this.state.roomCode}
                      onChange={this.state.handleRoomCodeChange}
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        classes: {
                          input: classes.top,
                        },
                        endAdornment: (
                          <InputAdornment variant="filled" position="end">
                            <IconButton onClick={this.joinRoom} >
                              <RedoIcon className={classes.icon}/>
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      label='or join a room!'
                      InputLabelProps={{
                        style: {
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          width: '100%',
                          color: '#FEFEFEFF',
                          fontSize: 20,
                          fontWeight: 'lighter',
                          marginTop: 25,
                        }
                      }}
                    />
                  </FormControl>
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












