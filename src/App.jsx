import React from 'react';
import './App.css';
import './styles/EnhancedUI.css';
import './styles/ThemeStyles.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout and Pages
import Layout from './pages/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import UserCart from './pages/UserCart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import UserWishlist from './pages/UserWishlist';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import Deals from './pages/Deals';
import Blog from './pages/Blog';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import Dashboard from './pages/Dashboard';
import UserSettings from './pages/Settings';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './Admin/Dashboard';
import AddProduct from './Admin/AddProduct';
import AddCategory from './Admin/AddCategory';
import ManageProducts from './Admin/ManageProducts';
import ManageCategories from './Admin/ManageCategories';
import ManageOrders from './Admin/ManageOrders';
import PendingOrders from './Admin/PendingOrders';
import ProcessingOrders from './Admin/ProcessingOrders';
import CompletedOrders from './Admin/CompletedOrders';
import ManageCoupons from './Admin/ManageCoupons';
import Users from './Admin/Users';
import AdminNotifications from './Admin/Notifications';
import EmailTemplates from './Admin/EmailTemplates';
import Reports from './Admin/Reports';
import SalesReport from './Admin/SalesReport';
import ProductReport from './Admin/ProductReport';
import UserReport from './Admin/UserReport';
import AdminSettings from './Admin/Settings';
import PaymentSettings from './Admin/PaymentSettings';
import ShippingSettings from './Admin/ShippingSettings';
import AddBlog from './Admin/AddBlog';
import ManageBlogs from './Admin/ManageBlogs';
import EditBlog from './Admin/EditBlog';
import ViewBlog from './Admin/ViewBlog';
import AddDeal from './Admin/AddDeal';
import ManageDeals from './Admin/ManageDeals';
import EditDeal from './Admin/EditDeal';
import ViewDeal from './Admin/ViewDeal';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';
import AdminLayout from './Admin/AdminLayout';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Pages */}
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="products" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="categories" element={<Categories />} />
        <Route path="deals" element={<Deals />} />
        <Route path="blog" element={<Blog />} />
        <Route path="notifications" element={<UserRoute><Notifications /></UserRoute>} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="help" element={<Help />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />

        {/* Protected User Pages */}
        <Route path="cart" element={<Navigate to="/user/cart" replace />} />
        <Route path="checkout" element={<UserRoute><Checkout /></UserRoute>} />
        <Route path="order-success/:id" element={<UserRoute><OrderSuccess /></UserRoute>} />
        <Route path="orders" element={<UserRoute><Orders /></UserRoute>} />
        <Route path="order/:id" element={<UserRoute><OrderDetail /></UserRoute>} />
        <Route path="wishlist" element={<Navigate to="/user/wishlist" replace />} />
        <Route path="user/cart" element={<UserRoute><UserCart /></UserRoute>} />
        <Route path="user/wishlist" element={<UserRoute><UserWishlist /></UserRoute>} />
        <Route path="profile" element={<UserRoute><Profile /></UserRoute>} />
        <Route path="dashboard" element={<UserRoute><Dashboard /></UserRoute>} />
        <Route path="settings" element={<UserRoute><UserSettings /></UserRoute>} />

        </Route>

      {/* Admin Pages - Separate from main Layout */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="orders/pending" element={<PendingOrders />} />
        <Route path="orders/processing" element={<ProcessingOrders />} />
        <Route path="orders/completed" element={<CompletedOrders />} />
        <Route path="coupons" element={<ManageCoupons />} />
        <Route path="users" element={<Users />} />
        <Route path="users/customers" element={<Users />} />
        <Route path="users/admins" element={<Users />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="emails" element={<EmailTemplates />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/sales" element={<SalesReport />} />
        <Route path="reports/products" element={<ProductReport />} />
        <Route path="reports/users" element={<UserReport />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="settings/payment" element={<PaymentSettings />} />
        <Route path="settings/shipping" element={<ShippingSettings />} />
        <Route path="add-blog" element={<AddBlog />} />
        <Route path="blogs" element={<ManageBlogs />} />
        <Route path="edit-blog/:id" element={<EditBlog />} />
        <Route path="blog/:id" element={<ViewBlog />} />
        <Route path="add-deal" element={<AddDeal />} />
        <Route path="deals" element={<ManageDeals />} />
        <Route path="edit-deal/:id" element={<EditDeal />} />
        <Route path="deal/:id" element={<ViewDeal />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
