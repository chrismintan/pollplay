import React from 'react';

class DropDownSong extends React.Component {

  render() {
    return (
      <div>
        <div onClick={this.props.selectSong}>{this.props.title} by: {this.props.artist}</div>
      </div>
    )
  }
}

export default DropDownSong;