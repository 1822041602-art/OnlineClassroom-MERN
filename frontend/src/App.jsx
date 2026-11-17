import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyCourses from './pages/MyCourses';
import Assignments from './pages/Assignments';
import AdminUsers from './pages/AdminUsers';
import NotFound from './pages/NotFound';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-wrapper">
          <Navbar />
          <div className="layout">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
                <Route path="/my-courses" element={<ProtectedRoute roles={['student', 'teacher']}><MyCourses /></ProtectedRoute>} />
                <Route path="/assignments" element={<ProtectedRoute roles={['student', 'teacher']}><Assignments /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}