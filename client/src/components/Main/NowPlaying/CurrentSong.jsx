import React from 'react';
import Cookies from 'universal-cookie';
import styles from './style.scss'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

const styling = {
  root: {
    color: 'white',
    position: 'fixed',
    display: 'inline-block',
  },
}


class CurrentSong extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
    }
    this.testing = this.testing.bind(this);
  }

  testing() {
    console.log('works')
  }

  componentDidMount() {
    console.log('CURRENTSONG MOUNTED!')

    const cookies = new Cookies();

    let reactThis = this;

    setInterval(function() {

      cookies.remove('albumURI')
      cookies.remove('albumImageURL')
      cookies.remove('trackName')
      cookies.remove('albumName')
      cookies.remove('artistName')
      cookies.remove('trackPosition')
      cookies.remove('trackDuration')
      cookies.remove('trackPlaying')
      cookies.remove('trackURI')

      cookies.set('albumURI', reactThis.props.albumURI, {path: '/', maxAge: 5})
      cookies.set('albumImageURL', reactThis.props.albumImageURL, {path: '/', maxAge: 5})
      cookies.set('trackName', reactThis.props.trackName, {path: '/', maxAge: 5})
      cookies.set('albumName', reactThis.props.albumName, {path: '/', maxAge: 5})
      cookies.set('artistName', reactThis.props.artistName, {path: '/', maxAge: 5})
      cookies.set('trackPosition', reactThis.props.trackPosition, {path: '/', maxAge: 5})
      cookies.set('trackDuration', reactThis.props.trackDuration, {path: '/', maxAge: 5})
      cookies.set('trackPlaying', reactThis.props.trackPlaying, {path: '/', maxAge: 5})
      cookies.set('trackURI', reactThis.props.trackURI, {path: '/', maxAge: 5})

    }, 3000)
  }


  render() {
    const { classes } = this.props
    let nextButton;
    if ( this.props.host == true ) {
      nextButton = (
        <IconButton onClick={this.props.skipToNext}>
          <SkipNextIcon className={classes.root} />
        </IconButton>
      )
    } else {
      nextButton = (
        <div></div>
      )
    }

    return (
      <div className='current-song' id='currentSong'>
        <img src="/logo.png" />
          <canvas id="canvas"></canvas>
          <div id="toast" className="toast">
            <span id="text"></span>
            <span style={{display: 'inline'}} id="text2"></span>&nbsp;
            {nextButton}
          </div>
          <div className="trackposition" id="trackposition"><div className="fill" id="trackpositionfill"></div></div>
          <script type="text/javascript" src="/test.js"></script>
      </div>
    )
  }
}

export default withStyles(styling)(CurrentSong);