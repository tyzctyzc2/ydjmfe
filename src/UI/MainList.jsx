import { Modal, Button } from 'antd';
import '../App.css';
import React, { Component } from 'react';
import '../config';
import {renderIconImage} from '../data/api'
import {handleZoom} from '../data/api'

let currentPage = 0;
let inLoading = false;
let currentSelection = "全部";

export default class MainList extends React.Component{

  constructor(){
      super();
      this.state = {
          banners: [''],
          isModalVisible:false,
          curImg: null,
          searchText: ''
      }
  }

  // get data when load
  componentDidMount(){
      document.title = 'POST'
      this.loadFirstPageData()
      document.addEventListener('scroll', this.trackScrolling);
  }

  loadFirstPageData() {
    currentPage = 0

    fetch(this.getCurrentUrl())
      .then(res => res.json())
      .then(data => {
        console.log(data);
          this.setState({
              banners:data
          })
    })
  }

  getCurrentUrl() {
    if (this.state.searchText.length > 0) {
      return global.constants.website + "api/post/list/find?page=" + currentPage + "&keyword=" + this.state.searchText
    } else {
      return global.constants.website + "api/post/list?page=" + currentPage
    }
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

  searchTextChange(val) {
    this.setState({
      searchText:val.target.value
    })
  }

  doSearch() {
    console.log(this.state.searchText)
    if (this.state.searchText.length ==0) {
      return
    }
    this.loadFirstPageData()
  }

  searchBoxKeyDown() {
    if(window.event.keyCode === 13){
      this.doSearch()
    }
  }

  showAllPost() {
    console.log('cancle search')
    this.setState({
      searchText:''
    })
    currentPage = 0
    this.setState({searchText:''}, ()=> {
      this.loadFirstPageData()
     });
  }

  render(){
      return(
        <div>
          <div id="list_root">
            <div className="oneLine2">
              <input className="inputBox oneLine" type="text" value={this.state.searchText} 
              onKeyDown={this.searchBoxKeyDown.bind(this)}
              onChange={this.searchTextChange.bind(this)}/>
              <button className="bigButton rightDockButton" onClick={this.doSearch.bind(this)} >Search</button>
            </div>
            <h1 onClick={() => this.showAllPost()}>{currentSelection}</h1>
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
                                        src={renderIconImage(file)}
                                        onClick={()=>{this.setState({isModalVisible:true, curImg:file})}}
                                  />: ''
                                }
                                {
                                  file.fileType == 'mov' ?
                                  <video id="video"  width="640" height="480" muted controls autoPlay="autoPlay" preload="auto" loop="loop" >
                                    <source src={renderIconImage(file)} />
                                  </video>: ''
                                }
                                {
                                  file.fileType == 'pdf' ?
                                  <embed src={renderIconImage(file)} type="application/pdf" width="80%" height="700" />:''
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
          <Modal  fullScreen title="ZOOM" visible={this.state.isModalVisible}
                onCancel={()=>{this.setState({
                    isModalVisible:false
                })}}
                footer={[
                   
                  ]}
                >
                  <div onWheel={handleZoom}>
                    <img  className = "iconImg" 
                          src={renderIconImage(this.state.curImg)}
                    />
                  </div>
                </Modal>
        </div>
      )
  }
}
