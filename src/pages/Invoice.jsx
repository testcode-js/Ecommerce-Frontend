import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaDownload, FaPrint, FaArrowLeft, FaShoppingCart, FaTruck, FaTag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const invoiceRef = useRef(null);

  // Company information
  const companyInfo = {
    name: 'Easy Shop E-commerce',
    logo: 'https://via.placeholder.com/200x80?text=Easy+Shop',
    address: '123 Business Street, Commercial Area',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    country: 'India',
    phone: '+91 98765 43210',
    email: 'support@easyshop.com',
    website: 'www.easyshop.com',
    gstin: '27AAAPL1234C1ZV',
    pan: 'AAAPL1234C'
  };

  React.useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      
      // Pre-fill customer info if user is logged in
      if (user) {
        setCustomerInfo(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!product) return 0;
    const subtotal = product.price * quantity;
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping above ₹1000
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: (subtotal + tax + shipping).toFixed(2)
    };
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}${random}`;
  };

  const downloadPDF = () => {
    if (!invoiceRef.current) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${generateInvoiceNumber()}</title>
        <style>
          ${getInvoiceStyles()}
        </style>
      </head>
      <body>
        ${invoiceRef.current.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load, then trigger print dialog
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const getInvoiceStyles = () => {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Arial', sans-serif;
      }
      
      body {
        background: #f5f5f5;
        padding: 20px;
      }
      
      .invoice-container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      
      .invoice-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .company-info {
        flex: 1;
      }
      
      .company-logo {
        width: 60px;
        height: 30px;
        background: white;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: #667eea;
        font-size: 12px;
        margin-bottom: 10px;
      }
      
      .company-name {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .company-details {
        font-size: 12px;
        opacity: 0.9;
      }
      
      .invoice-details {
        text-align: right;
      }
      
      .invoice-number {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .invoice-date {
        font-size: 14px;
        opacity: 0.9;
      }
      
      .invoice-body {
        padding: 30px;
      }
      
      .billing-section {
        display: flex;
        gap: 40px;
        margin-bottom: 30px;
      }
      
      .billing-info, .customer-info {
        flex: 1;
      }
      
      .section-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #667eea;
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      
      .info-item {
        margin-bottom: 8px;
      }
      
      .info-label {
        font-size: 12px;
        color: #666;
        margin-bottom: 2px;
      }
      
      .info-value {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }
      
      .product-section {
        margin-bottom: 30px;
      }
      
      .product-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      
      .product-table th {
        background: #f8f9fa;
        padding: 15px;
        text-align: left;
        font-weight: bold;
        color: #333;
        border-bottom: 2px solid #667eea;
      }
      
      .product-table td {
        padding: 15px;
        border-bottom: 1px solid #eee;
      }
      
      .product-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #eee;
      }
      
      .product-name {
        font-weight: bold;
        color: #333;
      }
      
      .product-description {
        color: #666;
        font-size: 12px;
        margin-top: 5px;
      }
      
      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .quantity-btn {
        width: 30px;
        height: 30px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .quantity-input {
        width: 60px;
        height: 30px;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 0 5px;
      }
      
      .price-section {
        margin-bottom: 30px;
      }
      
      .price-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .price-table td {
        padding: 12px 15px;
        border-bottom: 1px solid #eee;
      }
      
      .price-label {
        color: #666;
        font-size: 14px;
      }
      
      .price-value {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      
      .total-row {
        background: #f8f9fa;
        font-weight: bold;
      }
      
      .total-row td {
        padding: 15px;
        font-size: 16px;
        color: #333;
      }
      
      .footer-section {
        background: #f8f9fa;
        padding: 30px;
        border-top: 2px solid #667eea;
      }
      
      .footer-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 30px;
      }
      
      .footer-box {
        text-align: center;
      }
      
      .footer-title {
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
      }
      
      .footer-text {
        color: #666;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .terms-section {
        margin-top: 30px;
        padding: 20px;
        background: #fff9e6;
        border-radius: 8px;
        border-left: 4px solid #f39c12;
      }
      
      .terms-title {
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
      }
      
      .terms-list {
        color: #666;
        font-size: 13px;
        line-height: 1.6;
      }
      
      .terms-list li {
        margin-bottom: 5px;
      }
      
      @media print {
        body {
          background: white;
          padding: 0;
        }
        
        .invoice-container {
          box-shadow: none;
          border-radius: 0;
        }
        
        .no-print {
          display: none !important;
        }
      }
    `;
  };

  const totals = calculateTotal();

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h4>Product not found</h4>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/shop')}
          >
            <FaArrowLeft className="me-2" />
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Action Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>
        
        <div className="d-flex gap-2">
          <button 
            className="btn btn-success"
            onClick={downloadPDF}
          >
            <FaDownload className="me-2" />
            Download PDF
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            <FaPrint className="me-2" />
            Print
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <div ref={invoiceRef} className="invoice-container">
        {/* Header */}
        <div className="invoice-header">
          <div className="company-info">
            <div className="company-logo">ES</div>
            <div className="company-name">{companyInfo.name}</div>
            <div className="company-details">
              {companyInfo.address}<br />
              {companyInfo.city}, {companyInfo.state} - {companyInfo.zipCode}<br />
              {companyInfo.country}<br />
              Phone: {companyInfo.phone}<br />
              Email: {companyInfo.email}<br />
              Website: {companyInfo.website}
            </div>
          </div>
          <div className="invoice-details">
            <div className="invoice-number">{generateInvoiceNumber()}</div>
            <div className="invoice-date">
              Date: {new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="invoice-body">
          {/* Billing Information */}
          <div className="billing-section">
            <div className="billing-info">
              <div className="section-title">
                <FaTag className="me-2" />
                Billing Information
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Company Name</div>
                  <div className="info-value">{companyInfo.name}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">GSTIN</div>
                  <div className="info-value">{companyInfo.gstin}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">PAN</div>
                  <div className="info-value">{companyInfo.pan}</div>
                </div>
              </div>
            </div>
            
            <div className="customer-info">
              <div className="section-title">
                <FaShoppingCart className="me-2" />
                Customer Information
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Full Name</div>
                  <input
                    type="text"
                    className="form-control"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="info-item">
                  <div className="info-label">Email</div>
                  <input
                    type="email"
                    className="form-control"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="info-item">
                  <div className="info-label">Phone</div>
                  <input
                    type="tel"
                    className="form-control"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    placeholder="Enter your phone"
                  />
                </div>
                <div className="info-item">
                  <div className="info-label">Address</div>
                  <input
                    type="text"
                    className="form-control"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    placeholder="Street address"
                  />
                </div>
                <div className="info-item">
                  <div className="info-label">City</div>
                  <input
                    type="text"
                    className="form-control"
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                    placeholder="City"
                  />
                </div>
                <div className="info-item">
                  <div className="info-label">State</div>
                  <input
                    type="text"
                    className="form-control"
                    value={customerInfo.state}
                    onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                    placeholder="State"
                  />
                </div>
                <div className="info-item">
                  <div className="info-label">ZIP Code</div>
                  <input
                    type="text"
                    className="form-control"
                    value={customerInfo.zipCode}
                    onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="product-section">
            <div className="section-title">
              <FaShoppingCart className="me-2" />
              Product Details
            </div>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img
                        src={product.image || 'https://via.placeholder.com/80'}
                        alt={product.name}
                        className="product-image"
                      />
                      <div>
                        <div className="product-name">{product.name}</div>
                        <div className="product-description">
                          {product.description?.substring(0, 100)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="quantity-input"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                      />
                      <button 
                        className="quantity-btn"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="price-value">₹{product.price.toLocaleString()}</td>
                  <td className="price-value">₹{(product.price * quantity).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Price Calculation */}
          <div className="price-section">
            <div className="section-title">Price Details</div>
            <table className="price-table">
              <tbody>
                <tr>
                  <td className="price-label">Subtotal</td>
                  <td className="price-value">₹{totals.subtotal}</td>
                </tr>
                <tr>
                  <td className="price-label">GST (18%)</td>
                  <td className="price-value">₹{totals.tax}</td>
                </tr>
                <tr>
                  <td className="price-label">
                    <FaTruck className="me-2" />
                    Shipping
                  </td>
                  <td className="price-value">
                    {parseFloat(totals.shipping) === 0 ? 'FREE' : `₹${totals.shipping}`}
                  </td>
                </tr>
                <tr className="total-row">
                  <td className="price-label">Total Amount</td>
                  <td className="price-value">₹{totals.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <div className="footer-grid">
            <div className="footer-box">
              <div className="footer-title">Payment Methods</div>
              <div className="footer-text">
                Credit Card<br />
                Debit Card<br />
                Net Banking<br />
                UPI
              </div>
            </div>
            <div className="footer-box">
              <div className="footer-title">Delivery Time</div>
              <div className="footer-text">
                Standard: 5-7 days<br />
                Express: 2-3 days<br />
                Same Day: Available
              </div>
            </div>
            <div className="footer-box">
              <div className="footer-title">Contact Support</div>
              <div className="footer-text">
                Email: {companyInfo.email}<br />
                Phone: {companyInfo.phone}<br />
                24/7 Customer Service
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="terms-section">
          <div className="terms-title">Terms and Conditions</div>
          <ul className="terms-list">
            <li>Payment is due within 30 days of invoice date</li>
            <li>Goods once sold cannot be returned or exchanged</li>
            <li>Prices are inclusive of all applicable taxes</li>
            <li>Delivery charges may apply for orders below ₹1000</li>
            <li>This is a computer-generated invoice and requires no signature</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
