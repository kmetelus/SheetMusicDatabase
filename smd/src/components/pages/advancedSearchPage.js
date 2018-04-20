import React, { Component } from 'react';
import FormFill from './../bodyComponents/formfill';

class AdvancedSearch extends Component {
  render() {
    return (
      <div className="container-fluid">
        <h1> SheetMusicDatabase </h1>

        <div className="form">
          <ul>
            <li>
              <p>Song Title</p><FormFill name='Song Title' defaultText="Enter song title here..."/>
            </li>

            <li>
              <p>Artist</p><FormFill name='Artist' defaultText="Enter artist name here..."/>
            </li>

            <li>
              <p>Collection</p><FormFill name='Collection' defaultText="Enter collection name here..."/>
            </li>
          </ul>
        </div>
        
      </div>
    );
  }
}

export default AdvancedSearch;
