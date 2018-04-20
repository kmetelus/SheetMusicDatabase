import React, { Component } from 'react';
import Modal from 'react-modal';
import FormFill from './../bodyComponents/formfill';
import Dropdown from './../bodyComponents/dropdown';

const DROPDOWN_OPTIONS = [
  {label: 'Song'},
  {label: 'Artist'},
  {label: 'Collection'}
];


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    height                : '75%',
    width                 : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-100%',
    transform             : 'translate(-50%, -50%)'
  }
};

// Modal.setAppElement('#yourAppElement')

class Homepage extends Component {
  constructor() {
  super();

  this.state = {
    modalIsOpen: false
  };

  this.openModal = this.openModal.bind(this);
  this.afterOpenModal = this.afterOpenModal.bind(this);
  this.closeModal = this.closeModal.bind(this);
}

openModal() {
  this.setState({modalIsOpen: true});
}

afterOpenModal() {
  // references are now sync'd and can be accessed.
  this.subtitle.style.color = '#f00';
}

closeModal() {
  this.setState({modalIsOpen: false});
}


  render() {
    return (
      <div className="container-fluid">
        <h3> Welcome! </h3>

        <p> For quick search see below </p>

        <div className="form">
          <ul>
            <li>
              <div><Dropdown id = {'1'} options={DROPDOWN_OPTIONS} /></div><div><FormFill name='Song Title' defaultText="Enter keywords here..."/></div>
            </li>
          </ul>
        </div>

        <p> For advanced search click <a onClick={this.openModal}>here</a></p>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
        <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
        <button onClick={this.closeModal}>close</button>
        <div><p>I am a modal</p></div>
        </Modal>

        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>

      </div>
    );
  }
}

export default Homepage;
