import React, { Component } from 'react';

class Searchbar extends Component {

  constructor() {
    super();
    this.state = {
      searchText: '',
      searchResult: [],
    }
  }

  onChange(e) {
    this.setState({searchText: e.target.value});
  }

  render() {
    return (
      <div>
        <input type="text" name="searchText" value={this.state.searchText} onChange={this.onChange.bind(this)} />
      </div>
    );
  }
}

export default Searchbar;
