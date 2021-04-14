import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Modal, Button } from 'antd';
import { Checkbox, Divider } from 'antd';
import '../App.css';
import 'antd/dist/antd.css';
import {getTagList} from '../data/api'
import '../config';

class NewPost extends Component {
    constructor(props){
        super(props)
        this.state={
            title_value:"",
            content_value:"",
            select_files:[],
            load_files:[],
            isModalVisible:false,
            tagList:[{tagId: 2, tagName: "香山"},{tagId: 2, tagName: "香山"}],
            tagOptions:[
                { label: 'Apple', value: '1' },
                { label: 'Pear', value: '2' },
                { label: 'Orange', value: '3' },
              ],
            pickedTags:[],
            pickedTagPostData:[],
            pickedTagText: "---"
        }
    }
    componentDidMount(){
        document.title = 'NEW+'
        getTagList(this.tagListLoaded)
    }
    titleInputChange(val){
        this.setState({
            title_value:val.target.value
        })
    }
    contentInputChange(val){
        this.setState({
            content_value:val.target.value
        })
    }
    fileListChange(val){
        console.log(val)
        this.setState({
            select_files:val,
            load_files:[]
        })
    }
    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            let dataOnly = reader.result.substring(reader.result.indexOf("base64,")+7)
            cb(dataOnly)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }
    createNewPost(button) {
        console.log('will submit')
        if (this.state.select_files.length > 0) {
            for (var i = 0; i < this.state.select_files.length; i++) { 
                var curFile = this.state.select_files[i]
                console.log(curFile.name)
                this.getBase64(curFile, fileString => {
                    var thisObj = {
                        "fileType": curFile.name.substring(curFile.name.length - 3),
                        "fileBody": fileString
                    }
                    this.state.load_files.push(thisObj)
                    if (this.state.load_files.length == this.state.select_files.length) {
                        this.pushPostData()
                    }
                })
            }
        } else {
            this.pushPostData()
        }
    }
    pushPostData() {
        var data = { 
            "title": this.state.title_value,
            "content": this.state.content_value,
            "files": this.state.load_files,
            "tags": this.state.pickedTagPostData
        }
        console.log(data)
        fetch(global.constants.website + 'api/post/create', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.success != undefined && data.success == true) {
                console.log('submit success!!!')
                this.setState({
                    title_value:"",
                    content_value:""
                })
            }
        })
    }
    tagDialogShow() {
        this.setState({
            isModalVisible:true
        })
    }
    tagDialogPicked() {
        this.setState({
            isModalVisible:false
        })
        console.log('closed = ', this.state.pickedTags);
        var pickTagData = []
        var tagsText = " "
        for(let i = 0; i < this.state.tagList.length; i++) {
            var curTag = this.state.tagList[i]
            if (this.state.pickedTags.includes(curTag.tagId)) {
                pickTagData.push(curTag)
                tagsText = tagsText + curTag.tagName + ","
            }
        }
        console.log('closed 2 = ', pickTagData);
        this.setState({
            pickedTagPostData:pickTagData,
            pickedTagText:tagsText
        })
    }
    tagListLoaded = tagsData => {
        this.setState({
            tagList:tagsData
        })
        var tagOpt = []
        for(let i = 0; i < tagsData.length; i++) {
            tagOpt.push({label: tagsData[i].tagName, value: tagsData[i].tagId})
        }
        this.setState({
            tagOptions:tagOpt
        })
    }
    onChange(checkedValues) {
        this.setState({
            pickedTags:checkedValues
        })
      }
    render() {
        return (
            <div>
                <input className="inputBox" type="text" value={this.state.title_value} onChange={this.titleInputChange.bind(this)}/>
                <br/>
                <br/>
                <textarea  className="inputBox CanNotResize"  rows="30" value={this.state.content_value } onChange={this.contentInputChange.bind(this)}></textarea>
                <br/>
                <br/>
                <p className="inputBox">{this.state.pickedTagText}</p>
                <button className="bigButton rightDockButton" onClick={this.createNewPost.bind(this)} >PUSH</button>
                <button className="bigButton rightDockButton" onClick={this.tagDialogShow.bind(this)} >TAG</button>
                <input className="inputBox" type="file" id="file" multiple="multiple" name="file" onChange={(e) => this.fileListChange(e.target.files)} />
                <>
                <Modal title="TAG" visible={this.state.isModalVisible}
                onCancel={()=>{this.setState({
                    isModalVisible:false
                })}}
                footer={[
                    <Button key="tagDialogPick" type="primary" onClick={()=>{this.tagDialogPicked()}}>
                      OK
                    </Button>,
                    <Button key="tagDialogCancle" onClick={()=>{this.setState({
                        isModalVisible:false
                    })}}>
                      Cancel
                    </Button>,
                  ]}
                >
                    <Checkbox.Group options={this.state.tagOptions} defaultValue={[]} onChange={this.onChange.bind(this)}></Checkbox.Group>
                </Modal>
                </>
            </div>
            
        );
    }
}
export default NewPost;     