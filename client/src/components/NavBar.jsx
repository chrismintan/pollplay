import React from 'react';
import styles from './style.scss';

class NavBar extends React.Component {
  constructor() {
    super();
    this.state = {
      active: true,
    };

    this.toggleActive = this.toggleActive.bind(this);
  }

  toggleActive() {
    console.log('clicked!')
    this.setState({
      active: !this.state.active,
    });
  }

  render() {
    return (
      <div>
        <div className="nav-carrot"><button className="fas fa-chevron-right" onClick={this.toggleActive}>Toggle!</button></div>
        <div className={this.state.active ? "side-nav active" : "side-nav hidden"}>
          <div className="nav-logo">
            <img src="/static/images/Logo-transparent.png" alt="Logo"/>
          </div>
          <div className="nav-links">
            <a className="nav-link" href="/">Home</a>
            {this.props.userId ?
              <a className="nav-link" href="/auth/logout">Logout</a>
            :
              <a className="nav-link" href="/auth/login">Login</a>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default NavBar;