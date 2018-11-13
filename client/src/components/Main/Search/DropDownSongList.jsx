import React from 'react';
import DropDownSong from './DropDownSong.jsx';

class DropDownSongList extends React.Component {
  render() {

    let songSelection = this.props.spotifyResults.map( (spotifyResults, index) => {

      return (
        <DropDownSong key={index} title={spotifyResults.name} artist={spotifyResults.artists[0].name} image={spotifyResults.album.images[2].url} selectSong={spotifyResults.selectSong} />
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