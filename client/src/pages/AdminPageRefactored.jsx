/**
 * Admin Page Component (Refactored)
 * Main admin dashboard for managing users with modular components
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Import smaller components
import AdminHeader from '../components/admin/AdminHeader';
import MessageDisplay from '../components/admin/MessageDisplay';
import SearchFilters from '../components/admin/SearchFilters';
import UsersTable from '../components/admin/UsersTable';
import Pagination from '../components/admin/Pagination';
import EditUserModal from '../components/admin/EditUserModal';
import ResetPasswordModal from '../components/admin/ResetPasswordModal';
import AdminPageStyles from '../components/admin/AdminPageStyles';

const API_URL = '/api/admin/users';

const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [resetUserId, setResetUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('grocerease_token');
      const params = new URLSearchParams({ q, role, sortBy, order, page, limit });
      const res = await fetch(`${API_URL}?${params}`, { 
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        setUsers(data.data?.users || []);
        setTotal(data.data?.total || 0);
      } else {
        setMessage({ text: data.message || 'Failed to fetch users', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error occurred', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [q, role, sortBy, order, page, limit]);

  // Delete user with better error handling
  const handleDelete = async (id, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) return;
    
    try {
      const token = localStorage.getItem('grocerease_token');
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        setMessage({ text: `User "${userName}" deleted successfully`, type: 'success' });
        fetchUsers();
      } else {
        const error = await res.json();
        setMessage({ text: error.message || 'Failed to delete user', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error occurred', type: 'error' });
    }
  };

  // Open edit modal
  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  // Submit edit with better error handling
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('grocerease_token');
      const res = await fetch(`/api/admin/users/${editUser._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        setMessage({ text: 'User updated successfully', type: 'success' });
        setEditUser(null);
        fetchUsers();
      } else {
        const error = await res.json();
        setMessage({ text: error.message || 'Failed to update user', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error occurred', type: 'error' });
    }
  };

  // Change role with better feedback
  const handleRoleChange = async (user, newRole) => {
    if (user.role === newRole) return;
    
    try {
      const token = localStorage.getItem('grocerease_token');
      const res = await fetch(`/api/admin/users/${user._id}/role`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      });
      
      if (res.ok) {
        setMessage({ text: `${user.name}'s role changed to ${newRole}`, type: 'success' });
        fetchUsers();
      } else {
        const error = await res.json();
        setMessage({ text: error.message || 'Failed to change role', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error occurred', type: 'error' });
    }
  };

  // Open reset password modal
  const openResetPassword = (userId, userName) => {
    setResetUserId({ id: userId, name: userName });
    setNewPassword('');
  };

  // Submit reset password with better feedback
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('grocerease_token');
      const res = await fetch(`/api/admin/users/${resetUserId.id}/reset-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ newPassword })
      });
      
      if (res.ok) {
        setMessage({ text: `Password reset for ${resetUserId.name}`, type: 'success' });
        setResetUserId(null);
        setNewPassword('');
      } else {
        const error = await res.json();
        setMessage({ text: error.message || 'Failed to reset password', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error occurred', type: 'error' });
    }
  };

  // Pagination controls
  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 60px)'
    }}>
      {/* Header */}
      <AdminHeader />

      {/* Message Display */}
      <MessageDisplay message={message} />

      {/* Filters and Controls */}
      <SearchFilters 
        q={q}
        setQ={setQ}
        role={role}
        setRole={setRole}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
      />

      {/* Users Table */}
      <UsersTable 
        users={users}
        loading={loading}
        total={total}
        onRoleChange={handleRoleChange}
        onEdit={openEdit}
        onResetPassword={openResetPassword}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <Pagination 
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />

      {/* Edit User Modal */}
      <EditUserModal 
        editUser={editUser}
        editForm={editForm}
        setEditForm={setEditForm}
        onSubmit={handleEditSubmit}
        onCancel={() => setEditUser(null)}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal 
        resetUserId={resetUserId}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        onSubmit={handleResetPassword}
        onCancel={() => setResetUserId(null)}
      />

      {/* Styles */}
      <AdminPageStyles />
    </div>
  );
};

export default AdminPage;
