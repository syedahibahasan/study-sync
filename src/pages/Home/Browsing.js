import React from 'react';
import styles from './browsing.module.css'; // Import CSS module

const BrowsingPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.heroContainer}>
        <video autoPlay muted loop className={styles.backgroundVideo}>
          <source src="/business_stock_video.mp4" type="video/mp4" />
        </video>
        
        <div className={styles.overlay} />
        
        <div className={styles.heroContent}>
          <h1>Welcome to StudySync</h1>
          <p>Find study buddies today!</p>
          <div id="centerBody">
            <a href="/login/" className={styles.customButton}>Login</a>
            <a href="/register/" className={styles.customButton}>Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsingPage;
