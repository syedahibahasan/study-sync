import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { UserRound } from "lucide-react";
import "../navbar/navbar.css";
import { useAuth } from "../../hooks/useauth";
import SearchBar from "../Search/search";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close the sidebar
  };

  return (
    <div className="wholenavbar">
      <nav className="navbar">
        <CustomLink className="headers" to={user ? "/userdashboard" : "/login"}>
          <img
            src="/thumbnail/StudySyncTransparent.png"
            alt="Home Page"
            className="logo"
          />
        </CustomLink>
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          {/* Clicking empty space on sidebar will trigger closeMenu, but links work */}
        {isOpen && <div className="overlay" onClick={closeMenu}></div>}
          <div className="sidebar-content">
            <p className="side-bar-name">Menu</p>
            <div className="cont">
              <CustomLink className="contentin" to="/" onClick={toggleMenu}>
                Home
              </CustomLink>
              {user ? (
                <div className="logout-container">
                  <CustomLink
                    className="contentin"
                    to="/profile"
                    onClick={toggleMenu}
                  >
                    Profile
                  </CustomLink>
                  <CustomLink
                    className="contentin"
                    to="/userdashboard"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </CustomLink>
                  <CustomLink
                    className="contentin logout"
                    onClick={handleLogout}
                  >
                    Logout
                    </CustomLink>
                </div>
              ) : (
                <CustomLink className="contentin" to="/login" onClick={toggleMenu}>
                  Login
                </CustomLink>
              )}
              {!user?.isAdmin && (
                <>
                  <CustomLink
                    className="contentin"
                    to="/about"
                    onClick={toggleMenu}
                  >
                    About
                  </CustomLink>
                  <CustomLink
                    className="contentin"
                    to="/contact"
                    onClick={toggleMenu}
                  >
                    Contact
                  </CustomLink>
                </>
              )}
            </div>
          </div>
        </div>
        <ul className="navigation-links">
          <div className="sidebar-toggle" onClick={toggleMenu}>
            <div className="hamicon">&#8801;</div>
          </div>
          <div className="loginbutton">
          {user ? (
            <CustomLink className="headers" to="/profile">
              <button className="profile-button">
                <UserRound />
              </button>
              <span>{user.username}</span> {/* Display the username */}
            </CustomLink>
          ) : (
            <CustomLink className="headers" to="/login">
               <button className="profile-button">
                <UserRound />
              </button>
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
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;
