import React, {Component} from 'react';
import HomeComponent from './HomeComponent';
import SideNavComponent from './SideNavComponent';
import { BrowserRouter,Switch, Route} from 'react-router-dom';
import SettingComponent from './SettingComponent';



class MainComponent extends Component{
    

    render(){
        return(
            <div className='container main pt-5'>
                <div className='sidenav mt-5 box'>
                    <SideNavComponent/>
                </div>
                <BrowserRouter>
                    <Switch>
                        <Route exact path ='/' component = {HomeComponent}/>
                        <Route exact path ='/home' component = {HomeComponent}/>
                        <Route exact path ='/settings' component = {SettingComponent}/>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default MainComponent;