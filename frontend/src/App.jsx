import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }        from './context/AuthContext';
import ProtectedRoute          from './components/ProtectedRoute';

import Login                   from './pages/Admin/Login';
import SetupPassword           from './pages/Admin/SetPassword';
import CompanyRegistration     from './pages/Admin/CompanyRegistration';

// ── Shop / Customers
import CustomerRegister        from './pages/Shop/CustomerRegister';
import ShopHome                from './pages/Shop/ShopHome';
import ProductDetails          from './pages/Shop/ProductDetails';
import Cart                    from './pages/Shop/Cart';

// ── Super-Admin
import SuperAdminLayout        from './layouts/SuperAdminLayout';
import AdminDashboard          from './pages/Admin/AdminDashboard';
import AdminManagement         from './pages/Admin/AdminManagement';
import CompanyProfileEdit      from './pages/Admin/CompanyProfileEdit';
import Analytics               from './pages/Admin/Analytics';

// ── Admin
import AdminLayout             from './layouts/AdminLayout';
import AdminProducts           from './pages/Admin/AdminProducts';
import AdminOrders             from './pages/Admin/AdminOrders';
import AdminUsers              from './pages/Admin/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public ─────────────────────────────────────── */}
          <Route path="/company/register" element={<CompanyRegistration />} />
          <Route path="/login"            element={<Login />} />
          <Route path="/register"         element={<CustomerRegister />} />
          
          {/* ShopHome is now public, accessible to anyone */}
          <Route path="/"                 element={<ShopHome />} />
          <Route path="/shop"             element={<ShopHome />} />
          <Route path="/products"         element={<ShopHome />} />
          <Route path="/cart"             element={<Cart />} />
          <Route path="/:product_name/p/:id" element={<ProductDetails />} />
          <Route path="/product/:id"      element={<ProductDetails />} />
          {/* ── First-time password setup (both roles) ──────── */}
          <Route
            path="/update-password"
            element={
              <ProtectedRoute roles={['super-admin', 'admin']}>
                <SetupPassword />
              </ProtectedRoute>
            }
          />

          {/* ── Super-Admin panel ────────────────────────────── */}
          <Route
            path="/superadmin"
            element={
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

          {/* ── Admin panel ──────────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products"  element={<AdminProducts />} />
            <Route path="orders"    element={<AdminOrders />} />
            <Route path="users"     element={<AdminUsers />} />
          </Route>

          {/* ── Unauthorized ─────────────────────────────────── */}
          <Route path="/unauthorized" element={
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
              <p className="text-[#C8A253] font-serif text-xl">Access Denied</p>
            </div>
          } />

          {/* ── Customer-facing Private Routes ────────────────── */}
          <Route path="/orders" element={
            <ProtectedRoute roles={['customer']}>
              <div className="text-white p-10">My Orders</div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;