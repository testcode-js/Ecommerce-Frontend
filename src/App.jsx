import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

// Layout and Pages
import Layout from './pages/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './Admin/Dashboard';
import AddProduct from './Admin/AddProduct';
import AddCategory from './Admin/AddCategory';
import ManageOrders from './Admin/ManageOrders';
import ManageCoupons from './Admin/ManageCoupons';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Pages */}
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="products" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />

        {/* Protected User Pages */}
        <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin Pages */}
        <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="admin/products" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="admin/add-category" element={<AdminRoute><AddCategory /></AdminRoute>} />
        <Route path="admin/categories" element={<AdminRoute><AddCategory /></AdminRoute>} />
        <Route path="admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
        <Route path="admin/coupons" element={<AdminRoute><ManageCoupons /></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
