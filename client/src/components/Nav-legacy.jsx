import React from 'react';
import styles from './style.scss';
import axios from 'axios';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styling = {
  appBar: {
    height: 60,
    background: '#323232FF',
  },
  contain: {
    height: 60,
    position: 'relative',
  }
}

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

    this.handleToggle = this.handleToggle.bind(this);
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

  handleToggle() {
    document.getElementById("body").classList.toggle('nav-open');
  }

  render() {
    const { classes } = this.props;

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
        <CssBaseline />

        <div className={classes.contain}>
          <AppBar position="fixed" className={classes.appBar}>

          <div className="body" id="body">
            <div className="wrapper">
              <div className="nav-toggle" id="icon" onClick={this.handleToggle}>
                <div className="icon"></div>
              </div>
            </div>
          </div>

          </AppBar>
        </div>


        <div className={this.state.active ? "side-nav active" : "side-nav hidden"}>
          <div className="nav-logo">
            <div>Logo Goes Here</div>
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

export default withStyles(styling)(NavBar);