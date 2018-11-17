import React from 'react';
import Songs from './Songs.jsx';

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
      <div>
        <div style={{ lineHeight: '53.75px' }}>Upvote Songs!</div>
        {songPoll}
      </div>
    )
  }
}

export default SongList