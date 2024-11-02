
import './App.css'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/NavBar'
import 'bootstrap/dist/css/bootstrap.min.css';
import CookieConsent from './components/CookieConsent.jsx';


function App() {
  
  return (
    <>
    <Navbar/>
    <Outlet/>
    <CookieConsent/> 
    <Footer/>
    </>
  )
}

export default App
