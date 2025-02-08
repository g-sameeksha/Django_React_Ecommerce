import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa6'

const Footer = () => {
  return (
   <>
        <footer className=' mt-5 text-white text-center py-2 position-fixed bottom-0 w-100' style={{backgroundColor:"#6050DC",color:'white'}}>
            <div className='container text-cnter'>
                <div className='mb-2'>
                    <a href="/" className='text-white text-decoration-none mx-2'>Home</a>
                    <a href="/" className='text-white text-decoration-none mx-2'>Shop</a>
                    <a href="/" className='text-white text-decoration-none mx-2'>About</a>
                    <a href="/" className='text-white text-decoration-none mx-2'>Contact</a>

                </div>
                <div className='mb-2'>
                <a href ="/" className='text-white mx-2'>< FaFacebook/></a>
                <a href ="/" className='text-white mx-2'>< FaTwitter/></a>
                <a href ="/" className='text-white mx-2'>< FaInstagram/></a>
                </div>
                <p className='small mb-0'>&copy; 2024 Shoopsy</p>
            </div>
        </footer>
   </>
  )
}

export default Footer