// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from "./logo.png";
import { useHistory } from "react-router-dom";


function Navigation({ isLoaded }) {
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);

  const handleClicker = () => {
    let path = `/`;
    history.push(path)
  }

  return (
    <ul>
      <div className="nav-container">
        <div className="logo-container">
          <img src={logo} alt="logo" width="30" height="30" onClick={() => handleClicker()} className='logo' />
          <NavLink exact to="/" id='QWERBNB'>
            <h2>QWERBNB</h2>
          </NavLink>
        </div>
        <div className='ProfileButton-button-container'>
          <div className='create-button-container'>
            {sessionUser !== null &&
              <NavLink exact to="/spots/new" className='create-new-spot-button'>Create a New Spot</NavLink>}
          </div>
          <div className="menu">
            {isLoaded && <ProfileButton user={sessionUser} id='QWERBNB' />}
          </div>
        </div>
      </div>

    </ul>
  );
}

export default Navigation;
