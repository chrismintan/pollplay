import React from 'react';
import script1 from './script1.js';
import script2 from './script2.js';
import Cookies from 'universal-cookie';
import styles from './style.scss'

class CurrentSong extends React.Component {
  constructor(props) {
    super(props);
    const cookies = new Cookies();

    cookies.remove('albumURI')
    cookies.remove('albumImageURL')
    cookies.remove('trackName')
    cookies.remove('albumName')
    cookies.remove('artistName')
    cookies.remove('trackPosition')
    cookies.remove('trackDuration')
    cookies.remove('trackPlaying')
    cookies.remove('trackURI')
  }

  componentWillUnmount() {
    cookies.remove('albumURI')
    cookies.remove('albumImageURL')
    cookies.remove('trackName')
    cookies.remove('albumName')
    cookies.remove('artistName')
    cookies.remove('trackPosition')
    cookies.remove('trackDuration')
    cookies.remove('trackPlaying')
    cookies.remove('trackURI')
  }

  componentDidMount() {
    let path = window.location.href;

    const cookies = new Cookies();

    cookies.remove('albumURI')
    cookies.remove('albumImageURL')
    cookies.remove('trackName')
    cookies.remove('albumName')
    cookies.remove('artistName')
    cookies.remove('trackPosition')
    cookies.remove('trackDuration')
    cookies.remove('trackPlaying')
    cookies.remove('trackURI')

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
    return (
      <div className='current-song'>
          <canvas id="canvas"></canvas>
          <div id="toast" className="toast"><span id="text"></span><span id="text2"></span></div>
          <div className="trackposition" id="trackposition"><div className="fill" id="trackpositionfill"></div></div>
        <script src={script2}></script>
      </div>
    )
  }
}

export default CurrentSong;