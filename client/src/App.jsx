import './App.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import { Routes, Route } from 'react-router-dom'
import CatData from './components/catData'
import DogData from './components/dogData'
import Home from './components/Home'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Signin from './components/Singin'
import Signup from './components/Signup'

function App() {

  return (
    <>
    <Navigation/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="cat" element={<CatData/>} />
        <Route path="dog" element={<DogData />} />
        <Route path="login" element={<Signin/>} />
        <Route path="signup" element={<Signup/>} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App