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
          Study Sync is an online platform designed to help 
            <br></br>
            SJSU students easily connect with peers who share the same 
            <br></br>
            course, schedule, and location preferences.
            <br></br>
            By streamlining the process of forming and joining study 
            <br></br>
            groups, Study Sync offers a convenient and efficient way 
            <br></br>
            for students to collaborate, fostering a collaborative 
            <br></br>
            learning environment with just a few clicks.
          </p>
          <br></br>
          <p>Website Developed By: Alan, Hiba, Jeremy, James</p>
        </div>
      </div>
    </div>
  );
};

export default About;
