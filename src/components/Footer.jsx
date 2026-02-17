import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="modern-footer">
        <div className="container">
          <div className="footer-content">
            {/* Company Info */}
            <div className="footer-section company-info">
              <div className="footer-logo">
                <span className="logo-text">ShopHub</span>
                <span className="logo-dot">.</span>
              </div>
              <p className="company-description">
                Your one-stop shop for quality products at unbeatable prices. 
                Fast shipping, secure payments, and exceptional customer service.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <FaFacebookF />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">Shop</h3>
              <ul className="footer-links">
                <li><Link to="/shop?featured=true">New Arrivals</Link></li>
                <li><Link to="/shop?sort=bestselling">Bestsellers</Link></li>
                <li><Link to="/shop?category=women">Women's Clothing</Link></li>
                <li><Link to="/shop?category=men">Men's Clothing</Link></li>
                <li><Link to="/shop?category=accessories">Accessories</Link></li>
                <li><Link to="/shop?discount=true">Sale</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-section">
              <h3 className="footer-title">Support</h3>
              <ul className="footer-links">
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/orders">Order Status</Link></li>
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/returns">Returns & Exchanges</Link></li>
                <li><Link to="/size-guide">Size Guide</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="footer-section">
              <h3 className="footer-title">Company</h3>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/press">Press</Link></li>
                <li><Link to="/affiliates">Affiliates</Link></li>
                <li><Link to="/responsibility">Responsibility</Link></li>
                <li><Link to="/investors">Investors</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section contact-info">
              <h3 className="footer-title">Get in Touch</h3>
              <div className="contact-item">
                <FaEnvelope />
                <span>support@shophub.com</span>
              </div>
              <div className="contact-item">
                <FaPhone />
                <span>+91 43210 23045</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>123 Business Ave, Borivali,  Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="newsletter-section">
            <div className="newsletter-content">
              <h3>Stay Updated</h3>
              <p>Subscribe to our newsletter for exclusive offers and new arrivals</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" className="newsletter-input" />
                <button className="newsletter-btn">Subscribe</button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <div className="copyright">
                <p>&copy; 2024 ShopHub. All rights reserved.</p>
              </div>
              <div className="footer-bottom-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/cookies">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
        <FaArrowUp />
      </button>

      <style>{`
        .modern-footer {
          background: linear-gradient(135deg, #2d3436 0%, #000000 100%);
          color: #fff;
          padding: 4rem 0 1rem;
          position: relative;
          overflow: hidden;
        }

        .modern-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-section {
          margin-bottom: 2rem;
        }

        .company-info {
          grid-column: span 2;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }

        .logo-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-dot {
          color: #667eea;
        }

        .company-description {
          color: #b2bec3;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 400px;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .social-link:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transform: translateY(-3px);
          border-color: #667eea;
        }

        .footer-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #fff;
          position: relative;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.8rem;
        }

        .footer-links a {
          color: #b2bec3;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .footer-links a:hover {
          color: #667eea;
          transform: translateX(5px);
        }

        .contact-info {
          grid-column: span 1;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          color: #b2bec3;
        }

        .contact-item svg {
          color: #667eea;
          font-size: 1.1rem;
        }

        .newsletter-section {
          background: rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 3rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .newsletter-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .newsletter-content h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #fff;
        }

        .newsletter-content p {
          color: #b2bec3;
          margin-bottom: 1.5rem;
        }

        .newsletter-form {
          display: flex;
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .newsletter-input {
          flex: 1;
          padding: 0.8rem 1.2rem;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50px;
          background: rgba(255,255,255,0.1);
          color: #fff;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .newsletter-input::placeholder {
          color: #b2bec3;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(255,255,255,0.15);
        }

        .newsletter-btn {
          padding: 0.8rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102,126,234,0.4);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 2rem;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .copyright p {
          color: #b2bec3;
          margin: 0;
        }

        .footer-bottom-links {
          display: flex;
          gap: 2rem;
        }

        .footer-bottom-links a {
          color: #b2bec3;
          text-decoration: none;
          transition: color 0.3s ease;
          font-size: 0.9rem;
        }

        .footer-bottom-links a:hover {
          color: #667eea;
        }

        .back-to-top {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(102,126,234,0.4);
          z-index: 1000;
        }

        .back-to-top:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(102,126,234,0.6);
        }

        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 2rem;
          }

          .company-info {
            grid-column: span 3;
            text-align: center;
          }

          .contact-info {
            grid-column: span 3;
            text-align: center;
          }

          .social-links {
            justify-content: center;
          }

          .contact-item {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .modern-footer {
            padding: 3rem 0 1rem;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .company-info,
          .contact-info {
            grid-column: span 1;
          }

          .footer-title::after {
            left: 50%;
            transform: translateX(-50%);
          }

          .social-links {
            justify-content: center;
          }

          .contact-item {
            justify-content: center;
          }

          .newsletter-form {
            flex-direction: column;
            gap: 1rem;
          }

          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
          }

          .footer-bottom-links {
            justify-content: center;
          }

          .back-to-top {
            bottom: 1rem;
            right: 1rem;
            width: 45px;
            height: 45px;
          }
        }
      `}</style>
    </>
  );
};


export default Footer;
