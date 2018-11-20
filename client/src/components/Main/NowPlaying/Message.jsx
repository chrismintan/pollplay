import React from 'react';

class Message extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    const username = this.props.username;
    const sender = this.props.sender

    let message;

    if ( sender == username ) {
      message = (
        <li className="chat right" style={{float: 'right'}}>
          <div style={{float: 'right', fontSize: 15, boxSizing: 'initial'}}>{this.props.sender}:
          </div>
          <br/>
          <span style={{float: 'right'}}>{this.props.message}
          </span>
        </li>
      )
    } else {
      message = (
        <li className="chat left" style={{float: 'left'}}>
          <div style={{float: 'left', fontSize: 15, boxSizing: 'initial'}}>{this.props.sender}:
          </div>
          <br/>
          <span style={{float: 'left'}}>{this.props.message}
          </span>
        </li>
      )
    }

    return (
      <div>
        {message}
      </div>
    )
  }
}

export default Message;
