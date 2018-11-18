import React from 'react';
import Main from './Main/Main.jsx';
import CreateRoom from './Main/Rooms/CreateRoom.jsx';
import { Route, withRouter } from 'react-router-dom';
import NavBar from './NavBar.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userID: null,
      roomID: null,
    };

    this.setUserID = this.setUserID.bind(this);
    this.setRoomID = this.setRoomID.bind(this);
  }

  componentDidMount() {
    console.log(window.location.href)
  }

  setUserID(userID) {
    this.setState({
      userID: userID,
    })
  }

  setRoomID(roomID) {
    this.setState({
      roomID: roomID,
    })
  }

  render() {

    return (
      <div className='whole'>
          <NavBar userID={this.state.userID} />
          <Route
            exact path='/'
            render={(props) => (
              <CreateRoom
                setUserID={this.setUserID}
                setRoomID={this.setRoomID}
                roomID={this.state.roomID}
                userID={this.state.userID}
              />
            )}
          />
          <Route
            path='/rooms/:roomId'
            render={(props) => (
              <Main {...props} userId={this.state.userID}/>
            )}
          />
      </div>
    )
  }
}

export default withRouter(App);