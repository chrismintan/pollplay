import React from 'react';
import styles from './style.scss';
import axios from 'axios';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const styling = {
  appBar: {
    height: 60,
    background: '#323232FF',
  },
  contain: {
    height: 60,
    position: 'relative',
  },
  toolTip: {
    background: 'white',
    color: 'black',
    // boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  icon: {
    color: 'white',
    padding: 0,
    margin: 0,
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
      expanded: false,
    };

    this.toggleActive = this.toggleActive.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.social = this.social.bind(this);
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

  social() {
    this.setState({
      expanded: !this.state.expanded,
    })
  }

  handleToggle() {
    this.toggleActive()
    document.getElementById("body").classList.toggle('nav-open');
  }

  render() {
    const { classes } = this.props;

    let social;

    if ( this.state.expanded == true ) {
      social = (
        <span>
          <IconButton onClick={this.social}>
            <KeyboardArrowRight className={classes.icon} />
          </IconButton>
          <span className='name' style={{display: 'inline-block'}}>An&nbsp;app&nbsp;made&nbsp;by:&nbsp;<strong id="copy">©</strong>hristopher&nbsp;Tan&nbsp;&nbsp;</span>
        </span>
      )
    } else {
      social = (
        <IconButton onClick={this.social}>
          <KeyboardArrowLeft className={classes.icon} />
        </IconButton>
      )
    }

    let profile;
    if ( this.state.profilePic != '' && this.state.displayName != '' ) {
      profile = (
        <div className="nav-link">
          <img className="profile-image" src={this.state.profilePic} alt='Profile Pic'/>
          <div className="profile-name">{this.state.displayName}</div>
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

            <div className='inline'>
              <div className="body" id="body">
                <div className="wrapper">
                  <div className="nav-toggle" id="icon" onClick={this.handleToggle}>
                    <div className="icon"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="head">
              <div id="head">
                <div style={{display: 'inline-block'}}>PollPlay</div>
                <div style={{display: 'inline-block', float: 'right'}}>
                  <div className="social" >
                    <Tooltip style={{float: 'right', marginRight: '15px'}} title="Email me!" classes={{ tooltip: classes.toolTip}}>
                      <a href="mailto:chrismintan91@gmail.com?Subject=Hello%20there!" ><img src="/email.png" /></a>
                      </Tooltip>
                    <Tooltip style={{float: 'right'}} title="Github Profile" classes={{ tooltip: classes.toolTip}}>
                      <a href="https://github.com/chrismintan" target="_blank" ><img src="/github.png" /></a>
                    </Tooltip>
                    <Tooltip style={{float: 'right'}} title="LinkedIn Profile" classes={{ tooltip: classes.toolTip}}>
                      <a target="_blank" href="https://www.linkedin.com/in/chrismintan/" ><img src="/linkedin.png" /></a>
                    </Tooltip>
                    {social}
                  </div>
                </div>
              </div>
            </div>

          </AppBar>
        </div>


        <div className={this.state.active ? "side-nav active" : "side-nav hidden"}>
          <div className="nav-options">
            {profile}
            <a className="nav-link opts" href="/">Home</a>
            {this.state.userId ?
              <a className="nav-link opts" href="/auth/logout">Logout</a>
            :
              <a className="nav-link opts" href="/auth/login">Login</a>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styling)(NavBar);