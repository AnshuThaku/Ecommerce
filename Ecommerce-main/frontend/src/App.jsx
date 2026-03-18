// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import React, { useState } from "react";
// import { AuthProvider }        from './context/AuthContext';
// import ProtectedRoute          from './components/ProtectedRoute';
// import Account from "./pages/Account"


// import BrandsMarquee from "./home/BrandsMarquee.jsx";
// import Cursor from "./home/Cursor.jsx";
// import Footer from "./home/Footer.jsx";
// import Header from "./home/Header.jsx";
// import Hero from "./home/Hero.jsx";
// import Productcard from "./home/Productcard.jsx";








// import Login                   from './pages/Admin/Login';
// import SetupPassword           from './pages/Admin/SetPassword';
// import CompanyRegistration     from './pages/Admin/CompanyRegistration';

// // ── Shop / Customers
// import CustomerRegister        from './pages/Shop/CustomerRegister';
// import ShopHome                from './pages/Shop/ShopHome';
// import ProductDetails          from './pages/Shop/ProductDetails';
// import Cart                    from './pages/Shop/Cart';

// // ── Super-Admin
// import SuperAdminLayout        from './layouts/SuperAdminLayout';
// import AdminDashboard          from './pages/Admin/AdminDashboard';
// import AdminManagement         from './pages/Admin/AdminManagement';
// import CompanyProfileEdit      from './pages/Admin/CompanyProfileEdit';
// import Analytics               from './pages/Admin/Analytics';

// // ── Admin
// import AdminLayout             from './layouts/AdminLayout';
// import AdminProducts           from './pages/Admin/AdminProducts';
// import AdminOrders             from './pages/Admin/AdminOrders';
// import AdminUsers              from './pages/Admin/AdminUsers';

// const themes = {
//   default: {
//     heroOverlay: "from-transparent to-transparent",
//     accentColor: "#d3b574"
//   }
// };
// function App() {
//    const [cartCount, setCartCount] = useState(0);
//   const [currentTheme, setCurrentTheme] = useState("default");

//   const theme = themes[currentTheme];
//   return (
//      <AuthProvider>
//       <div className="min-h-screen bg-[#0A0A0A] font-sans">
//         <BrowserRouter>
          
//           {/* ── Yeh Header aur Cursor har page par dikhenge ── */}
//           <Cursor />
//           <Header
//             cartCount={cartCount}
//             currentTheme={currentTheme}
//             setCurrentTheme={setCurrentTheme}
//           />

//           <Routes>
//             {/* ── HOME PAGE ── */}
//             <Route 
//               path="/" 
//               element={
//                 <>
//                   <Hero theme={theme} />
//                   <div className="flex flex-wrap justify-center max-w-6xl mx-auto py-10">
//                     <Productcard />
//                   </div>
//                   <BrandsMarquee />
//                 </>
//               } 
//             />

//             {/* ── BAAKI SAARE PAGES ── */}
//             <Route path="/company/register" element={<CompanyRegistration />} />
//             <Route path="/login"            element={<Login />} />
//             <Route path="/register"         element={<CustomerRegister />} />
            
//             <Route path="/shop"             element={<ShopHome />} />
//             <Route path="/products"         element={<ShopHome />} />
//             <Route path="/cart"             element={<Cart />} />
//             <Route path="/:product_name/p/:id" element={<ProductDetails />} />
//             <Route path="/account"          element={<Account/>} /> 

//             {/* ── ADMIN aur SECURITY waale pages ── */}
//             <Route
//               path="/update-password"
//               element={
//                 <ProtectedRoute roles={['super-admin', 'admin']}>
//                   <SetupPassword />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/superadmin"
//               element={
//                 <ProtectedRoute roles={['super-admin']}>
//                   <SuperAdminLayout />
//                 </ProtectedRoute>
//               }
//             >
//               <Route path="dashboard"       element={<AdminDashboard />} />
//               <Route path="manage-admins"   element={<AdminManagement />} />
//               <Route path="company-profile" element={<CompanyProfileEdit />} />
//               <Route path="analytics"       element={<Analytics />} />
//             </Route>

