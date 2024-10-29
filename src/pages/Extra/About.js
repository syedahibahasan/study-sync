import React from "react";
import "../Extra/About.css";

const About = () => {
  return (
    <div className="wholeaboutpage">
      <div className="about-us-container">
        <head>
          <link
            href="https://fonts.googleapis.com/css?family=Cabin"
            rel="stylesheet"
          ></link>
        </head>

        <h1 id="title">About Us</h1>
        <div className="info">
          <p>
            "OFS" (Online Food Store) aims to establish an online platform to
            <br></br>
            conveniently allow customers to purchase organic grocery items
            through a<br></br>
            digital payment process. OFS aims to serve customers located within
            <br></br>
            delivery distance around downtown San Jose. Customers should have a
            <br></br>
            pleasant shopping experience where they can see what grocery items
            are
            <br></br>
            available, add them to a virtual cart, have a secure payment
            process,
            <br></br>
            and receive their groceries delivered to their home.
          </p>
          <br></br>
          <p>Website Developed By: Alan, Connie, Hiba, Tanya, Phuc</p>
        </div>
      </div>
    </div>
  );
};

export default About;
