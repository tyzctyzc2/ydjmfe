import NewPost from '../UI/NewPost';
import React from 'react';
import {Router,Route,Switch,Redirect} from 'react-router-dom';
import { createHashHistory } from "history";
const history = createHashHistory();

class RouterConfig extends React.Component{
    render(){
        return(
            <Router history={history}>
                <Switch>
                    <Route path='/' exact render={()=>(
                        <Redirect to='/'/>
                    )}/>
                    <Route path='/new' component={NewPost}/>
                </Switch>
            </Router>
        )
    }
}
export default RouterConfig;