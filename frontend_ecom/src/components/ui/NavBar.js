import React from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import { Link }  from 'react-router-dom';
import NavBarLink from './NavBarLink';
import styles from './NavBar.module.css'


const NavBar = ({numCartItem}) => { 
  return (
  <>
  <nav className="navbar navbar-expand-lg shadow" data-bs-theme="dark" style={{color:"black",backgroundColor:"white"}} >
  <div className="container-fluid" >
    <Link className="navbar-brand" style={{color:"black"}} to="/">E_Commerce</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarColor01">
    <NavBarLink/>
    <Link to="/cart" className={`btn btn-dark ms-3 rounded-pill position-relative ${styles.responsiveCart}`} >
    <FaCartShopping/></Link>
    
     {numCartItem === 0 || 
     <span
     className={`'position-absolute top-0 start-100 translate-middle badge rounded-pill' ${styles.stickyNavbar}`}
     style={{fontSize:'0.85rem',padding:'0.5em 0.65em',backgroundColor:'#6050DC'}}
    >{numCartItem}</span>}
    </div>
  </div>
</nav>
</>
  )
}

export default NavBar