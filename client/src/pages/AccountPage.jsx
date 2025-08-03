import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState({ text: '', type: '' });

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  // Account deletion state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState({ text: '', type: '' });

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 60px)',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>Please log in to access your account</h2>
        <Link 
          to="/login"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Validation functions
  const validateEditForm = (data) => {
    const errors = {};
    
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    return errors;
  };

  const validatePasswordForm = (data) => {
    const errors = {};
    
    if (!data.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!data.newPassword || data.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters long';
    }
    
    if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  // API functions
  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('grocerease_token');
    const response = await fetch('/api/auth/update-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    return response.json();
  };

  const changePassword = async (passwordData) => {
    const token = localStorage.getItem('grocerease_token');
    const response = await fetch('/api/auth/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordData)
    });
    return response.json();
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem('grocerease_token');
    const response = await fetch('/api/auth/delete-account', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  };

  // Event handlers
  const startEditing = () => {
    setIsEditing(true);
    setEditFormData({
      name: user.name,
      email: user.email
    });
    setEditErrors({});
    setEditMessage({ text: '', type: '' });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditFormData({
      name: user.name,
      email: user.email
    });
    setEditErrors({});
    setEditMessage({ text: '', type: '' });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (editErrors[name]) {
      setEditErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errors = validateEditForm(editFormData);
    
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setEditLoading(true);
    setEditMessage({ text: '', type: '' });

    try {
      const response = await updateProfile(editFormData);
      
      if (response.success) {
        setEditMessage({ text: 'Profile updated successfully!', type: 'success' });
        setIsEditing(false);
        // Update user context would happen here in a real app
        setTimeout(() => {
          window.location.reload(); // Simple refresh for now
        }, 1500);
      } else {
        setEditMessage({ text: response.message || 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      setEditMessage({ text: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePasswordForm(passwordFormData);
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage({ text: '', type: '' });

    try {
      const response = await changePassword(passwordFormData);
      
      if (response.success) {
        setPasswordMessage({ text: 'Password changed successfully!', type: 'success' });
        setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setShowPasswordChange(false);
          setPasswordMessage({ text: '', type: '' });
        }, 2000);
      } else {
        setPasswordMessage({ text: response.message || 'Failed to change password', type: 'error' });
      }
    } catch (error) {
      setPasswordMessage({ text: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setDeleteMessage({ text: 'Please type "DELETE" to confirm', type: 'error' });
      return;
    }

    setDeleteLoading(true);
    setDeleteMessage({ text: '', type: '' });

    try {
      const response = await deleteAccount();
      
      if (response.success) {
        setDeleteMessage({ text: 'Account deleted successfully. Redirecting...', type: 'success' });
        setTimeout(() => {
          logout();
          navigate('/');
        }, 2000);
      } else {
        setDeleteMessage({ text: response.message || 'Failed to delete account', type: 'error' });
      }
    } catch (error) {
      setDeleteMessage({ text: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%',
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 60px)'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#333',
          marginBottom: '10px',
          fontSize: '2.5rem'
        }}>
          Account Settings ⚙️
        </h1>
        <p style={{ color: '#666' }}>
          Manage your profile information and account preferences
        </p>
      </div>

      {/* Breadcrumb */}
      <div style={{
        marginBottom: '20px',
        fontSize: '14px',
        color: '#666'
      }}>
        <Link to="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>
          Dashboard
        </Link>
        {' > '}
        <span>Account Settings</span>
      </div>

      {/* Profile Information Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid #e1e5e9'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            color: '#333',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: 0
          }}>
            👤 Profile Information
          </h2>
          
          {!isEditing && (
            <button
              onClick={startEditing}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Edit Message */}
        {editMessage.text && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            backgroundColor: editMessage.type === 'success' ? '#d4edda' : '#f8d7da',
            border: `1px solid ${editMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            color: editMessage.type === 'success' ? '#155724' : '#721c24'
          }}>
            {editMessage.text}
          </div>
        )}
        
        {isEditing ? (
          // Edit Form
          <form onSubmit={handleEditSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
              gap: '20px',
              marginBottom: '25px'
            }}>
              <div>
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
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${editErrors.name ? '#dc3545' : '#e1e5e9'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    outline: 'none',
                    backgroundColor: '#f0f8ff',
                    color: '#333'
                  }}
                />
                {editErrors.name && (
                  <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>
                    {editErrors.name}
                  </p>
                )}
              </div>
              
              <div>
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
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${editErrors.email ? '#dc3545' : '#e1e5e9'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    outline: 'none',
                    backgroundColor: '#f0f8ff',
                    color: '#333'
                  }}
                />
                {editErrors.email && (
                  <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>
                    {editErrors.email}
                  </p>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={editLoading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: editLoading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  opacity: editLoading ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editLoading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: editLoading ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: editLoading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {editLoading && (
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></span>
                )}
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          // Display Mode
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
            gap: '20px',
            color: '#333'
          }}>
            <div>
              <strong>Full Name:</strong>
              <p style={{ margin: '5px 0', color: '#666' }}>{user.name}</p>
            </div>
            <div>
              <strong>Email Address:</strong>
              <p style={{ margin: '5px 0', color: '#666' }}>{user.email}</p>
            </div>
            <div>
              <strong>Account Type:</strong>
              <p style={{ margin: '5px 0', color: '#666', textTransform: 'capitalize' }}>
                {user.role} Account
              </p>
            </div>
            <div>
              <strong>Member Since:</strong>
              <p style={{ margin: '5px 0', color: '#666' }}>
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Security Settings Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid #e1e5e9'
      }}>
        <h2 style={{
          color: '#333',
          marginBottom: '20px',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🔒 Security Settings
        </h2>
        
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth > 768 ? 'row' : 'column',
          gap: '15px'
        }}>
          <button
            onClick={() => setShowPasswordChange(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center'
            }}
          >
            🔑 Change Password
          </button>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '30px',
        marginBottom: '30px',
        border: '2px solid #dc3545'
      }}>
        <h2 style={{
          color: '#dc3545',
          marginBottom: '15px',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          ⚠️ Danger Zone
        </h2>
        
        <p style={{
          color: '#666',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        
        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🗑️ Delete Account
        </button>
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e1e5e9'
          }}>
            <h3 style={{
              color: '#333',
              marginBottom: '20px',
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🔒 Change Password
            </h3>

            {passwordMessage.text && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '20px',
                backgroundColor: passwordMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                border: `1px solid ${passwordMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                color: passwordMessage.type === 'success' ? '#155724' : '#721c24'
              }}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Current Password *
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordFormData.currentPassword}
                  onChange={handlePasswordInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${passwordErrors.currentPassword ? '#dc3545' : '#e1e5e9'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    outline: 'none',
                    backgroundColor: '#f0f8ff',
                    color: '#333'
                  }}
                />
                {passwordErrors.currentPassword && (
                  <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  New Password *
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordFormData.newPassword}
                  onChange={handlePasswordInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${passwordErrors.newPassword ? '#dc3545' : '#e1e5e9'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    outline: 'none',
                    backgroundColor: '#f0f8ff',
                    color: '#333'
                  }}
                />
                {passwordErrors.newPassword && (
                  <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordFormData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${passwordErrors.confirmPassword ? '#dc3545' : '#e1e5e9'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    outline: 'none',
                    backgroundColor: '#f0f8ff',
                    color: '#333'
                  }}
                />
                {passwordErrors.confirmPassword && (
                  <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordErrors({});
                    setPasswordMessage({ text: '', type: '' });
                  }}
                  disabled={passwordLoading}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: passwordLoading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    opacity: passwordLoading ? 0.6 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: passwordLoading ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: passwordLoading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {passwordLoading && (
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></span>
                  )}
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e1e5e9'
          }}>
            <h3 style={{
              color: '#dc3545',
              marginBottom: '20px',
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              ⚠️ Delete Account
            </h3>

            {deleteMessage.text && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '20px',
                backgroundColor: deleteMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                border: `1px solid ${deleteMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                color: deleteMessage.type === 'success' ? '#155724' : '#721c24'
              }}>
                {deleteMessage.text}
              </div>
            )}

            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '20px',
              color: '#856404'
            }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>
                ⚠️ Warning: This action cannot be undone!
              </p>
              <p style={{ margin: 0, fontSize: '14px' }}>
                Deleting your account will permanently remove all your data, including your profile information and any reports you've submitted. This action is irreversible.
              </p>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333'
              }}>
                Type "DELETE" to confirm account deletion:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE to confirm"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '6px',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: '#f0f8ff',
                  color: '#333'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                  setDeleteMessage({ text: '', type: '' });
                }}
                disabled={deleteLoading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: deleteLoading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  opacity: deleteLoading ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirmation !== 'DELETE'}
                style={{
                  padding: '12px 24px',
                  backgroundColor: (deleteLoading || deleteConfirmation !== 'DELETE') ? '#6c757d' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: (deleteLoading || deleteConfirmation !== 'DELETE') ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {deleteLoading && (
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></span>
                )}
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for loading spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AccountPage;
