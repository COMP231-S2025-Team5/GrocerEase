import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const { login, register, isAuthenticated, user, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination (where user was trying to go before login)
  const from = location.state?.from?.pathname || null;

  // Redirect if already authenticated with role-based routing
  useEffect(() => {
    if (isAuthenticated && user) {
      // If user is already authenticated, redirect to their appropriate dashboard
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'employee') {
        navigate('/employee', { replace: true });
      } else {
        navigate(from || '/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  // Handle browser autofill errors gracefully
  useEffect(() => {
    const handleError = (event) => {
      if (event.error && event.error.message && 
          (event.error.message.includes('insertBefore') || 
           event.error.message.includes('Child to insert before is not a child'))) {
        // Suppress autofill-related DOM errors
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    window.addEventListener('error', handleError, true);
    return () => window.removeEventListener('error', handleError, true);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Name validation (registration only)
    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters long';
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password) && !isLogin) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation (registration only)
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear general message when user starts typing
    if (message.text) {
      setMessage({ text: '', type: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const requestBody = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            name: formData.name, 
            email: formData.email, 
            password: formData.password 
          };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        if (isLogin) {
          // Backend returns user data in data.data structure
          const userData = data.data?.user || data.user;
          const userToken = data.data?.token || data.token;
          
          console.log('Login successful, user data:', userData); // Debug log
          
          setAuth(userToken, userData);
          
          // Role-based redirection
          if (userData.role === 'admin') {
            navigate('/admin', { replace: true });
          } else if (userData.role === 'employee') {
            navigate('/employee', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          setMessage({ 
            text: 'Account created successfully! Please sign in.', 
            type: 'success' 
          });
          setIsLogin(true);
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
        }
      } else {
        setMessage({ 
          text: data.message || `${isLogin ? 'Login' : 'Registration'} failed`, 
          type: 'error' 
        });
      }
    } catch (err) {
      setMessage({ 
        text: 'Network error. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setMessage({ text: '', type: '' });
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '6px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#f0f8ff',
    color: '#333'
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#dc3545',
    color: '#333'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: loading ? '#6c757d' : '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 60px)',
      width: '100%',
      padding: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid #e1e5e9'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            color: '#333',
            marginBottom: '8px',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            {isLogin 
              ? 'Sign in to access your GrocerEase account' 
              : 'Join GrocerEase to start finding great deals'
            }
          </p>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            color: message.type === 'success' ? '#155724' : '#721c24'
          }}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="on">
          {/* Name Field (Registration only) */}
          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                style={errors.name ? errorInputStyle : inputStyle}
              />
              {errors.name && (
                <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              autoComplete={isLogin ? "username" : "email"}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              style={errors.email ? errorInputStyle : inputStyle}
            />
            {errors.email && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={formData.password}
              onChange={handleInputChange}
              placeholder={isLogin ? "Enter your password" : "Create a strong password"}
              style={errors.password ? errorInputStyle : inputStyle}
            />
            {errors.password && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                {errors.password}
              </p>
            )}
            {!isLogin && (
              <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                Must contain at least 6 characters with uppercase, lowercase, and number
              </p>
            )}
          </div>

          {/* Confirm Password Field (Registration only) */}
          {!isLogin && (
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333'
              }}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                style={errors.confirmPassword ? errorInputStyle : inputStyle}
              />
              {errors.confirmPassword && (
                <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? (
              <>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }}></span>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Toggle between login and registration */}
        <div style={{
          textAlign: 'center',
          marginTop: '25px',
          paddingTop: '20px',
          borderTop: '1px solid #e1e5e9'
        }}>
          <p style={{ color: '#666', marginBottom: '8px' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={toggleMode}
            style={{
              color: '#007bff',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Create an account' : 'Sign in instead'}
          </button>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link
            to="/"
            style={{
              color: '#6c757d',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
