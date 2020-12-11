import React, { Component } from 'react';
import { Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';
import config from 'react-global-configuration';
class App extends Component {
  constructor(props) {
    super(props);
    }

  render() {
    return (
      <div>
          <div id="Content"></div>
        </div>
    );
  }
}

export default App;
