import React from 'react';

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
      </div>
    )
  }
}

export default CurrentSong;