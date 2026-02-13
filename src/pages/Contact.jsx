import React from 'react';
import Information from '../components/Information';
import Map from '../components/Map';

const Contact = () => {
  return (
    <>
      <div className="contact-container">
        <div className="contact-header">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you! Whether you have a question, feedback, or need assistance, our team is here to help.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <h3>📍 Address</h3>
              <p>123 Main Street, City, State 12345</p>
              <p>United States</p>
            </div>

            <div className="contact-item">
              <h3>📞 Phone</h3>
              <p>+1 (234) 567-8900</p>
              <p>Mon-Fri: 9am-6pm EST</p>
            </div>

            <div className="contact-item">
              <h3>📧 Email</h3>
              <p>support@flipkart.com</p>
              <p>We respond within 24 hours</p>
            </div>
          </div>

          <div className="contact-form">
            <h3>Send us a Message</h3>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="Your Name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Your Email" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea placeholder="Your Message" rows="4"></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .contact-container {
          padding: 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .contact-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .contact-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          padding: 1rem 2rem;
          border-radius: 12px;
          display: inline-block;
        }

        .contact-header p {
          font-size: 1.1rem;
          color: #64748b;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 1rem;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .contact-item {
          background: #ffffff;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .contact-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .contact-item h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #667eea;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .contact-item p {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }

        .contact-form {
          background: #ffffff;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .contact-form h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }

        .btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102,126,234,0.4);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .contact-container {
            padding: 1rem 0.5rem;
          }

          .contact-header h1 {
            font-size: 2rem;
            padding: 0.75rem 1rem;
            margin-bottom: 0.75rem;
          }

          .contact-header p {
            font-size: 1rem;
            margin-bottom: 0.75rem;
          }

          .contact-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .contact-info {
            gap: 1rem;
          }

          .contact-item {
            padding: 1.5rem;
          }

          .contact-item h3 {
            font-size: 1.2rem;
            margin-bottom: 0.75rem;
          }

          .contact-item p {
            font-size: 0.9rem;
          }

          .contact-form {
            padding: 1.5rem;
          }

          .contact-form h3 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group label {
            font-size: 0.9rem;
            margin-bottom: 0.375rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 0.75rem;
            font-size: 0.9rem;
          }

          .btn {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .contact-container {
            padding: 0.75rem 0.25rem;
          }

          .contact-header h1 {
            font-size: 1.8rem;
            padding: 0.5rem 0.75rem;
            margin-bottom: 0.5rem;
          }

          .contact-content {
            gap: 1rem;
          }

          .contact-info {
            gap: 0.75rem;
          }

          .contact-item {
            padding: 1rem;
          }

          .contact-item h3 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
          }

          .contact-item p {
            font-size: 0.85rem;
          }

          .contact-form {
            padding: 1rem;
          }

          .contact-form h3 {
            font-size: 1.2rem;
            margin-bottom: 0.75rem;
          }

          .form-group {
            margin-bottom: 0.75rem;
          }

          .form-group label {
            font-size: 0.85rem;
            margin-bottom: 0.25rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 0.5rem;
            font-size: 0.85rem;
          }

          .btn {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
};

export default Contact;