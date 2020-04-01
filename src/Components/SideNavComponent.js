import React from 'react';
import { Nav, NavLink, NavItem } from 'reactstrap'

const SideNavComponent = () =>{
    return(
        <div className='container'>
            <Nav vertical>
                    <NavItem>
                        <NavLink className='btn btn-outline-primary' href='./home'>
                            Home
                        </NavLink>        
                    </NavItem>
                    <NavItem>
                        <NavLink className='btn btn-outline-primary' href='./settings'>
                            Settings
                        </NavLink>        
                    </NavItem>
                    <NavItem>
                        <NavLink className='btn btn-outline-primary' href='./profile'>
                            Profile
                        </NavLink>        
                    </NavItem>
            </Nav>
        </div>
    )
}

export default SideNavComponent