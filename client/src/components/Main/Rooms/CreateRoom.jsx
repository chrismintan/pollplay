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
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import ErrorIcon from '@material-ui/icons/Error';

const variantIcon = {
  error: ErrorIcon,
}

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
  margin: {
    margin: '10px',
  },
  error: {
    background: 'rgb(186, 38, 26)',
    textAlight: 'center',
    display: 'block',
  }
});


class CreateRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      roomInput: '',
      spotifyId: '',
      createError: false,
      joinError: false,
      vertical: 'top',
      horizontal: 'center',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRoomCodeChange = this.handleRoomCodeChange.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.throwCreateError = this.throwCreateError.bind(this);
    this.throwJoinError = this.throwJoinError.bind(this);
    this.charError = this.charError.bind(this);
    this.createAndRedirect = this.createAndRedirect.bind(this);
  }

  componentWillUnmount() {
    localStorage.clear();
    // Hackerish way to relead script
    window.location.reload();
  }

  componentDidMount() {
    let reactThis = this;
    axios.get('/auth/isLoggedIn')
    .then(({data}) => {
      reactThis.props.setUserID(data.userId);
      reactThis.setState({
        spotifyId: data.spotify_id,
      })
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleInputChange(event) {
    this.setState({
      input: event.target.value.toLowerCase(),
    })
  }

  // Creating a room input - this.state.input function - this.state.handleClick
  handleClick(event) {
    let reactThis = this;
    event.preventDefault();
    let roomId = this.state.input;

    if ( this.state.input.length < 5 ) {
      this.charError();
    } else if ( this.state.input.length > 4 ) {
      axios.get(`/api/rooms/${this.state.input}`, {
        params: {
          roomId: roomId
        }
      })
      .then(({data}) => {
        if ( data.length != 0 ) {
          if ( data[0].spotify_id == reactThis.state.spotifyId ) {
            reactThis.props.setRoomID(roomId);
            reactThis.props.history.push(`/rooms/${roomId}`);
          } else {
            this.throwCreateError();
          }
        } else if ( data.length == 0 ) {
          this.createAndRedirect();
        }
      })
      .catch(err => {
        console.error()
      })
    }
  }

  createAndRedirect() {
    let reactThis = this;
    axios.post('/api/createRoom', {
      roomName: this.state.input.toLowerCase(),
      spotifyId: this.state.spotifyId,
    })
    .then(({data}) => {
      reactThis.props.setRoomID(data);
      reactThis.props.history.push(`/rooms/${data}`);
    })
    .catch(err => {
      console.log(err);
    });
  }


  handleRoomCodeChange(event) {
    this.setState({
      roomInput: event.target.value.toLowerCase(),
    });
  }

  // Joining a room Input - this.state.roomInput function - this.joinRoom
  async joinRoom(event) {
    event.preventDefault()
    let reactThis = this;
    let roomCode = this.state.roomInput.toLowerCase();

    axios.get(`/api/rooms/${roomCode}`, {
      params: {
        roomId: roomCode,
      }
    })
    .then(({data}) => {
      if ( data.length == 0 ) {
        reactThis.throwJoinError
      } else {
        reactThis.props.setRoomID(roomCode);
        reactThis.props.history.push(`/rooms/${roomCode}`);
      }
    })
    .catch(err => {
      console.log('error!', err)
    })
  }

  throwCreateError() {
    this.setState({
      createError: true,
    })
  }

  throwJoinError() {
    this.setState({
      joinError: true,
    })
  }

  handleClose() {
    this.setState({
      open: false,
    })
  }

  charError() {
    this.setState({
      charError: true,
    })
  }

  render() {
    const { classes } = this.props;
    const { vertical, horizontal, open } = this.state;

    let component;
    if (this.props.userID) {
      component = (
        <div>
          <form onSubmit={this.handleClick}>
            <FormControl style={{ width: '33%' }} className={classes.textFieldCreate}>
              <TextField
                value={this.state.input}
                onKeyPress={(e) => {
                 if ( e.which == 32 ) {
                  e.preventDefault();
                 }
                }}
                onChange={this.handleInputChange}
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    input: classes.top,
                  },
                  endAdornment: (
                    <InputAdornment variant="filled" position="end">
                      <IconButton onClick={this.handleClick}>
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
                <form onSubmit={this.joinRoom}>
                  <FormControl style={{ width: '33%' }} className={classes.textFieldCreate}>
                    <TextField
                      value={this.state.roomInput}
                      onChange={this.handleRoomCodeChange}
                      fullWidth
                      onKeyPress={(e) => {
                       if ( e.which == 32 ) {
                        e.preventDefault();
                       }
                      }}

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
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'middle',
          }}
          open={this.state.createError}
          autoHideDuration={5000}
          onClose={this.handleClose}
          ContentProps={{
            classes: {
              root: classes.error,
            },
            'aria-describedby': 'message-id',
          }}
          message={<span style={{ textAlign: 'center', fontSize: 17 }} className={classes.error}>Sorry! Room name is already taken. Please choose another!</span>}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'middle',
          }}
          open={this.state.joinError}
          autoHideDuration={5000}
          onClose={this.handleClose}
          ContentProps={{
            classes: {
              root: classes.error,
            },
            'aria-describedby': 'message-id',
          }}
          message={<span style={{ textAlign: 'center', fontSize: 17 }} className={classes.error}>No room of such name found. Please try again!</span>}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'middle',
          }}
          open={this.state.charError}
          autoHideDuration={5000}
          onClose={this.handleClose}
          ContentProps={{
            classes: {
              root: classes.error,
            },
            'aria-describedby': 'message-id',
          }}
          message={<span style={{ textAlign: 'center', fontSize: 17 }} className={classes.error}>Room codes must be 5 characters or more!</span>}
        />
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(CreateRoom));












