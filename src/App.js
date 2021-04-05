import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React, { Component } from 'react';
import NewPost from './UI/NewPost'
import MainList from './UI/MainList'
import TagView from './UI/TagView'

class App extends Component {

  render() {
    return (
        <Router>
          <div> 
              <ul className='headerul'>
                <li>
                <Link to="/new">NEW</Link>
                </li>
                <li>
                <Link to="/list">LIST</Link>
                </li>
                <li>
                <Link to="/tag">TAGS</Link>
                </li>
              </ul>
               <br />
              <Route exact path="/" component={MainList} />
              <Route path="/new" component={NewPost} />    
              <Route path="/list" component={MainList} />                 
              <Route path="/tag" component={TagView} />                 
          </div>
      </Router>
    );
  }
}

export default App;