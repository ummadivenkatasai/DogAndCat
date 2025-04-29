import './App.css'
import { Routes, Route } from 'react-router-dom'
import CatData from './components/catData'
import DogData from './components/dogData'
import Home from './components/Home'
import Navigation from './components/Navigation'

function App() {

  return (
    <>
    <Navigation/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='cat' element={<CatData/>} />
        <Route path="dog" element={<DogData />} />
      </Routes>
    </>
  )
}

export default App