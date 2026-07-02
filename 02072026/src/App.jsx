import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Sayfa Bileşenlerini İçe Aktar
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';

// Müşteri Sayfaları
import Home from './pages/Customer/Home';
import RestaurantDetail from './pages/Customer/RestaurantDetail';
import Cart from './pages/Customer/Cart';
import MyOrders from './pages/Customer/MyOrders';

// İşletme (Restoran) Sayfaları
import RestaurantDashboard from './pages/Restaurant/RestaurantDashboard';
import MenuManagement from './pages/Restaurant/MenuManagement';
import OrderManagement from './pages/Restaurant/OrderManagement';

// Yönetici (Admin) Sayfaları
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminRestaurants from './pages/Admin/AdminRestaurants';
import AdminUsers from './pages/Admin/AdminUsers';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 py-4">
        <Routes>
          {/* Herkese Açık Rotalar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Korumalı Ayarlar (Tüm Giriş Yapmış Kullanıcılar) */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['customer', 'restaurant', 'admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Müşteri Rotaları */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/:id"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <RestaurantDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* İşletme Rotaları */}
          <Route
            path="/restaurant/dashboard"
            element={
              <ProtectedRoute allowedRoles={['restaurant']}>
                <RestaurantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/menu"
            element={
              <ProtectedRoute allowedRoles={['restaurant']}>
                <MenuManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/orders"
            element={
              <ProtectedRoute allowedRoles={['restaurant']}>
                <OrderManagement />
              </ProtectedRoute>
            }
          />

          {/* Yönetici Rotaları */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/restaurants"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRestaurants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          
          {/* Eşleşmeyen Rotalar için Varsayılan Yönlendirme */}
          <Route path="*" element={<Login />} />
        </Routes>
      </main>
      <footer className="bg-dark text-white-50 text-center py-3 border-top border-secondary mt-auto">
        <div className="container">
          <small>&copy; 2026 NeYesek? Tüm hakları saklıdır.</small>
        </div>
      </footer>
    </div>
  );
}

export default App;
