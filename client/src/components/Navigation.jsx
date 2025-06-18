import React from "react";
import "../componentsCss/navigation.css";
import { Link } from "react-router-dom";
import { CIcon } from "@coreui/icons-react";
import { cilDog, cilCat, cilUser } from "@coreui/icons";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; 

function NavigationLogin() {
  return (
    <div className="navigation">
      <div className="websiteName">
        <Link to="/">Petpals</Link>
      </div>
      <div className="iconsContent">
        <div className="dogIcon icon links">
          <Link to="dog">{<CIcon icon={cilDog} />}</Link>
        </div>
        <div className="catIcon icon links">
          <Link to="cat">{<CIcon icon={cilCat} />}</Link>
        </div>
        <div className="orders btn links">
          <Link to="orders">orders</Link>
        </div>
        <div className="singin btn links">
          <Link to="login">{<CIcon icon={cilUser} />}singin</Link>
        </div>
      </div>
    </div>
  );
}

function NavigationProfile({prop}) {

  const navigate = useNavigate();
  
  function handleLogOut(){
    localStorage.removeItem('token');
    prop(false)
    navigate('/')
  }

  return (
    <>
      <div className="navigation">
        <div className="websiteName">
          <Link to="/">Petpals</Link>
        </div>
        <div className="iconsContent">
          <div className="dogIcon icon links">
            <Link to="dog">{<CIcon icon={cilDog} />}</Link>
          </div>
          <div className="catIcon icon links">
            <Link to="cat">{<CIcon icon={cilCat} />}</Link>
          </div>
          <div className="orders btn links">
            <Link to="orders">orders</Link>
          </div>
          <div className="profile btn links">
            <Link to="">{<AccountCircleIcon />}Profile</Link>
            <div className="profileOptions">
              <div className="profileSettings option">
                <Link to="profileSettings">Settings</Link>
              </div>
              <div className="logout option">
                <Button onClick={handleLogOut} >Logout</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { NavigationLogin, NavigationProfile };
