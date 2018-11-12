import React from 'react';

class SearchBar extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleInputChange(e) {
    let input = event.target.value;
    this.setState({
      input: input,
    })
  }

  handleClick(e) {
    e.preventDefault();
    this.props.updateSongBank(this.state.input)
    console.log('Clicked!')
  }

  render() {
    return (
      <div>
        <form action="GET">
          <input type="text" value={this.state.input} onChange={this.handleInputChange} />
          <button onClick={this.handleClick}>Submit!</button>
        </form>
      </div>
    )
  }
}

export default SearchBar;