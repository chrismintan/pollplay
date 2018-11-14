import React from 'react';
import { Link, Route, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';

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
        {component}
        <div>
          <p>or join an existing room!</p>
          <div>
            <form>
              <input type='text' placeholder='Enter a room code...' value={this.state.roomCode} onChange={this.handleRoomCodeChange} />
              <button onClick={this.joinRoom}>Join Room!</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CreateRoom);












