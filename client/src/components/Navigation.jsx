import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const publicNavItems = [
    { path: '/', label: 'Home' },
    { path: '/search', label: 'Search' },
    { path: '/itemlist', label: 'Browse Items' }
  ];

  return (
    <nav style={{
      background: 'white',
      padding: '15px 0',
      borderBottom: '1px solid #ddd',
      width: '100%',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        width: '100%',
        maxWidth: '100%'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          color: 'blue',
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          🛒 GrocerEase
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {/* Admin: Only Admin Panel */}
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin"
              style={{
                color: '#dc3545',
                textDecoration: 'none',
                fontWeight: 'bold',
                backgroundColor: '#fff5f5',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #fecaca',
                fontSize: '16px'
              }}
            >
              🛡️ Admin Panel
            </Link>
          )}
          {/* Employee: Only Employee Dashboard */}
          {isAuthenticated && user?.role === 'employee' && (
            <Link
              to="/employee"
              style={{
                color: 'blue',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Employee Dashboard
            </Link>
          )}
          {/* Regular user: All normal links */}
          {isAuthenticated && user?.role !== 'admin' && user?.role !== 'employee' && (
            <>
              {publicNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{ color: 'blue', textDecoration: 'none' }}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/dashboard" style={{ color: 'blue', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/groceryListOverview" style={{ color: 'blue', textDecoration: 'none' }}>My Lists</Link>
            </>
          )}

          {/* User Menu - Always show if authenticated */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid #ddd',
                  borderRadius: '20px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: '#333'
                }}
              >
                <span style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span style={{ fontSize: '14px' }}>
                  {user?.name || 'User'}
                </span>
                <span style={{ fontSize: '12px' }}>▼</span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  minWidth: '200px',
                  zIndex: 1000,
                  marginTop: '8px'
                }}>
                  <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                      {user?.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {user?.email}
                    </div>
                  </div>
                  
                  {/* Admin: all normal user links except Employee Dashboard */}
                  {user?.role === 'admin' && (
                    <>
                      <Link to="/" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>🏠 Home</Link>
                      <Link to="/search" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>🔍 Search</Link>
                      <Link to="/itemlist" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>📋 Browse Items</Link>
                      <Link to="/groceryListOverview" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>🛒 My Lists</Link>
                      <Link to="/dashboard" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>📊 Dashboard</Link>
                      <Link to="/account" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>⚙️ Account Settings</Link>
                    </>
                  )}
                  
                  {/* Employee: all normal user links plus Employee Dashboard */}
                  {user?.role === 'employee' && (
                    <>
                      <Link to="/" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>🏠 Home</Link>
                      <Link to="/search" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>🔍 Search</Link>
                      <Link to="/itemlist" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>📋 Browse Items</Link>
                      <Link to="/groceryListOverview" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>🛒 My Lists</Link>
                      <Link to="/dashboard" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>📊 Dashboard</Link>
                      <Link to="/account" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>⚙️ Account Settings</Link>
                      <Link to="/employee" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>👷 Employee Dashboard</Link>
                    </>
                  )}
                  
                  {/* Regular users: Dashboard and Account Settings */}
                  {user?.role !== 'admin' && user?.role !== 'employee' && (
                    <>
                      <Link to="/dashboard" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>📊 Dashboard</Link>
                      <Link to="/account" onClick={() => setShowUserMenu(false)} style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}>⚙️ Account Settings</Link>
                    </>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#dc3545',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                color: 'white',
                textDecoration: 'none',
                backgroundColor: '#007bff',
                padding: '8px 16px',
                borderRadius: '5px',
                fontWeight: '600'
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 999
          }}
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navigation;
