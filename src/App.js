// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { CartProvider } from './context/CartContext';

// // Layout Components
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import AdminLayout from './components/AdminLayout';

// // Public Pages
// import Home from './pages/Home';
// import Products from './pages/Products';
// import ProductDetail from './pages/ProductDetail';
// import Cart from './pages/Cart';
// import Login from './pages/Login';
// import Register from './pages/Register';

// // Protected Pages
// import Checkout from './pages/Checkout';
// import Orders from './pages/Orders';
// import Profile from './pages/Profile';

// // Admin Pages
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminUsers from './pages/admin/AdminUsers';
// import AdminProducts from './pages/admin/AdminProducts';
// import ProductForm from './pages/admin/ProductForm';
// import AdminOrders from './pages/admin/AdminOrders';
// import OrderDetail from './pages/admin/OrderDetail';

// // Additional Pages
// import PrivacyPolicy from './pages/PrivacyPolicy';
// import ContactUs from './pages/ContactUs';
// import NotFound from './pages/NotFound';

// // Protected Route Component
// const ProtectedRoute = ({ children, adminOnly = false }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   if (adminOnly && user.role !== 'admin' && user.role !== 'subadmin') {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// // Public Layout
// const PublicLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-grow">
//         {children}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <CartProvider>
//           <Toaster
//             position="top-right"
//             toastOptions={{
//               duration: 3000,
//               style: {
//                 background: '#363636',
//                 color: '#fff',
//               },
//               success: {
//                 duration: 3000,
//                 iconTheme: {
//                   primary: '#4ade80',
//                   secondary: '#fff',
//                 },
//               },
//               error: {
//                 duration: 4000,
//                 iconTheme: {
//                   primary: '#ef4444',
//                   secondary: '#fff',
//                 },
//               },
//             }}
//           />
          
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
//             <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
//             <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
//             <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
//             <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
//             <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
//             <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
//             <Route path="/contact" element={<PublicLayout><ContactUs /></PublicLayout>} />

//             {/* Protected Routes */}
//             <Route
//               path="/checkout"
//               element={
//                 <ProtectedRoute>
//                   <PublicLayout><Checkout /></PublicLayout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/orders"
//               element={
//                 <ProtectedRoute>
//                   <PublicLayout><Orders /></PublicLayout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/orders/:id"
//               element={
//                 <ProtectedRoute>
//                   <PublicLayout><OrderDetail /></PublicLayout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <PublicLayout><Profile /></PublicLayout>
//                 </ProtectedRoute>
//               }
//             />

//             {/* Admin Routes */}
//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute adminOnly>
//                   <AdminLayout />
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<AdminDashboard />} />
//               <Route path="users" element={<AdminUsers />} />
//               <Route path="users/:id" element={<AdminUsers />} />
//               <Route path="products" element={<AdminProducts />} />
//               <Route path="products/new" element={<ProductForm />} />
//               <Route path="products/:id" element={<ProductForm />} />
//               <Route path="orders" element={<AdminOrders />} />
//               <Route path="orders/:id" element={<OrderDetail />} />
//             </Route>

//             {/* 404 Route */}
//             <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
//           </Routes>
//         </CartProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// NEW
import ScrollToTop from './components/ScrollToTop';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

// Import both order detail components
import OrderDetail from './pages/OrderDetail';              // Customer version
import AdminOrderDetail from './pages/admin/OrderDetail';   // Admin version

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import ProductForm from './pages/admin/ProductForm';
import AdminOrders from './pages/admin/AdminOrders';

// Additional
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';
import FAQ from './pages/Faq';
import DeliveryInfo from './pages/DeliveryInfo';
import TermsOfService from './pages/TermsofService';
import About from './pages/About';
import ScrollProgress from './components/ScrollProgress';

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== 'admin' && user.role !== 'subadmin')
    return <Navigate to="/" />;

  return children;
};

// Layout for public pages with sticky navbar
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-slate-50">
    {/* Sticky Navbar - stays at top */}
    <div className="sticky top-0 z-50">
      <Navbar />
    </div>
    
    {/* Main content with proper spacing */}
    <main className="flex-grow">
      {children}
    </main>
    
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      {/* scroll to top on every route change */}
      <ScrollToTop />

      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(15, 23, 42, 0.85)', // slate-900 with transparency
                color: 'white',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '14px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e', // light green icon only (clean)
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'white',
                },
              },
            }}
          />
          <ScrollProgress />
          <Routes>
            {/* ========== Public Routes ========== */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
            <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
            <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactUs /></PublicLayout>} />
            <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
            <Route path="/shipping" element={<PublicLayout><DeliveryInfo /></PublicLayout>} />
            <Route path="/terms" element={<PublicLayout><TermsOfService /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />

            {/* ========== Customer Protected Routes ========== */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <PublicLayout><Checkout /></PublicLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <PublicLayout><Orders /></PublicLayout>
                </ProtectedRoute>
              }
            />

            {/* Customer Order Detail */}
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <PublicLayout><OrderDetail /></PublicLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PublicLayout><Profile /></PublicLayout>
                </ProtectedRoute>
              }
            />

            {/* ========== Admin Routes ========== */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:id" element={<AdminUsers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id" element={<ProductForm />} />
              <Route path="orders" element={<AdminOrders />} />

              {/* Admin Order Detail */}
              <Route path="orders/:id" element={<AdminOrderDetail />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;