//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute roles={['admin']}>
//                   <AdminLayout />
//                 </ProtectedRoute>
//               }
//             >
//               <Route path="dashboard" element={<AdminDashboard />} />
//               <Route path="products"  element={<AdminProducts />} />
//               <Route path="orders"    element={<AdminOrders />} />
//               <Route path="users"     element={<AdminUsers />} />
//             </Route>

//             <Route path="/unauthorized" element={
//               <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
//                 <p className="text-[#C8A253] font-serif text-xl">Pahunch Mana Hai (Access Denied)</p>
//               </div>
//             } />

//             <Route path="/orders" element={
//               <ProtectedRoute roles={['customer']}>
//                 <div className="text-white p-10 text-center">Mere Orders (My Orders)</div>
//               </ProtectedRoute>
//             } />
//           </Routes>

//           {/* ── Yeh Footer har page par dikhega ── */}
//           <Footer />
//         </BrowserRouter>
//       </div>
//     </AuthProvider>
//     // <AuthProvider>
//     //  <Cursor />
//     //       <Header
//     //         cartCount={cartCount}
//     //         currentTheme={currentTheme}
//     //         setCurrentTheme={setCurrentTheme}
//     //       />

//     //       <Routes>
//     //         {/* ── HOME PAGE ── */}
//     //         <Route 
//     //           path="/" 
//     //           element={
//     //             <>
//     //               <Hero theme={theme} />
//     //               <div className="flex flex-wrap justify-center max-w-6xl mx-auto py-10">
//     //                 <Productcard />
//     //               </div>
//     //               <BrandsMarquee />
//     //             </>
//     //           } 
//     //         />
//     //  <Footer/>











//     //     <Routes>
//     //       {/* ── Public ─────────────────────────────────────── */}
//     //       <Route path="/company/register" element={<CompanyRegistration />} />
//     //       <Route path="/login"            element={<Login />} />
//     //       <Route path="/register"         element={<CustomerRegister />} />
          
//     //       {/* ShopHome is now public, accessible to anyone */}
//     //       <Route path="/"                 element={<ShopHome />} />
//     //       <Route path="/shop"             element={<ShopHome />} />
//     //       <Route path="/products"         element={<ShopHome />} />
//     //       <Route path="/cart"             element={<Cart />} />
//     //       <Route path="/:product_name/p/:id" element={<ProductDetails />} />
//     //       {/* <Route path="/:product_name/p/:id" element={<ProductDetails />} /> */}
//     //       {/* <Route path="/user-details" element={<Userdetails />} />    */}
//     //       <Route path="/account" element={<Account/>} /> {/* ── First-time password setup (both roles) ──────── */}
//     //       <Route
//     //         path="/update-password"
//     //         element={
//     //           <ProtectedRoute roles={['super-admin', 'admin']}>
//     //             <SetupPassword />
//     //           </ProtectedRoute>
//     //         }
//     //       />

//     //       {/* ── Super-Admin panel ────────────────────────────── */}
//     //       <Route
//     //         path="/superadmin"
//     //         element={
//     //           <ProtectedRoute roles={['super-admin']}>
//     //             <SuperAdminLayout />
//     //           </ProtectedRoute>
//     //         }
//     //       >
//     //         <Route path="dashboard"       element={<AdminDashboard />} />
//     //         <Route path="manage-admins"   element={<AdminManagement />} />
//     //         <Route path="company-profile" element={<CompanyProfileEdit />} />
//     //         <Route path="analytics"       element={<Analytics />} />
//     //       </Route>

//     //       {/* ── Admin panel ──────────────────────────────────── */}
//     //       <Route
//     //         path="/admin"
//     //         element={
//     //           <ProtectedRoute roles={['admin']}>
//     //             <AdminLayout />
//     //           </ProtectedRoute>
//     //         }
//     //       >
//     //         <Route path="dashboard" element={<AdminDashboard />} />
//     //         <Route path="products"  element={<AdminProducts />} />
//     //         <Route path="orders"    element={<AdminOrders />} />
//     //         <Route path="users"     element={<AdminUsers />} />
//     //       </Route>

