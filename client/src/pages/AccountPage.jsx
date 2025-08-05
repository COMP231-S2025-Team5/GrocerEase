/**
 * Account Page Component (Refactored)
 * Main account settings page with modular components
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import smaller components
import AccountHeader from '../components/account/AccountHeader';
import LoadingGuard from '../components/account/LoadingGuard';
import ProfileCard from '../components/account/ProfileCard';
import SecuritySettingsCard from '../components/account/SecuritySettingsCard';
import DangerZoneCard from '../components/account/DangerZoneCard';
import PasswordChangeModal from '../components/account/PasswordChangeModal';
import DeleteAccountModal from '../components/account/DeleteAccountModal';
import AccountPageStyles from '../components/account/AccountPageStyles';

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
    return <LoadingGuard />;
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

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordFormData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordFormData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordFormData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordFormData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!passwordFormData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    
    if (!validatePasswordForm()) {
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

  const handlePasswordClose = () => {
    setShowPasswordChange(false);
    setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
    setPasswordMessage({ text: '', type: '' });
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setDeleteConfirmation('');
    setDeleteMessage({ text: '', type: '' });
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
      <AccountHeader />

      {/* Profile Information Card */}
      <ProfileCard 
        user={user}
        isEditing={isEditing}
        editFormData={editFormData}
        editErrors={editErrors}
        editLoading={editLoading}
        editMessage={editMessage}
        onStartEditing={startEditing}
        onInputChange={handleEditInputChange}
        onSubmit={handleEditSubmit}
        onCancel={cancelEditing}
        formatDate={formatDate}
      />

      {/* Security Settings Card */}
      <SecuritySettingsCard 
        onPasswordChange={() => setShowPasswordChange(true)}
      />

      {/* Danger Zone Card */}
      <DangerZoneCard 
        onDeleteAccount={() => setShowDeleteModal(true)}
      />

      {/* Password Change Modal */}
      <PasswordChangeModal 
        isOpen={showPasswordChange}
        passwordFormData={passwordFormData}
        passwordErrors={passwordErrors}
        passwordLoading={passwordLoading}
        passwordMessage={passwordMessage}
        onInputChange={handlePasswordInputChange}
        onSubmit={handlePasswordSubmit}
        onClose={handlePasswordClose}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal 
        isOpen={showDeleteModal}
        deleteConfirmation={deleteConfirmation}
        deleteLoading={deleteLoading}
        deleteMessage={deleteMessage}
        onConfirmationChange={(e) => setDeleteConfirmation(e.target.value)}
        onSubmit={handleDeleteAccount}
        onClose={handleDeleteClose}
      />

      {/* CSS for loading spinner animation */}
      <AccountPageStyles />
    </div>
  );
};

export default AccountPage;
