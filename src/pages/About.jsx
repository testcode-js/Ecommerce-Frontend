import React from 'react';

const About = () => {
  return (
    <>
      <div className="about-container">
        <div className="about-title">About Us</div>
        
        <div className="about-section">
          <p>Welcome to <strong>Flipkart</strong>, your trusted destination for quality products at affordable prices. Founded in 2023, we aim to make online shopping easier, faster, and more enjoyable for everyone.</p>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>We are committed to offering the best selection of products—from fashion and electronics to home goods and more—all in one place. Our mission is to provide a seamless shopping experience backed by excellent customer service.</p>
        </div>

        <div className="about-section">
          <h2>Why Shop With Us?</h2>
          <ul className="about-list">
            <li>Wide range of high-quality products</li>
            <li>Fast and reliable shipping</li>
            <li>Secure payment methods</li>
            <li>24/7 customer support</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Our Team</h2>
          <p>Behind YourStore is a passionate team of professionals who work hard every day to ensure you get the best deals and the best service possible.</p>
        </div>
      </div>

      <style>{`
        .about-container {
          padding: 2rem 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .about-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          text-align: center;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          padding: 1rem 2rem;
          border-radius: 12px;
          display: inline-block;
        }

        .about-section {
          background: #ffffff;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
          transition: transform 0.3s ease;
        }

        .about-section:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .about-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .about-section p {
          font-size: 1rem;
          line-height: 1.6;
          color: #64748b;
          margin-bottom: 1rem;
        }

        .about-list {
          list-style: none;
          padding: 0;
        }

        .about-list li {
          font-size: 1rem;
          color: #64748b;
          padding: 0.75rem 0;
          border-left: 3px solid #667eea;
          margin-bottom: 0.5rem;
          transition: transform 0.3s ease;
        }

        .about-list li:hover {
          transform: translateX(10px);
          color: #667eea;
        }

        .about-list li:last-child {
          margin-bottom: 0;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .about-container {
            padding: 1rem 0.5rem;
          }

          .about-title {
            font-size: 2rem;
            padding: 0.75rem 1rem;
            margin-bottom: 1.5rem;
          }

          .about-section {
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .about-section h2 {
            font-size: 1.3rem;
            margin-bottom: 0.75rem;
          }

          .about-section p {
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
          }

          .about-list li {
            font-size: 0.9rem;
            padding: 0.5rem 0;
          }
        }

        @media (max-width: 480px) {
          .about-container {
            padding: 0.75rem 0.25rem;
          }

          .about-title {
            font-size: 1.8rem;
            padding: 0.5rem 0.75rem;
            margin-bottom: 1rem;
          }

          .about-section {
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .about-section h2 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
          }

          .about-section p {
            font-size: 0.85rem;
            margin-bottom: 0.5rem;
          }

          .about-list li {
            font-size: 0.85rem;
            padding: 0.4rem 0;
          }
        }
      `}</style>
    </>
  );
};

export default About;