//     //       {/* ── Unauthorized ─────────────────────────────────── */}
//     //       <Route path="/unauthorized" element={
//     //         <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
//     //           <p className="text-[#C8A253] font-serif text-xl">Access Denied</p>
//     //         </div>
//     //       } />

//     //       {/* ── Customer-facing Private Routes ────────────────── */}
//     //       <Route path="/orders" element={
//     //         <ProtectedRoute roles={['customer']}>
//     //           <div className="text-white p-10">My Orders</div>
//     //         </ProtectedRoute>
//     //       } />
//     //     </Routes>
//     //   </BrowserRouter>
//     // </AuthProvider>
//   );
// }

// export default App;


import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// =========================================================================
// ⚠️ DHYAN DEIN (LOCAL VS CODE KE LIYE):
// Yahan preview chalane ke liye maine aapke asli imports ko comment kar diya hai.
// Apne VS Code mein chalane ke liye in niche diye gaye '/*' aur '*/' ko hata dein!
// =========================================================================


import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Account from "./pages/Account";

import BrandsMarquee from "./home/BrandsMarquee.jsx";
import Cursor from "./home/Cursor.jsx";
import Footer from "./home/Footer.jsx";
import Header from "./home/Header.jsx";
import Hero from "./home/Hero.jsx";
import Productcard from "./home/Productcard.jsx";

import Login from './pages/Admin/Login';
import SetupPassword from './pages/Admin/SetPassword';
import CompanyRegistration from './pages/Admin/CompanyRegistration';

import CustomerRegister from './pages/Shop/CustomerRegister';
import ShopHome from './pages/Shop/ShopHome';
import ProductDetails from './pages/Shop/ProductDetails';
import Cart from './pages/Shop/Cart';

import SuperAdminLayout from './layouts/SuperAdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminManagement from './pages/Admin/AdminManagement';
import CompanyProfileEdit from './pages/Admin/CompanyProfileEdit';
import Analytics from './pages/Admin/Analytics';

import AdminLayout from './layouts/AdminLayout';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminUsers from './pages/Admin/AdminUsers';



// ── Theme ki setting ──
const themes = {
  default: {
    heroOverlay: "from-transparent to-transparent",
    accentColor: "#d3b574"
  }
};

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [currentTheme, setCurrentTheme] = useState("default");
  
  const theme = themes[currentTheme];

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0A0A0A] font-sans">
        <BrowserRouter>
          
          {/* ── Yeh Header aur Cursor har page par dikhenge ── */}
          <Cursor />
          <Header
            cartCount={cartCount}
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
          />

          <Routes>
            {/* ── HOME PAGE ── */}
            <Route 
              path="/" 
              element={
                <>
                  <Hero theme={theme} />
                  {/* Yahan se div hata diya gaya hai taaki Productcard poori width le sake */}
 <div className="w-full bg-white pt-32 pb-10" style={{ paddingTop: "100px" }}>
                    <Productcard />
                  </div>
              <BrandsMarquee />
                </>
              } 
            />

            {/* ── BAAKI SAARE PAGES ── */}
            <Route path="/company/register" element={<CompanyRegistration />} />
            <Route path="/login"            element={<Login />} />
            <Route path="/register"         element={<CustomerRegister />} />
            
            <Route path="/shop"             element={<ShopHome />} />
            <Route path="/products"         element={<ShopHome />} />
            <Route path="/cart"             element={<Cart />} />
            <Route path="/:product_name/p/:id" element={<ProductDetails />} />
            <Route path="/account"          element={<Account/>} /> 

            {/* ── ADMIN aur SECURITY waale pages ── */}
            <Route
              path="/update-password"
              element={
                <ProtectedRoute roles={['super-admin', 'admin']}>
                  <SetupPassword />
                </ProtectedRoute>
              }
            />

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

            <Route path="/unauthorized" element={
              <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <p className="text-[#C8A253] font-serif text-xl">Pahunch Mana Hai (Access Denied)</p>
              </div>
            } />

            <Route path="/orders" element={
              <ProtectedRoute roles={['customer']}>
                <div className="text-white p-10 text-center">Mere Orders (My Orders)</div>
              </ProtectedRoute>
            } />
          </Routes>

          {/* ── Yeh Footer har page par dikhega ── */}
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;