import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// ⚡ 1. NAYA LOGIC: Server-Driven Theme Hook
import { useServerTheme } from './hooks/useServerTheme'; 

// ── Auth & Registration
import Login from './pages/Admin/Login';
import SetupPassword from './pages/Admin/SetPassword';
import CompanyRegistration from './pages/Admin/CompanyRegistration';
import CustomerRegister from './pages/Shop/CustomerRegister';

// ── Public Shop Pages
import Home from './pages/Home/Home';
import ShopHome from './pages/Shop/ShopHome';
import Cart from './pages/Shop/Cart';
import SearchResults from './pages/SearchResult';

// ── Customer Protected Pages
import OrderSuccess from './pages/orderSuccess';
import ProfilePage from './pages/Profile/ProfilePage';

// ── Super-Admin Pages
import SuperAdminLayout from './layouts/SuperAdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminManagement from './pages/Admin/AdminManagement';
import CompanyProfileEdit from './pages/Admin/CompanyProfileEdit';
import Analytics from './pages/Admin/Analytics';

// ── Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminThemeManager from './pages/Admin/AdminThemeManager';

function App() {

  // ⚡ 2. THEME ENGINE START
  useServerTheme(); 

  return (
    <AuthProvider>
      {/* ⚡ MAIN WRAPPER: Naye theme classes lagaye hain (bg-theme-bg-light aur text-theme-text-main) */}
      <div className="min-h-screen bg-theme-bg-light text-theme-text-main transition-colors duration-700 ease-in-out">
        <BrowserRouter>
          <Routes>
            {/* ── Public Routes ─────────────────────────────────────── */}
            <Route path="/company/register" element={<CompanyRegistration />} />
            <Route path="/login"            element={<Login />} />
            <Route path="/register"         element={<CustomerRegister />} />
            
            {/* ── Shop & Discovery ──────────────────────────────────── */}
            <Route path="/"                 element={<Home />} />
            <Route path="/shop"             element={<ShopHome />} />
            <Route path="/products"         element={<ShopHome />} />
            <Route path="/cart"             element={<Cart />} />
            <Route path="/search"           element={<SearchResults />} />
            
            {/* ── Customer Private Routes ───────────────────────────── */}
            <Route path="/profile" element={
              <ProtectedRoute roles={['customer']}>
                <ProfilePage />
              </ProtectedRoute>
            } /> 

            <Route path="/orders" element={
              <ProtectedRoute roles={['customer']}>
                <div className="p-10">My Orders</div>
              </ProtectedRoute>
            } />

            <Route path='/order-success' element={
              <ProtectedRoute roles={['customer']}>
                <OrderSuccess/>
              </ProtectedRoute>
            } />

            {/* ── Admin / Super-Admin Setup ─────────────────────────── */}
            <Route path="/update-password" element={
                <ProtectedRoute roles={['super-admin', 'admin']}>
                  <SetupPassword />
                </ProtectedRoute>
              }
            />

            {/* ── Super-Admin Panel ─────────────────────────────────── */}
            <Route path="/superadmin" element={
                <ProtectedRoute roles={['super-admin']}>
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard"       element={<AdminDashboard />} />
              <Route path="manage-admins"   element={<AdminManagement />} />
              <Route path="company-profile" element={<CompanyProfileEdit />} />
              <Route path="analytics"       element={<Analytics />} />
            </Route>

            {/* ── Admin Panel ───────────────────────────────────────── */}
            <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products"  element={<AdminProducts />} />
              <Route path="orders"    element={<AdminOrders />} />
              <Route path="users"     element={<AdminUsers />} />
              <Route path="theme"     element={<AdminThemeManager />} />
            </Route>

            {/* ── Error / Fallback ──────────────────────────────────── */}
            <Route path="/unauthorized" element={
              // ⚡ THEME UPDATE: Hardcoded background ko hatakar theme colors apply kiye hain
              <div className="min-h-screen flex items-center justify-center bg-theme-bg-dark">
                <p className="font-serif text-xl text-theme-primary tracking-widest uppercase">
                  Access Denied
                </p>
              </div>
            } />
            
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;

// import { useEffect } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';

// // ── Pages Imports (Same as before)
// import Login from './pages/Admin/Login';
// import SetupPassword from './pages/Admin/SetPassword';
// import CompanyRegistration from './pages/Admin/CompanyRegistration';
// import CustomerRegister from './pages/Shop/CustomerRegister';
// import Home from './pages/Home/Home';
// import ShopHome from './pages/Shop/ShopHome';
// import Cart from './pages/Shop/Cart';
// import SearchResults from './pages/SearchResult';
// import OrderSuccess from './pages/orderSuccess';
// import ProfilePage from './pages/Profile/ProfilePage';
// import SuperAdminLayout from './layouts/SuperAdminLayout';
// import AdminDashboard from './pages/Admin/AdminDashboard';
// import AdminManagement from './pages/Admin/AdminManagement';
// import CompanyProfileEdit from './pages/Admin/CompanyProfileEdit';
// import Analytics from './pages/Admin/Analytics';
// import AdminLayout from './layouts/AdminLayout';
// import AdminProducts from './pages/Admin/AdminProducts';
// import AdminOrders from './pages/Admin/AdminOrders';
// import AdminUsers from './pages/Admin/AdminUsers';

// function App() {
//   // ── Automatic Festival Switcher ────────────────────────────────
//   useEffect(() => {
//     const today = new Date();
//     const month = today.getMonth() + 1; 
//     const date = today.getDate();

//     let theme = 'default';

//     // Holi: March 3 & 4
//     if (month === 3 && (date === 3 || date === 4)) {
//       theme = 'holi';
//     } 
//     // Diwali: November 8 to 12
//     else if (month === 11 && date >= 8 && date <= 12) {
//       theme = 'diwali';
//     }

//     // Yeh line poori website ko theme ka signal deti hai
//     document.documentElement.setAttribute('data-theme', theme);
//   }, []);

//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/company/register" element={<CompanyRegistration />} />
//           <Route path="/login"            element={<Login />} />
//           <Route path="/register"         element={<CustomerRegister />} />
//           <Route path="/"                 element={<Home />} />
//           <Route path="/shop"             element={<ShopHome />} />
//           <Route path="/products"         element={<ShopHome />} />
//           <Route path="/cart"             element={<Cart />} />
//           <Route path="/search"           element={<SearchResults />} />
          
//           <Route path="/profile" element={
//             <ProtectedRoute roles={['customer']}><ProfilePage /></ProtectedRoute>
//           } /> 
//           <Route path="/orders" element={
//             <ProtectedRoute roles={['customer']}><div className="text-white p-10">My Orders</div></ProtectedRoute>
//           } />
//           <Route path='/order-success' element={
//             <ProtectedRoute roles={['customer']}><OrderSuccess/></ProtectedRoute>
//           } />

//           <Route path="/superadmin" element={
//               <ProtectedRoute roles={['super-admin']}><SuperAdminLayout /></ProtectedRoute>
//             }>
//             <Route path="dashboard"       element={<AdminDashboard />} />
//             <Route path="manage-admins"   element={<AdminManagement />} />
//             <Route path="company-profile" element={<CompanyProfileEdit />} />
//             <Route path="analytics"       element={<Analytics />} />
//           </Route>

//           <Route path="/admin" element={
//               <ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>
//             }>
//             <Route path="dashboard" element={<AdminDashboard />} />
//             <Route path="products"  element={<AdminProducts />} />
//             <Route path="orders"    element={<AdminOrders />} />
//             <Route path="users"     element={<AdminUsers />} />
//           </Route>

//           <Route path="/unauthorized" element={
//             <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
//               <p className="text-[#C8A253] font-serif text-xl">Access Denied</p>
//             </div>
//           } />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;