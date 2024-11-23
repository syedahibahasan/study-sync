import { Link, Navigate, useMatch, useResolvedPath } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../navbar/navbar.css";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useauth.js";
import SearchBar from "../Search/search";

const Navbar = () => {
  const { user, logout} = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  <html>
    <head>
      <link
        href="https://fonts.googleapis.com/css?family=Cabin"
        rel="stylesheet"
      ></link>
    </head>
  </html>;

  return (
    <div className="wholenavbar">
      <nav className="navbar">
        <CustomLink className="headers" to="/">
          <img src="/thumbnail/StudySyncTransparent.png" alt="Home Page" className="logo" />
        </CustomLink>
        {/* <Link to="/" className="store-name">
          StudySync
        </Link> */}
            <div className="search-bar">
          <SearchBar />
          {/*add searchbar component here*/}
        </div>
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <div className="sidebar-content">
            <p className="side-bar-name">Menu</p>
            <div className="cont">
              <CustomLink className="contentin" to="/">
                Home
              </CustomLink>
              {user ? (
                <>
                  <div className="logout-container">
                    <CustomLink
                      href="#"
                      onClick={handleLogout}
                      className="contentin logout"
                      to="/"
                    >
                      Logout
                    </CustomLink>
                  </div>
                </>
              ) : (
                <CustomLink className="contentin" to="/login">
                  Login
                </CustomLink>
              )}
              {/* Show About and Contact for non-admins */}
              {!user?.isAdmin && (
                <>
                  <CustomLink className="contentin" to="/About">
                    About
                  </CustomLink>
                  <CustomLink className="contentin" to="/Contact">
                    Contact
                  </CustomLink>
                </>
              )}
            </div>
          </div>
        </div>

        <ul className="navigation-links">
          <div className="sidebar-toggle" onClick={toggleMenu} ref={menuRef}>
            <div className="hamicon">&#8801; </div>
            {/* Unicode hamburger icon */}
          </div>
          <div className="loginbutton">
            {user ? (
              <CustomLink className="headers" to="/profile">
                {user.username}
              </CustomLink>
            ) : (
              <CustomLink className="headers" to="/login">
                Login
              </CustomLink>
            )}
          </div>
        </ul>
      </nav>
    </div>
  );
};

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? " active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;
