import React, { useState } from 'react';
import { FaQuestionCircle, FaSearch, FaHeadset, FaEnvelope, FaPhone, FaTruck, FaShieldAlt, FaCreditCard, FaExchangeAlt, FaBox, FaClock, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaUserCircle } from 'react-icons/fa';
import Button from '../components/Button';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'all', name: 'All Topics', icon: FaQuestionCircle },
    { id: 'orders', name: 'Orders & Shipping', icon: FaTruck },
    { id: 'returns', name: 'Returns & Refunds', icon: FaExchangeAlt },
    { id: 'payment', name: 'Payment', icon: FaCreditCard },
    { id: 'account', name: 'Account', icon: FaUserCircle },
    { id: 'product', name: 'Products', icon: FaBox }
  ];

  const faqs = [
    {
      id: 1,
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and going to the "My Orders" section. Click on the order you want to track and you\'ll see real-time updates on your shipment status. You\'ll also receive email notifications at each step of the delivery process.',
      helpful: 45
    },
    {
      id: 2,
      category: 'orders',
      question: 'What are the shipping options and delivery times?',
      answer: 'We offer multiple shipping options: Standard (5-7 business days), Express (2-3 business days), and Next Day Delivery. Shipping costs vary based on your location and chosen method. Free shipping is available on orders over ₹999.',
      helpful: 38
    },
    {
      id: 3,
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be unused, in original packaging, and with all tags attached. To initiate a return, go to your order history and click "Request Return". Refunds are processed within 5-7 business days after we receive the returned item.',
      helpful: 52
    },
    {
      id: 4,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards (Visa, MasterCard, American Express), UPI, Net Banking, Wallets (PayTM, PhonePe), and Cash on Delivery for orders below ₹5000. All transactions are secured with 256-bit SSL encryption.',
      helpful: 67
    },
    {
      id: 5,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page. Enter your registered email address, and we\'ll send you a password reset link. The link is valid for 24 hours. If you don\'t receive the email, check your spam folder.',
      helpful: 29
    },
    {
      id: 6,
      category: 'product',
      question: 'How do I know if a product is in stock?',
      answer: 'Product availability is shown on each product page. If an item is out of stock, you can sign up for notifications and we\'ll email you when it becomes available again. Some popular items may have limited stock indicators.',
      helpful: 41
    },
    {
      id: 7,
      category: 'payment',
      question: 'Is Cash on Delivery available?',
      answer: 'Yes, COD is available for orders under ₹5000. You\'ll need to pay the exact amount to our delivery partner. Please note that COD orders cannot be combined with prepaid discounts.',
      helpful: 33
    },
    {
      id: 8,
      category: 'orders',
      question: 'Can I change or cancel my order?',
      answer: 'You can cancel your order within 1 hour of placing it. After that, the order enters our fulfillment process and cannot be cancelled online. Contact our customer support at support@shophub.com for assistance with order modifications.',
      helpful: 36
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const markHelpful = (id) => {
    // Mark FAQ as helpful (in real app, this would update the backend)
    console.log(`FAQ ${id} marked as helpful`);
  };

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">
          <FaQuestionCircle className="me-3" />
          Help Center
        </h1>
        <p className="lead text-muted">Find answers to common questions or contact our support team</p>
      </div>

      {/* Search Bar */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="input-group input-group-lg">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-5">
        <div className="col-md-3 mb-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <FaTruck size={40} className="text-primary mb-3" />
              <h5 className="card-title">Track Order</h5>
              <p className="card-text small text-muted">Check your order status</p>
              <Button title="Track Order" className="btn-outline-primary btn-sm" />
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <FaExchangeAlt size={40} className="text-success mb-3" />
              <h5 className="card-title">Return Item</h5>
              <p className="card-text small text-muted">Initiate a return</p>
              <Button title="Return Item" className="btn-outline-success btn-sm" />
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <FaHeadset size={40} className="text-info mb-3" />
              <h5 className="card-title">Contact Support</h5>
              <p className="card-text small text-muted">Get help from our team</p>
              <Button title="Contact Us" className="btn-outline-info btn-sm" />
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <FaBox size={40} className="text-warning mb-3" />
              <h5 className="card-title">Product Help</h5>
              <p className="card-text small text-muted">Product information</p>
              <Button title="Product Help" className="btn-outline-warning btn-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* FAQ Categories */}
        <div className="col-lg-3 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Categories</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {faqCategories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      className={`list-group-item list-group-item-action d-flex align-items-center ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="me-2" />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="col-lg-9">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">
                Frequently Asked Questions
                {filteredFaqs.length > 0 && (
                  <span className="badge bg-secondary ms-2">{filteredFaqs.length}</span>
                )}
              </h4>
            </div>
            <div className="card-body">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-5">
                  <FaQuestionCircle size={60} className="text-muted mb-3" />
                  <h5>No results found</h5>
                  <p className="text-muted">Try adjusting your search or category selection.</p>
                </div>
              ) : (
                <div className="accordion" id="faqAccordion">
                  {filteredFaqs.map(faq => (
                    <div key={faq.id} className="accordion-item">
                      <h2 className="accordion-header" id={`heading${faq.id}`}>
                        <button
                          className={`accordion-button ${expandedFaq === faq.id ? '' : 'collapsed'}`}
                          type="button"
                          onClick={() => toggleFaq(faq.id)}
                        >
                          {faq.question}
                        </button>
                      </h2>
                      <div
                        id={`collapse${faq.id}`}
                        className={`accordion-collapse collapse ${expandedFaq === faq.id ? 'show' : ''}`}
                      >
                        <div className="accordion-body">
                          <p>{faq.answer}</p>
                          <div className="d-flex align-items-center justify-content-between mt-3">
                            <small className="text-muted">
                              <FaCheckCircle className="me-1 text-success" />
                              {faq.helpful} people found this helpful
                            </small>
                            <Button
                              title="Helpful"
                              className="btn-outline-success btn-sm"
                              onClick={() => markHelpful(faq.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body text-center py-5">
              <h3 className="mb-3">Still need help?</h3>
              <p className="text-muted mb-4">Our customer support team is here to help you</p>
              <div className="row justify-content-center">
                <div className="col-md-4 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <FaPhone size={30} className="text-primary mb-2" />
                    <h6>Call Us</h6>
                    <p className="text-muted">+91 98765 43210</p>
                    <small className="text-muted">Mon-Sat, 9AM-6PM</small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <FaEnvelope size={30} className="text-success mb-2" />
                    <h6>Email Us</h6>
                    <p className="text-muted">support@shophub.com</p>
                    <small className="text-muted">We respond within 24hrs</small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <FaHeadset size={30} className="text-info mb-2" />
                    <h6>Live Chat</h6>
                    <p className="text-muted">Chat with our team</p>
                    <Button title="Start Chat" className="btn-info btn-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3 mb-3">
                  <FaShieldAlt size={30} className="text-primary mb-2" />
                  <h6>Secure Shopping</h6>
                  <small className="text-muted">256-bit SSL encryption</small>
                </div>
                <div className="col-md-3 mb-3">
                  <FaTruck size={30} className="text-success mb-2" />
                  <h6>Fast Delivery</h6>
                  <small className="text-muted">Express shipping available</small>
                </div>
                <div className="col-md-3 mb-3">
                  <FaExchangeAlt size={30} className="text-warning mb-2" />
                  <h6>Easy Returns</h6>
                  <small className="text-muted">30-day return policy</small>
                </div>
                <div className="col-md-3 mb-3">
                  <FaCreditCard size={30} className="text-info mb-2" />
                  <h6>Safe Payments</h6>
                  <small className="text-muted">Multiple payment options</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
