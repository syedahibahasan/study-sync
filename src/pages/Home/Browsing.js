import styles from './browsing.module.css'; // Import CSS module
import Footer from "../../components/footer/footer.js";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useauth"; // Import useAuth hook

const BrowsingPage = () => {
  const { user } = useAuth(); 
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.heroContainer}>
        <div className={styles.overlay} />

        <div className={styles.contentWrapper}>
          {/* Left Side: Text Content */}
          <div className={styles.heroContent}>
            <h1>Unlock the Future of Collaborative Learning</h1>
            <p>StudySync connects SJSU Spartans by matching study groups based on your preferred time and location.</p>
            <p>Join today to elevate your academic success with like-minded peers!</p>
            <div id="centerBody">
              {user ? (
                <>
                  {/* If the user is logged in, show Profile and Dashboard */}
                  <Link to="/profile" className={styles.customButton}>Profile</Link>
                  <Link to="/userdashboard" className={styles.customButton}>Dashboard</Link>
                </>
              ) : (
                <>
                  {/* If the user is not logged in, show Log In and Sign Up */}
                  <Link to="/login" className={styles.customButton}>Log In</Link>
                  <Link to="/register" className={styles.customButton}>Sign Up</Link>
                </>
              )}
            </div>
          </div>

          {/* Right Side: Image */}
          <div className={styles.imageContainer}>
            <img src="/thumbnail/Sammy.png" alt="Sammy" className={styles.sammyImage} />
          </div>
        </div>
      </div>

      {/* "How It Works" Section */}
      <div className={styles.howItWorksSection}>
        <div className={styles.stepsContainer}>
          {/* Step 1: Profile */}
          <div className={styles.step}>
            <h3 className={styles.stepHeading}>Create Your Profile</h3>
            <img src="/thumbnail/Profile.png" alt="Profile" className={styles.stepImage} />
            <div className={styles.stepContent}>
              <p>Sign up and add your courses, schedule, and preferred locations.</p>
            </div>
          </div>

          {/* Step 2: Dashboard */}
          <div className={styles.step}>
            <h3 className={styles.stepHeading}>Discover Study Groups & Collaborate</h3>
            <img src="/thumbnail/Dashboard.png" alt="Dashboard" className={styles.stepImage} />
            <div className={styles.stepContent}>
              <p>Explore available study groups that match your preferences.</p>
              <p>Connect with peers, chat, and achieve your academic goals together.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default BrowsingPage;
