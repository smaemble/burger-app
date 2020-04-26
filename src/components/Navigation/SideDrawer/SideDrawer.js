import React from 'react';

import classes from './SideDrawer.module.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Logo from '../../Logo/Logo';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Aux/Aux';


const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if(props.opened){
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    console.log(props.opened, attachedClasses.join(' '));
    return (
        <Aux>
            <Backdrop show={props.opened} clicked={props.closed}/>
            <div className={ attachedClasses.join(' ')} >
                <div className={classes.Logo}>
                    <Logo/>
                </div>
                <nav>
                    <NavigationItems/>
                </nav>
            </div>
        </Aux>
    );
}

export default sideDrawer;