import React, { Component } from 'react';

class FormFill extends Component {

  constructor(props) {
    super(props);
    this.name = props.name;
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
        <input type="text" name={this.name} value={this.state.searchText} onChange={this.onChange.bind(this)} />
      </div>
    );
  }
}

export default FormFill;
