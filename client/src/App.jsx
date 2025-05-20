import './App.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import { Routes, Route } from 'react-router-dom'
import CatData from './components/catData'
import DogData from './components/dogData'
import Home from './components/Home'
import Footer from './components/Footer'
import Signin from './components/Singin'
import Signup from './components/Signup'
import { useEffect, useState } from 'react'
import { NavigationLogin, NavigationProfile } from './components/Navigation'
import Orders from './components/Orders'

function App() {
  const [isSignIn,setIsSignIn] = useState(()=>{
    return !!localStorage.getItem('token')
  });

  useEffect(()=>{
    if(!isSignIn) return localStorage.removeItem('token')
  },[isSignIn])

  return (
    <>
    {  isSignIn ? <NavigationProfile prop={setIsSignIn} /> : <NavigationLogin/>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="cat" element={<CatData/>} />
        <Route path="dog" element={<DogData />} />
        <Route path='orders' element={<Orders prop={isSignIn} />} />
        <Route path="login" element={<Signin prop={setIsSignIn} />} />
        <Route path="signup" element={<Signup/>} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App