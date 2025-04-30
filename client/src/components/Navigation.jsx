import React from 'react'
import '../componentsCss/navigation.css'
import { Link } from 'react-router-dom'
import { CIcon } from '@coreui/icons-react';
import { cilDog, cilCat, cilUser } from '@coreui/icons'

function Navigation() {
  return (
    <div className='navigation' >
      <div className="websiteName">
        <Link to='/' >Petpals</Link>
      </div>
      <div className="iconsContent">
      <div className="dogIcon icon links">
        <Link to="dog">{<CIcon icon={cilDog} />}</Link>
      </div>
      <div className="catIcon icon links">
        <Link to="cat">{< CIcon icon={cilCat} />}</Link>
      </div>
      <div className="orders btn links">
        <Link to="orders">orders</Link>
      </div>
      <div className="singin btn links">
        <Link to="login">{< CIcon icon={cilUser} />}singin</Link>
      </div>
      </div>
    </div>
  )
}

export default Navigation
