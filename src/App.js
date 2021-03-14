import textIcon from './text.png';
import binaryIcon from './binary.png';
import './App.css';
//import React from "react"
import React, { Component } from 'react';

let currentPage = 0;
let inLoading = false;
let currentSelection = "全部";

export default class Main_Page extends React.Component{

  constructor(){
      super();
      this.state = {
          banners: ['']
      }
  }

  // get请求
  componentDidMount(){
      fetch("http://192.168.0.100:8080/ydjm/api/post/list?page=0")
      .then(res => res.json())
      .then(data => {
        console.log(data);
          this.setState({
              banners:data
          })
      })
      document.addEventListener('scroll', this.trackScrolling);
  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }
  
  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }
  
  trackScrolling = () => {
    const wrappedElement = document.getElementById('list_root');
    if (this.isBottom(wrappedElement)) {
      console.log('page bottom reached');
      this.loadMoreData();
    }
  };

  loadMoreData() {
    if (inLoading) {
      return;
    }
    inLoading = true;
    let tryPage = currentPage + 1;
    let url = "http://192.168.0.100:8080/ydjm/api/post/list?page=" + tryPage;
    console.log(url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
          console.log(data)
          inLoading = false;
          if (data != null && data.length > 0) {
            currentPage = tryPage;
          } else {
            return;
          }
          this.setState({
              banners:this.state.banners.concat(data)
          })
      })
  }

  viewTag(tagName) {
    console.log(tagName);
  }

  renderIconImage(file) {
    switch(file.fileType) {
      case 'png':
      case 'jpg':
        return ".\\" + file.filePath + "\\" + file.fileName;
      case 'txt':
        return textIcon;
      default:
        return binaryIcon; 
    }
  }

  render(){
      return(
          <div id="list_root">
            <hr/>
            <h1>{currentSelection}</h1>
              {
                this.state.banners.map((element,index) =>{
                  return(
                    <ul key = {index}>
                      <h3>{element.title}</h3>
                      <div>{element.createTime}</div>
                      <div>
                        {
                          element.tags && element.tags.map((tag, i) =>{
                            return(
                            <div 
                            key = {i} 
                            className = "tagLable" 
                            onClick={() => this.viewTag(tag)}>{tag}</div>
                            )
                          })
                        }
                      </div>
                      <pre>{element.content}</pre>
                      <div>
                        {
                          element.files && element.files.map((file, ii) =>{
                            return(
                              <div key = {ii}>
                                {
                                  file.fileName ? 
                                  <img className = "iconImg" src={this.renderIconImage(file)}/>: ''
                                }
                              </div>
                            )
                          })
                        }
                      </div>
                    </ul>
                  )
                })
              }
            
          </div>
      )
  }
}
