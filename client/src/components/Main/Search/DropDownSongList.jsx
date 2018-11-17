import React from 'react';
import SearchResults from './SearchResults.jsx';

class DropDownSongList extends React.Component {
  constructor() {
    super();
  }

  render() {
    let songSelection = this.props.spotifyResults.map( (spotifyResults, index) => {

      return (
        <SearchResults key={index} title={spotifyResults.name} artist={spotifyResults.artists[0].name} image={spotifyResults.album.images[1].url} addSong={this.props.addSong} trackURI={spotifyResults.uri} songBank={this.props.songBank} />
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