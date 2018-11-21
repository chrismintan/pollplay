import React from 'react';
import Songs from './Songs.jsx';
import style from './style.scss';

class SongList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let songPoll = this.props.songBank.map( (songBank, index) => {
      return (
        <Songs key={index} title={songBank.trackName} artist={songBank.artistName} image={songBank.albumImageURL} upVoteSong={this.props.upVoteSong} trackURI={songBank.trackURI} likes={songBank.likes} />
      )
    })

    return (
      <div className="contain">
        <div className="contain2">
          <div style={{ position: 'fixed' }}>
          <div className="top" style={{ lineHeight: '53.75px', position: 'fixed', zIndex: 50, display: 'block', width: '25%' }}><span id="queue">Song Queue:</span></div>
          <div style={{ width: '100%', textAlign: 'center' }}>

          </div>
          </div>
          <div className="scroll">
            {songPoll}
          </div>
        </div>
      </div>
    )
  }
}

export default SongList