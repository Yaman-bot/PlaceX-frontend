import React,{useState} from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import './MainNavigation.css';
import Backdrop from '../UIElements/Backdrop';

const MainNavigation = props => {
    const [drawerisOpen,setDrawer]=useState(false)

    const toggleDrawerHandler=()=>{
        setDrawer(!drawerisOpen)
    }

    return (
        <React.Fragment>
            {drawerisOpen ? <Backdrop onClick={toggleDrawerHandler}/> : null}
            <SideDrawer show={drawerisOpen} onClick={toggleDrawerHandler}>
                <nav className="main-navigation__drawer-nav">
                <NavLinks />
                </nav>
            </SideDrawer>
            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={toggleDrawerHandler}>
                <span />
                <span />
                <span />
                </button>
                <h1 className="main-navigation__title">
                <Link to="/">PlaceX</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                <NavLinks />
                </nav>
            </MainHeader>
        </React.Fragment>
    );
};

export default MainNavigation;
