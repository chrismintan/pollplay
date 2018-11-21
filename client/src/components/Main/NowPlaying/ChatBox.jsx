import React from 'react';
import Button from '@material-ui/core/Button';
import ReactDOM from 'react-dom';
import Message from './Message.jsx';
import styles from './chat.scss';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

const styling = theme => ({
  button: {
    margin: 0,
  },
  input: {
    display: 'none',
  },
});

class ChatBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      username: false,
      open: false,
    }

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSelectName = this.handleSelectName.bind(this);
    this.handleNameSelectChange = this.handleNameSelectChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.chatInput = this.chatInput.bind(this);
  }

  componentWillMount() {
    this.persistentState()
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView();
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  handleClickOpen() {
    this.setState({
      open: true,
    })
  }

  handleClose() {
    this.setState({
      open: false,
    })
  }

  handleNameSelectChange(e) {
    this.setState({
      input: e.target.value,
    })
  }

  handleSelectName(e) {
    let input = this.state.input
    this.setState({
      username: '',
      input: '',
    })
    this.setState({
      username: input,
    })
    localStorage.setItem('pollPlayUserName', JSON.stringify(input))
  }

  chatInput(e) {
    if ( this.state.username == false ) {
      this.handleClickOpen();
    } else {
      this.setState({
        input: e.target.value,
      })
    }
  }

  submitMessage(e) {
    e.preventDefault();
    if ( this.state.username == false ) {
      return
    }
    let roomId = this.props.roomId
    let username = this.state.username;
    let message = this.state.input;
    let data =
    {
      roomId: this.props.roomId,
      username: this.state.username,
      message: this.state.input,
      chatBox: true
    }
    this.props.sendMessage(data)
    this.setState({
      input: '',
    })
  }

  // scrollToBot() {
  //   ReactDOM.findDOMNode(this.refs.chats).scrollBot = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
  // }

  persistentState() {
    let username = this.state.username
    for ( username in this.state ) {
      if ( localStorage.hasOwnProperty('pollPlayUserName')) {
        let value = localStorage.getItem('pollPlayUserName');
        value = JSON.parse(value);
        this.setState({
          username: value,
        })
      }
    }
  }

  render() {
    const { classes } = this.props;
    let messages = this.props.msgArr.map( (msgArr, index) => {
      return (
        <Message key={index} sender={msgArr.username} username={this.state.username} message={msgArr.message} />
      )
    })

    let prompt;

    if ( this.state.username == false ) {
      prompt =
      <div>
        <Button style={{zIndex: 9999, marginTop: '175px', color: 'white', position: 'relative'}} onClick={this.handleClickOpen}>Please choose a name to enter chat
        </Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Enter Chat Room
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please save a name to enable the chat!
              </DialogContentText>
              <TextField
                onKeyPress={(event) => {
                  if ( event.key == 'Enter' ) {
                    this.handleSelectName();
                  }
                }}
                value={this.state.usernameInput}
                onChange={this.handleNameSelectChange}
                autoFocus
                margin="dense"
                id="name"
                label="Display name"
                type="text"
                fullWidth
                autoComplete='off'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSelectName} color="primary">
                Enter
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    } else {
      prompt = '';
    }

    return (
      <div>
        {prompt}
        <div className="chatroom">
          <h3 className="chat-title">PollPlay Chat!</h3>
          <ul className="chats" ref="chats">
            <div className="bubbles">
              {messages}
            </div>
            <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
        </div>
          </ul>
          <div className="bottom">
          </div>
        </div>
        <div>
        <form className="form">
          <input style={{width: '65%', marginBottom: '20px', lineHeight: '30px', fontSize: '15px'}} type="text" ref="msg" placeholder="Type something to chat!" value={this.state.input} onChange={this.chatInput} />

          <Button onClick={this.submitMessage} style={{transform: "translateY(-2px)"}} variant="contained" color="primary" className={classes.button}>Send</Button>
        </form>
        </div>
      </div>
    )
  }
}

export default withStyles(styling)(ChatBox);