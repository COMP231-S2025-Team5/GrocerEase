import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Homepage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{
      minHeight: '80vh',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Hero Section */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '3rem',
            color: '#333',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            🛒 GrocerEase
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#666',
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            Make grocery shopping simple, organized, and stress-free!
          </p>
        </div>

        {isAuthenticated ? (
          // Logged-in user content
          <div>
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '30px',
              border: '2px solid #e9ecef'
            }}>
              <h2 style={{
                color: '#333',
                fontSize: '1.8rem',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                👋 Welcome back, {user?.name || 'Friend'}!
              </h2>
              <p style={{
                color: '#666',
                fontSize: '1.1rem',
                marginBottom: '25px'
              }}>
                Ready to tackle your grocery shopping? Let's get organized!
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <Link
                to="/grocery-lists"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '25px',
                  borderRadius: '12px',
                  transition: 'all 0.3s',
                  display: 'block'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#218838';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#28a745';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📋</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>My Lists</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>View and manage your grocery lists</p>
              </Link>

              <Link
                to="/search"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '25px',
                  borderRadius: '12px',
                  transition: 'all 0.3s',
                  display: 'block'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#0056b3';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#007bff';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔍</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>Search Items</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Find products to add to your lists</p>
              </Link>

              <Link
                to="/dashboard"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  padding: '25px',
                  borderRadius: '12px',
                  transition: 'all 0.3s',
                  display: 'block'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#5a2d91';
                  e.target.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#6f42c1';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>Dashboard</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>View your shopping insights</p>
              </Link>
            </div>
          </div>
        ) : (
          // Guest user content
          <div>
            <div style={{
              backgroundColor: '#fff3cd',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '30px',
              border: '2px solid #ffeaa7'
            }}>
              <h2 style={{
                color: '#856404',
                fontSize: '1.8rem',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                🌟 Transform Your Shopping Experience
              </h2>
              <p style={{
                color: '#856404',
                fontSize: '1.1rem',
                marginBottom: 0
              }}>
                Join thousands of users who have simplified their grocery shopping!
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #e9ecef'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✅</div>
                <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '8px' }}>Organize Lists</h3>
                <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>Create and manage multiple grocery lists</p>
              </div>

              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #e9ecef'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎯</div>
                <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '8px' }}>Smart Search</h3>
                <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>Find products quickly with advanced filters</p>
              </div>

              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #e9ecef'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📱</div>
                <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '8px' }}>Always Available</h3>
                <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>Access your lists anywhere, anytime</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#218838';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#28a745';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🚀 Get Started Free
              </Link>

              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  backgroundColor: 'transparent',
                  color: '#007bff',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  border: '2px solid #007bff',
                  transition: 'all 0.3s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#007bff';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#007bff';
                }}
              >
                👤 Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
