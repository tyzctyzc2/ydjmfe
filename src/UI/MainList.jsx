import textIcon from '../text.png';
import binaryIcon from '../binary.png';
import { Modal, Button } from 'antd';
import '../App.css';
import React, { Component } from 'react';
import '../config';

let currentPage = 0;
let inLoading = false;
let currentSelection = "全部";

export default class MainList extends React.Component{

  constructor(){
      super();
      this.state = {
          banners: [''],
          isModalVisible:false,
          curImg: null
      }
  }

  // get data when load
  componentDidMount(){
      document.title = 'POST'
      fetch(global.constants.website + "api/post/list?page=0")
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
    let url = global.constants.website + "api/post/list?page=" + tryPage;
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
    if (file == undefined) {
      return textIcon;
    }
    switch(file.fileType) {
      case 'png':
      case 'jpg':
      case 'mov':
        //return "http://localhost:8080\\ydjm\\" + file.filePath + "\\" + file.fileName;
        return ".\\ydjm\\" + file.filePath + "\\" + file.fileName;
      case 'txt':
        return textIcon;
      default:
        return binaryIcon; 
    }
  }

  handleZoom = (e) => {
    console.log(e)
    let { clientHeight, clientWidth, style } = e.target
    let ratio = clientHeight / clientWidth
    console.log("ratio===" + ratio)
    console.log("clientHeight===" + clientHeight)
    console.log("clientWidth===" + clientWidth)
    if (e.nativeEvent.deltaY <= 0 && clientWidth < 1000) {
        style.transform = "scale(2.5)"
    } else if (e.nativeEvent.deltaY > 0) {
        style.transform = "scale(1)"
    }
  }

  render(){
      return(
        <div>
          <div id="list_root">
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
                              <div key = {ii} name = {ii} className="fullLine">
                                {
                                  file.fileType == 'jpg' ?
                                  <img  className = "iconImg" 
                                        src={this.renderIconImage(file)}
                                        onClick={()=>{this.setState({isModalVisible:true, curImg:file})}}
                                  />: ''
                                }
                                {
                                  file.fileType == 'mov' ?
                                  <video id="video"  width="640" height="480" muted controls autoplay="autoplay" preload="auto" >
                                    <source src={this.renderIconImage(file)} />
                                  </video>: ''
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
          <Modal  fullScreen title="TAG" visible={this.state.isModalVisible}
                onCancel={()=>{this.setState({
                    isModalVisible:false
                })}}
                footer={[
                   
                  ]}
                >
                  <div onWheel={this.handleZoom}>
                    <img  className = "iconImg" 
                          src={this.renderIconImage(this.state.curImg)}
                    />
                  </div>
                </Modal>
        </div>
      )
  }
}
