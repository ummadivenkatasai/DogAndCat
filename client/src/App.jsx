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
import PageNotFound from './components/Page'
import CatContent from './components/CatContent'
import AddToCart from './components/AddToCart'
import WishlistData from './components/WishlistData'
import Checkout from './components/Checkout'



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
        <Route path='dog/:_id' element={<DogContent isAuthenticated={isSignIn}  />} /> 
        <Route path='cat/:_id' element={<CatContent isAuthenticated={isSignIn}  />} /> 
        <Route path='orders' element={<Orders isAuthenticated={isSignIn} />} />
        <Route path='wishlist' element={<WishlistData isAuthenticated={isSignIn} />} />
        <Route path='cart' element={<AddToCart isAuthenticated={isSignIn}  />} />
        <Route path='checkout' element={<Checkout/>} />
        <Route path="login" element={<Signin prop={setIsSignIn} />} />
        <Route path="signup" element={<Signup/>} />
        <Route path='*' element={<PageNotFound/>} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App