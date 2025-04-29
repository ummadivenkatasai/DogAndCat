import React from 'react'
import '../componentsCss/navigation.css'
import { Link } from 'react-router-dom'
import { CIcon } from '@coreui/icons-react';
import { cilDog, cilCat } from '@coreui/icons'

function Navigation() {
  return (
    <div className='navigation' >
      <div className="websiteName">
        <Link to='/' >DOG&CAT</Link>
      </div>
      <div className="iconsContent">
      <div className="dogIcon icon">
        <Link to="dog">{<CIcon icon={cilDog} />}</Link>
      </div>
      <div className="catIcon icon">
        <Link to="cat">{< CIcon icon={cilCat} />}</Link>
      </div>
      <div className="orders">
        <Link to="orders">orders</Link>
      </div>
      <div className="singin">
        <Link to="login">SingIn</Link>
      </div>
      </div>
    </div>
  )
}

export default Navigation
