import React from "react";
import "../footer/footer.css";

const Footer = () => {
  return (
    <div className="footer-container">
      {/* Logo Section */}
      <div className="footer-logo">
        <img
          src="/thumbnail/spartanlogo.png"
          alt="SJSU Logo"
          className="footer-logo-image"
        />
      </div>
      {/* Social and Text Section */}
      <div className="footer-section">
        <p className="title">San Jose State University</p>
        <div className="social-icons">
        <a
            href="https://www.instagram.com/sjsu/"
            target="_blank"
            rel="noopener noreferrer"
          >
          <img
            src="/socialmedia/instagram.png"
            alt="Instagram"
            className="social-icon"
          />
          </a>
          <a
            href="https://twitter.com/SJSU"
            target="_blank"
            rel="noopener noreferrer"
          > 
          <img
            src="/socialmedia/twitter.png"
            alt="Twitter"
            className="social-icon"
          />
          </a>
          <a
            href="https://www.facebook.com/sanjosestate/"
            target="_blank"
            rel="noopener noreferrer"
          >
          <img
            src="/socialmedia/facebook.png"
            alt="Facebook"
            className="social-icon"
          />
          </a>
        </div>
      </div>
    </div>

  );
};

export default Footer;
