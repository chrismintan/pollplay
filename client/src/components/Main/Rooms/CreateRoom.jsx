import React from 'react';
import { Link, Route, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
    width: '100%',
  },
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
    // Hackerish way to relead script
    window.location.reload()
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
          <h2>Create A Room!</h2>
          <div>
            <form>
              <input type='text' value={this.state.input} onChange={this.handleInputChange} />
              <button onClick={this.handleClick}>Create!</button>
            </form>
          </div>
        </div>
      )
    } else {
      component = <a style={{ color: "#66FF66FF" }} href='/auth/login'>Please Login to Create a Room!</a>
    }

    return (
      <div>
        <Grid container>
          <div className={classes.paper}>
            {component}
            <div>
              <p>or join an existing room!</p>
              <div>
                <form>
                  <input type='text' placeholder='Enter a room code...' value={this.state.roomCode} onChange={this.handleRoomCodeChange} />
                  <button onClick={this.joinRoom}>Join Room!</button>
                </form>

                <form>
                  <TextField
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                      classes: {
                        input: classes.textField,
                      },
                    }}
                    // hintStyle={{ width: '600px', textAlign: 'center' }}
                    style={{ width: '33%', paddingTop: 10 }}
                    label='Create a room!'
                    InputLabelProps={{
                      style: {
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        width: '100%',
                        color: '#E6E6E5FF',
                        fontSize: 25,
                      }
                    }}
                  />
                </form>

                <form>
                  <TextField
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                      classes: {
                        input: classes.textField,
                      },
                    }}
                    // hintStyle={{ width: '600px', textAlign: 'center' }}
                    style={{ width: '33%', paddingTop: 10 }}
                    label='or join a room!'
                    InputLabelProps={{
                      style: {
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        width: '100%',
                        color: '#E6E6E5FF',
                        fontSize: 25,
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












