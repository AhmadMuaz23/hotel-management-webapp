import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Rooms from './pages/public/Rooms';
import RoomDetail from './pages/public/RoomDetail';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import AdminLogin from './pages/auth/AdminLogin';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import UserDashboard from './pages/user/UserDashboard';
import AdminLayout from './components/layout/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import ManageBookings from './pages/admin/ManageBookings';
import ManageRooms from './pages/admin/ManageRooms';
import ManageUsers from './pages/admin/ManageUsers';
import ManageMessages from './pages/admin/ManageMessages';
import ManageReviews from './pages/admin/ManageReviews';
import AdminSettings from './pages/admin/AdminSettings';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

const AppContent = () => {
  const location = useLocation();
  
  // Define paths where navbar/footer should be hidden
  const isAdminPath = location.pathname.startsWith('/admin');
  const hideFooterPaths = ['/login', '/register', '/admin/login'];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname) || isAdminPath;
  const shouldHideNavbar = isAdminPath && location.pathname !== '/admin/login';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ScrollToTop />
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="messages" element={<ManageMessages />} />
            <Route path="reviews" element={<ManageReviews />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
