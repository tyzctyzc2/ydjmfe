import { Modal, Button } from 'antd';
import React, { Component } from 'react';
import '../App.css';
import { Link } from "react-router-dom";
import '../config';
import {renderIconImage} from '../data/api'
import {handleZoom} from '../data/api'

let inLoading = false;
class TagView extends Component {
    constructor(props){
        super(props)
        this.state = {
            tags: [''],
            pickedTag:'',
            loadedPost:[],
            myPageNo:0,
            isModalVisible:false,
            curImg: null
        }
    }
    componentDidMount(){
        document.title = 'TAG'
        fetch(global.constants.website + "api/tag/list")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.setState({
                tags:data
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
      let tryPage = this.state.myPageNo + 1;
      let url = global.constants.website + "api/post/list/tag?page=" + tryPage + "&tag=" + this.state.pickedTag.tagName;
      console.log(url);
      fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            inLoading = false;
            if (data != null && data.length > 0) {
              this.setState({
                myPageNo:tryPage
              })
            } else {
              return;
            }
            this.setState({
                loadedPost:this.state.loadedPost.concat(data)
            })
        })
    }
    loadPickedData(tag) {
        if (inLoading) {
          return;
        }
        inLoading = true;
        let url = global.constants.website + "api/post/list/tag?page=0&tag=" + tag.tagName;
        console.log(url);
        fetch(url)
          .then(res => res.json())
          .then(data => {
              console.log(data)
              inLoading = false;
              this.setState({
                myPageNo:0
              })
              this.setState({
                loadedPost:data
              })
          })
      }
    tagPicked(tag) {
        console.log(tag)
        this.setState({
            pickedTag:tag
          })
        this.loadPickedData(tag)
    }
    render() {
        return (
            <div>
                <div>
                    {
                        this.state.tags.map((tag,index) =>{
                            return (
                                <div className="oneLine" key = {index}>
                                    <h3 onClick={() => this.tagPicked(tag)}>{tag.tagName}&nbsp;&nbsp;&nbsp;</h3>
                                </div>
                            )
                        })
                    }
                </div>
                <div id="list_root">
                    <h1>{this.state.pickedTag.tagName}</h1>
                    {
                        this.state.loadedPost.map((element,index) =>{
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
                                    >{tag}</div>
                                    )
                                })
                                }
                            </div>
                            <pre>{element.content}</pre>
                            <div>
                                {
                                element.files && element.files.map((file, ii) =>{
                                    return(
                                    <div key = {ii} className="fullLine">
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
        );
    }
}
export default TagView;     