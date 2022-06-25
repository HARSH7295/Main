import {React,useEffect, useState} from 'react'
import Navbar from './Navbar'
import Menu from './Menu'
import Footer from './Footer'
import { useNavigate } from 'react-router-dom'
const HomePage = () => {

  const [user,setUser] = useState(localStorage.getItem('userid'))
  const [orderid,setOrderId] = useState(localStorage.getItem('orderid'))

  let navigate = useNavigate()

  useEffect(()=>{
    if(user === null || orderid === null){
      alert('Not logged in...,Please Login First')
      navigate('/')
    }
  },[])

  return (
    <div className='home-page'>
        <Navbar />
        <div className='top-img'>
            <h1>We Offer You an Unforgettable Experience</h1>
            
            <a href='#menu'>Order Now</a>
        </div>
        <Menu />
        <Footer />
    </div>
  )
}

export default HomePage