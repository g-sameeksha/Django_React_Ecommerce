import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { FaCartShopping } from 'react-icons/fa6'
import { Link }  from 'react-router-dom';
import styles from './NavBar.module.css'

const NavBarLink = () => {
  const { isAuthenticated, user, handleLogout } = useContext(AuthContext);
  const numCartItem = 3;

  function logout() {
    handleLogout();
    toast.success("Logged out!");
  }

  return (
    <>
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        {isAuthenticated ? (
          <>
            <li className="nav-item mx-2">
              <NavLink
                to="/profile"
                className={({ isActive }) => isActive ? "nav-link active fw-semibold" : "nav-link"}
                end
                style={{ color: "black" }}
              >
                Hi, {user ? user.username : "sam"}
              </NavLink>
            </li>
            <li className="nav-item mx-2">
              <button onClick={logout} className="nav-link btn btn-link" style={{ color: "black" }}>
                Logout
              </button>
            </li>
            {user?.user_type === "customer" && (
              <li className="nav-item mx-2">
                <Link to="/cart" className={`btn btn-dark ms-3 rounded-pill position-relative ${styles.responsiveCart}`}>
                  <FaCartShopping />
                </Link>
                {numCartItem > 0 && (
                  <span
                    className={`position-absolute  start-99 translate-middle badge rounded-pill ${styles.stickyNavbar}`}
                    style={{ fontSize: "0.85rem", padding: "0.6em 0.65em", backgroundColor: "#6050DC" }}
                  >
                    {numCartItem}
                  </span>
                )}
              </li>
            )}

            {user?.user_type === "vendor" && (
              <>
                <li className="nav-item mx-2">
                  <NavLink
                    to="/vendor_dashboard"
                    className={({ isActive }) => isActive ? "nav-link active fw-semibold" : "nav-link"}
                    end
                    style={{ color: "black" }}
                  >
                    Vendor Dashboard
                  </NavLink>
                </li>
                <li className="nav-item mx-2">
                  <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? "nav-link active fw-semibold" : "nav-link"}
                    end
                    style={{ color: "black" }}
                  >
                    Website Page
                  </NavLink>
                </li>
                <li className="nav-item mx-2">
                  <NavLink
                    to="/add_product"
                    className={({ isActive }) => isActive ? "nav-link active fw-semibold" : "nav-link"}
                    end
                    style={{ color: "black" }}
                  >
                    Add Product
                  </NavLink>
                </li>
              </>
            )}
          </>
        ) : (
          <>
            <li className="nav-item mx-2">
              <NavLink
                to="/login"
                className={({ isActive }) => isActive ? "nav-link active fw-semibold" : "nav-link"}
                end
                style={{ color: "black" }}
              >
                Login
              </NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink
                to="/register"
                className={({ isActive }) => isActive ? "nav-link active fw-semibold" : "nav-link"}
                end
                style={{ color: "black" }}
              >
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </>
  );
};

export default NavBarLink;
