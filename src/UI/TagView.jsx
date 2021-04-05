import React, { Component } from 'react';
import { Link } from "react-router-dom";

class TagView extends Component {
    constructor(props){
        super(props)
        this.state = {
            tags: ['']
        }
    }
    componentDidMount(){
        document.title = 'TAG'
        fetch("http://192.168.0.100:8080/ydjm/api/tag/list")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.setState({
                tags:data
            })
        })
    }
    render() {
        return (
            <div>
                {
                    this.state.tags.map((tag,index) =>{
                        return (
                            <ul key = {index}>
                                <h3>{tag.tagName}</h3>
                            </ul>
                        )
                    })
                }
            </div>
        );
    }
}
export default TagView;     