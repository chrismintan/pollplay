import React from 'react';
import Main from './Main/Main.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentPage: 'Main',
    };
  }

  render() {
    // Insert authentication logic here

    let component = <Main />

    return (
      <div>
        {component}
      </div>
    )
  }
}

export default App;