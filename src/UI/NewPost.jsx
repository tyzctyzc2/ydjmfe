import React, { Component } from 'react';
import { Link } from "react-router-dom";

class NewPost extends Component {
    constructor(props){
        super(props)
        this.state={
            title_value:"",
            content_value:"",
            select_files:[],
            load_files:[]
        }
    }
    componentDidMount(){
        document.title = 'NEW+'
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
        //console.log(val.target.value)
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
            //console.log(reader.result)
            //console.log(dataOnly)
            cb(dataOnly)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }
    createNewPost(button) {
        console.log('will submit')
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
    }
    pushPostData() {
        var data = { 
            "title": this.state.title_value,
            "content": this.state.content_value,
            "files": this.state.load_files
        }
        console.log(data)
        fetch('http://192.168.0.100:808/api/post/create', {
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
    showTag() {

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
                <button className="bigButton rightDockButton" onClick={this.createNewPost.bind(this)} >PUSH</button>
                <button className="bigButton rightDockButton" onClick={this.showTag.bind(this)} >TAG</button>
                <input className="inputBox" type="file" id="file" multiple="multiple" name="file" onChange={(e) => this.fileListChange(e.target.files)} />
            </div>
        );
    }
}
export default NewPost;     