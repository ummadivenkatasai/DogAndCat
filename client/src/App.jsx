import './App.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { NavigationLogin, NavigationProfile } from './components/Navigation'
import Home from './components/Home'
import DogData from './components/dogData'
import DogContent from './components/DogContent'
import CatData from './components/catData'
import Orders from './components/Orders'
import Signup from './components/Signup'
import Signin from './components/Singin'
import Footer from './components/Footer'

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
        <Route path='dog/:_id' element={<DogContent/>} />
        <Route path='orders' element={<Orders prop={isSignIn} />} />
        <Route path="login" element={<Signin prop={setIsSignIn} />} />
        <Route path="signup" element={<Signup/>} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App