import React from 'react';

class Song extends React.Component {

  render() {
    return (
      <div>
        <div>{this.props.title}</div>
        <div>BY:</div>
        <div>{this.props.artist}</div>
        <button onClick={this.props.dropDownSongs}>DropDown!</button>
      </div>
    )
  }
}

export default Song;