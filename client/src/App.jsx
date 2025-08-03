import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Homepage from './pages/Homepage';
import SearchPage from './pages/SearchPage';
import ItemPage from './pages/ItemPage';
import LoginPage from './pages/LoginPage';
import ItemList from './pages/ItemList';
import Dashboard from './pages/Dashboard';
import EmployeePage from './pages/EmployeePage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/item/:id" element={<ItemPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/itemlist" element={<ItemList />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/employee" 
              element={
                <ProtectedRoute>
                  <EmployeePage />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/account" 
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
