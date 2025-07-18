import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/search', label: 'Search' },
    { path: '/login', label: 'Login' }
  ];

  return (
    <nav style={{
      background: 'white',
      padding: '15px 0',
      borderBottom: '1px solid #ddd',
      width: '100%'
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
          GrocerEase
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                color: 'blue',
                textDecoration: 'none'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
