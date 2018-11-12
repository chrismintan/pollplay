import React, { Component } from 'react';

class SearchBar extends Component {
    constructor(props) {
      super(props);
      this.state = {
        input:''
      };
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
    }

    handleInputChange (e) {
        this.setState({
            input:e.target.value
        })
    }

    handleClick(e) {
        e.preventDefault()
        this.props.updateSongBank(this.state.input)
    }
  
    render() {
      // console.log(data.tracks.items);
      return (
       <div>
           {/* {console.log('here are search props',this.props)} */}
           <form action=""  >
               <input type="text" value={this.state.input} onChange={this.handleInputChange} onClick={this.handleClick}/>
               <button onClick={(e)=>this.handleClick(e)}>button</button>
           </form>
       </div>
      );
    }
  }




export default SearchBar;