import { React, useEffect } from 'react';
import Main from '../../components/Navbar/Navbar';
import { motion } from 'framer-motion';
import stock from '../../assets/homepageImage1.png';
import display from '../../assets/homepageImage2.png';
import us from '../../assets/us.png';

import './Home.css';

const Home = () => {
  useEffect(() => {
    const mouseMove = e => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <div className='Home-Container'>
      <div className="navbar">
        <Main />
      </div>
      <div className='introduction'>
        <div className="text">
          <motion.h1 
            initial={{opacity: 0, y: -50}}
            whileInView={{opacity: 1, y: 0, transition: {delay: 0.2, duration: 0.5}}}
            viewport={{once: false, amount: 0.5}}
          >
            Paper Portfolio
          </motion.h1>
          <motion.p
            initial={{opacity: 0, y: -50}}
            whileInView={{opacity: 1, y: 0, transition: {delay: 0.2, duration: 0.5}}}
            viewport={{once: false, amount: 0.5}}
          >
            Paper Portfolio is a mock trading website designed to allow people who are new or amateur to the stock market to practice without actual monetary loss. It provides a risk free environment for users to test their strategies and see how the market works.
          </motion.p>
          <br />
          <motion.p
            initial={{opacity: 0, y: -50}}
            whileInView={{opacity: 1, y: 0, transition: {delay: 0.2, duration: 0.5}}}
            viewport={{once: false, amount: 0.5}}
          >
            Users can simulate buying and selling stocks, tracking their portfolio, and learn how the market acts in real time without risking their savings. 
          </motion.p>
        </div>
        <motion.div
          initial={{opacity: 0, x: 75}}
          whileInView={{opacity: 1, x: 0, transition: {delay: 0.2, duration: 0.5}}}
          viewport={{once: false, amount: 0.5}} 
          className="image"
        >
          <img src={stock} alt="Stock" />
        </motion.div>
      </div>
      <div className="information">
        <motion.div 
          initial={{opacity: 0, y: -50}}
          whileInView={{opacity: 1, y: 0, transition: {delay: 0.2, duration: 0.5}}}
          viewport={{once: false, amount: 0.5}}
          className="text"
        >
          <h1>Information</h1>
          <p>
            Paper Portfolio was created as a capstone project for a bachelors degree in Computer and Information Science at SUNY Polytechnic Institute. It was created with the goal of expanding our knowledge on webdevelopment and webscraping.
          </p>
          <br/>
          <p>
            It was created with MERN stack, MongoDB, Express, React, and Node.js. The webscraping side was done in Python with BeautifulSoup4 and Selenium. The website currently utilizes webscraping for all of its data, including the real time prices you get looking at a page. It was completed by a team of two over the course of a semester.        
            </p>
        </motion.div>
        <motion.div 
          initial={{opacity: 0, x: -75}}
          whileInView={{opacity: 1, x: 0, transition: {delay: 0.2, duration: 0.5}}}
          viewport={{once: false, amount: 0.5}}
          className="image"
        >
          <img src={display} alt="Display" />
        </motion.div>
      </div>
      <div className="contact">
        <motion.div 
          initial={{opacity: 0, y: -50}}
          whileInView={{opacity: 1, y: 0, transition: {delay: 0.2, duration: 0.5}}}
          viewport={{once: false, amount: 0.5}}
          className="text"
        >
          <h1>Contact Us</h1>
          <p>
            If you have any questions or need more information, feel free to reach out to us:
          </p>
          <div className="contact-info">
            <p>
              <strong>Email:</strong>
              <br />
              <a href="mailto:mcgiveh@sunypoly.edu">mcgiveh@sunypoly.edu</a>
              <br />
              <a href="mailto:chenr@sunypoly.edu">chenr@sunypoly.edu</a>
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{opacity: 0, x: 75}}
          whileInView={{opacity: 1, x: 0, transition: {delay: 0.2, duration: 0.5}}}
          viewport={{once: false, amount: 0.5}}
          className="image"
        >
          <img src={us} alt="Contact Stock" />
        </motion.div>
      </div>
      <div className="cursor"></div>
    </div>
  );
};

export default Home;
