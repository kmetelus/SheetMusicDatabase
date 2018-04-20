import React, { Component } from 'react';
const DEFAULT_OPTION = <option disabled selected value hidden >Pick Me!</option>;

class Dropdown extends Component {

  constructor(props) {
    super(props);
    this.id = props.id;
    this.options = props.options;
    this.defaultText = props.defaultText;
    this.hasChanged = false;

    this.state = {
      value: DEFAULT_OPTION.value,
    }
  }

  createSelectOptions() {
    let items = [DEFAULT_OPTION];
    this.options.forEach((o, i) => {
      items.push(<option value={i + 1}> {o.label} </option>);
    });
    return items;
  }

  handleChange = (e) => {
    /*
    * Color for default is lightgrey, change to black on first change only
    */
    if (!this.hasChanged) {
      document.getElementById(this.id).style.color = '#010000';
      this.hasChanged = true;
    }
    this.setState({value: e.target.value});
  }


  render() {
    return (
      <div className = 'Dropdown'>
        <select
        id = {this.id}
        value = {this.state.value}
        onChange = {this.handleChange}
        options = {this.options}
        // {[
        //   { label: 'One' },
        //   { label: 'Two' },
        // ]}
      >
      {this.createSelectOptions()}
      </select>
      </div>
    );
  }
}

export default Dropdown;
