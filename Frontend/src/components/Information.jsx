import React from 'react';
import { BsTelephoneFill } from 'react-icons/bs'; 
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';


function Information() {
  return (
    <>
      <div className="contact-classname">
        <h1><BsTelephoneFill size={20} style={{ marginRight: '8px' }} />Contact Us</h1>
        <p>We’re here to help! Reach out to us through any of the following methods:</p>

        <div className="section">
          <h2>📱 Mobile Number</h2>
          <p>
            +91 87330 57636<br />
            <small>(Available: Mon–Fri, 9 AM to 6 PM)</small>
          </p>
        </div>

        <div className="section">
          <h2>📧 Email Address</h2>
          <p>
            <a href="mailto:support@example.com">15110422019@atmiyauni.edu.in</a><br />
            <small>(We respond within 24–48 hours)</small>
          </p>
        </div>

        <div className="section">
          <h2>🕒 Business Hours</h2>
          <p>
            Monday – Friday: 9:00 AM – 6:00 PM<br />
            Saturday: 10:00 AM – 2:00 PM<br />
            Sunday: Closed
          </p>
        </div>

        <div className="social-section">
          <h2>💬 Social Media</h2>
          <p>
             <a href="https://facebook.com/example" target="_blank" rel="noreferrer"><FaFacebookF size={20} /></a>
             <a href="https://twitter.com/example" target="_blank" rel="noreferrer"><FaTwitter size={20} /></a>
             <a href="https://instagram.com/example" target="_blank" rel="noreferrer"><FaInstagram size={20} /></a>
             <a href="https://linkedin.com/company/example" target="_blank" rel="noreferrer"><FaLinkedinIn size={20} /></a>
          </p>
        </div><br/>

        <div className="section">
          <h2>📍 Office Address</h2>
          <p>
            123 Business Ave,<br />
            150 ft. Ring Road Mavdi,<br />
            Rajkot, Gujarat 360004, India
          </p>
        </div>
      </div>
    </>
  );
}

export default Information;
