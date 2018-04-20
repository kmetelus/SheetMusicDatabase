import React, { Component } from 'react';

// components
import Header from './components/headerComponent/header';
import Footer from './components/footerComponent/footer';
import Homepage from './components/pages/homePage';

// includes
import './Assets/css/default.min.css';
import './Assets/css/homepage.min.css';
import './Assets/css/formfill.min.css';
import './Assets/css/button.min.css';
import './Assets/css/dropdown.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>

          <Homepage />

        <Footer/>
      </div>
    );
  }
}

export default App;
