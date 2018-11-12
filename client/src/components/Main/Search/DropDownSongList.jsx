import React from 'react';
import DropDownSong from './DropDownSong.jsx';

class DropDownSongList extends React.Component {
  render() {

    let songSelection = this.props.spotifyResults.map( (spotifyResults, index) => {

      return (
        <DropDownSong song={spotifyResults.title} selectSong={spotifyResults.selectSong} />
      )
    })

    return (
      <div>
        {songSelection}
      </div>
    )
  }
}

export default DropDownSongList;