import React from 'react';
import styles from './style.scss';
import axios from 'axios';

class NavBar extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false,
      profilePic: '',
      displayName: '',
      userId: null,
    };

    this.toggleActive = this.toggleActive.bind(this);
  }

  toggleActive() {
    this.setState({
      active: !this.state.active,
    });
  }

  componentDidMount() {
    axios.get('/auth/isLoggedIn')
    .then(({data}) => {
      this.setState({
        profilePic: data.image_url,
        displayName: data.display_name,
        userId: data.userId,
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {
    let profile;
    if ( this.state.profilePic != '' && this.state.displayName != '' ) {
      profile = (
        <div>
          <img src={this.state.profilePic} alt='Profile Pic'/>
          <div>{this.state.displayName}</div>
        </div>
      )
    } else {
      profile = <div></div>
    }
    return (
      <div className="navbar">
        <div className="nav-carrot"><button className="fas fa-chevron-right" onClick={this.toggleActive}>Toggle!</button></div>
        <div className={this.state.active ? "side-nav active" : "side-nav hidden"}>
          <div className="nav-logo">
            <img src="/static/images/Logo-transparent.png" alt="Logo"/>
          </div>
          <div className="nav-links">
            {profile}
            <a className="nav-link" href="/">Home</a>
            {this.state.userId ?
              <a className="nav-link" href="/auth/logout">Logout</a>
            :
              <a className="nav-link" href="/auth/login">Login</a>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default NavBar;