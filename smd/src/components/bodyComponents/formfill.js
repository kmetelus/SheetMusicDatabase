import React, { Component } from 'react';
import Button from './button';
class FormFill extends Component {

  constructor(props) {
    super(props);
    this.name = props.name;
    this.defaultText = props.defaultText;
    this.state = {
      searchText: this.defaultText,
      searchResult: [],
    }
  }

  onChange(e) {
    this.setState({searchText: e.target.value});
  }

  render() {
    return (
      <div>
        <input type="text" name={this.name} placeholder={this.state.searchText} onChange={this.onChange.bind(this)}/>
        <Button label="VALIDATE"/>
      </div>
    );
  }
}

export default FormFill;
