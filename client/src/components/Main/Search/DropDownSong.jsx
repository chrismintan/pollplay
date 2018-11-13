import React from 'react';

class DropDownSong extends React.Component {

  render() {
    return (
      <div>
        <div onClick={this.props.selectSong}>{this.props.title} by: {this.props.artist} <img src={this.props.image} alt='song image' /></div>
      </div>
    )
  }
}

export default DropDownSong;