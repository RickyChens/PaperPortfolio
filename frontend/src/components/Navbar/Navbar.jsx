import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context/context';
import logo from '../../assets/Logo.png';
import { toast } from 'react-hot-toast'
import axios from 'axios'

import './Navbar.css';
{/* imports */}

const Main = () => {
  {/* useState hook creates state isDropDownOpen starting at false */}
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(); {/* uses useRef hook to create reference dropdownRef */}
  const { setIsLogin } = useContext(Context); {/* uses useContext to access setIsLogin from Context */}
  const { data } = useContext(Context)
  const { isLoggedIn, setLoggedIn, logoutUser } = useContext(Context) 
  const navigate = useNavigate(); {{/* hooks useNavigate to navigate */}}
  

  const logout = async () => {
    try {
      await axios.post('/logout');
      toast.success('Logged Out');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  {/* function to toggle dropdown visibilit */}
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); {/* Updates its state to the opposite of its value */}
  };

  {/* function to close dropdown if clicked outside */}
  const handleClickOutside = (event) => {
    {/* checks if reference to dropdown exists, and if clicked target is inside or not*/}
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false); {/* closes dropdown */}
    }
  };

  const handleLoginClick = () => {
    setIsLogin(true);  {/* calls setLogin with True */}
    navigate('/login'); {/* Routes to /login page */}
  };

  const handleRegisterClick = () => {
    setIsLogin(false);  {/* calls setLogin with False */}
    navigate('/login'); {/* Routes to /login page */}
  };

  const goHomepage = () => {
    navigate('/home');
  };

  const goStockpage = () => {
    navigate('/stocks');
  };

  const goGraphpage = () => {
    navigate('/graph');
  };

  const goProfile = () => {
    navigate('/profile');
  };

  useEffect(() => {
    {/* event listener for clicks outside dropdown */}
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      {/* cleans up event listener */}
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  {/* lots of garbage i didnt want to comment */}
  return (
    <div className="Main">
      {/* Header Section */}
      <header className="Header">
        <button className="Logo" onClick={goHomepage}><img src={logo}/></button>
        <div className="Top-Right-Container">
          <button className="Button" onClick={goStockpage}>Stock</button>
          <button className="Button" onClick={goGraphpage}>Trade</button>
          <div className="Profile-Section" ref={dropdownRef}>
            <div
              className="Profile-Icon"
              onClick={toggleDropdown}
              role="button"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              tabIndex="0"
            />
            {isDropdownOpen && (
              <div className="Dropdown">
                <p className='Username'>{data.user}</p>
                {isLoggedIn && <p className="Dropdown-Item Profile" onClick={goProfile}>Profile</p>}
                { isLoggedIn ? null : <p className="Dropdown-Item" onClick={handleLoginClick}>Login</p>}
                { isLoggedIn ? null : <p className="Dropdown-Item" onClick={handleRegisterClick}>Register</p>}
                <div className="gap"></div>
                {isLoggedIn && <p className="Dropdown-Item" onClick={ () => {
                  logout();
                  setLoggedIn(false);
                  logoutUser();
                  }}>Logout</p> }
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Main;