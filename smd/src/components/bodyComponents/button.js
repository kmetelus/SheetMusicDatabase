import React, { Component } from 'react';

class Button extends Component {
  constructor(props) {
    super(props);
  }

  onClick(e) {
    console.log("success");
  }
  render() {
    return (
      <button
        className="validate"
        onClick={this.onClick.bind(this)}> <p>{this.props.label} </p></button>
    );
  }
}

export default Button;
