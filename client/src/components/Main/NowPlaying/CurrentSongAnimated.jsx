import React from 'react';
import script from './script2.js';

class CurrentSong extends React.Component {

  render() {
    return (
      <div className='current-song'>
        <div className='current-song-image'>
          <img src={this.props.image} alt='song image' />
        </div>
        <div className='current-song-title'>
          <div>{this.props.title}</div>
        </div>
        <div className='current-song-artist'>
          <div>{this.props.artist}</div>
        </div>
        <script src={script}></script>
      </div>
    )
  }
}

export default CurrentSong;