import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <header>
        <div className="logo">
          LOGO
        </div>

        <h1 className="title"> SheetMusicDatabase </h1>
        <nav>
          <ul>
            <li className="first">
              <a href="#">Home</a>
            </li>

            <li>
              <a href="#">About</a>
            </li>

            <li className="last">
              <a href="#">Contact</a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
