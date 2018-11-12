import React from 'react';
import Song from './Song.jsx';



class SongList extends React.Component {

  render(){

    let list = this.props.songBank.map( (songBank, index) => {

      return (
        <Song title={songBank.title} artist={songBank.artist} key={index} dropDownSongs={songBank.dropDownSongs} />
      )
    })

    return (
      <div>
        {list}
      </div>
    )
  }
}

export default SongList;