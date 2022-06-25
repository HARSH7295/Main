import React from 'react'

const Footer = () => {
  return (
    <div className='footer'>
        <div className='f-col-1'>
            <img src="IMAGES/logo.png" alt='img not found' />
            <div className='links'>
                <p>Privacy Policy</p>
                <p>Faq</p>
                <p>Terms & Conditions</p>
                <p>Feedback</p>
            </div>
        </div>
        <div className='f-col-2'>
            <p>Phone No  : +91 9988776655</p>
            <p>Email add : pizzaplace2154@gmail.com</p>
            <p>Contact us on : </p>
            <div className='social' id="contact">
                <a href="https://www.facebook.com"><img src="IMAGES/ficon.png" alt='img not found' /></a>
                <a href="https://www.whatsapp.com"><img src="IMAGES/wicon.png" alt='img not found' /></a>
                <a href="https://www.instagram.com"><img src="IMAGES/iicon.png" alt='img not found' /></a>
                <a href="https://www.youtube.com"><img src="IMAGES/yicon.png" alt='img not found' /></a>
                
            </div>
        </div>
    </div>
  )
}

export default Footer