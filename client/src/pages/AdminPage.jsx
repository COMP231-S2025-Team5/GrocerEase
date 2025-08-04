import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid #e1e5e9'
      }}>
        <h1 style={{
          color: '#333',
          marginBottom: '10px',
          fontSize: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          🛡️ Admin Dashboard
        </h1>
        <p style={{
          color: '#666',
          fontSize: '1.1rem',
          margin: 0
        }}>
          Manage user accounts, roles, and permissions
        </p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div style={{
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      {/* Filters and Controls */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '25px',
        marginBottom: '20px',
        border: '1px solid #e1e5e9'
      }}>
        <h3 style={{
          color: '#333',
          marginBottom: '20px',
          fontSize: '1.3rem'
        }}>
          Search & Filter
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Search by Name
            </label>
            <input
              type="text"
              placeholder="Enter user name..."
              value={q}
              onChange={e => setQ(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'border-color 0.2s',
                outline: 'none',
                backgroundColor: 'white',
                color: '#333'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Filter by Role
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer'
              }}
            >
              <option value="">All Roles</option>
              <option value="user" style={{ color: '#333', backgroundColor: 'white' }}>👤 User</option>
              <option value="employee" style={{ color: '#333', backgroundColor: 'white' }}>👷 Employee</option>
              <option value="admin" style={{ color: '#333', backgroundColor: 'white' }}>🛡️ Admin</option>
            </select>
          </div>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer'
              }}
            >
              <option value="createdAt" style={{ color: '#333', backgroundColor: 'white' }}>📅 Created Date</option>
              <option value="name" style={{ color: '#333', backgroundColor: 'white' }}>👤 Name</option>
              <option value="email" style={{ color: '#333', backgroundColor: 'white' }}>📧 Email</option>
            </select>
          </div>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '600',
              color: '#333',
              fontSize: '14px'
            }}>
              Order
            </label>
            <select
              value={order}
              onChange={e => setOrder(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer'
              }}
            >
              <option value="desc" style={{ color: '#333', backgroundColor: 'white' }}>⬇️ Descending</option>
              <option value="asc" style={{ color: '#333', backgroundColor: 'white' }}>⬆️ Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid #e1e5e9'
      }}>
        <div style={{
          padding: '25px 25px 15px 25px',
          borderBottom: '1px solid #e1e5e9'
        }}>
          <h3 style={{
            color: '#333',
            margin: 0,
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>👥 User Accounts ({total} total)</span>
            {loading && (
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #f3f3f3',
                borderTop: '2px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            )}
          </h3>
        </div>

        {loading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px auto'
            }}></div>
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👤</div>
            <h4 style={{ marginBottom: '10px' }}>No users found</h4>
            <p>Try adjusting your search criteria</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#333',
                    borderBottom: '2px solid #e1e5e9'
                  }}>Name</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#333',
                    borderBottom: '2px solid #e1e5e9'
                  }}>Email</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#333',
                    borderBottom: '2px solid #e1e5e9'
                  }}>Role</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#333',
                    borderBottom: '2px solid #e1e5e9'
                  }}>Created</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#333',
                    borderBottom: '2px solid #e1e5e9'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} style={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                    transition: 'background-color 0.2s'
                  }}>
                    <td style={{
                      padding: '15px',
                      borderBottom: '1px solid #e1e5e9',
                      fontWeight: '500'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td style={{
                      padding: '15px',
                      borderBottom: '1px solid #e1e5e9',
                      color: '#666'
                    }}>
                      {user.email}
                    </td>
                    <td style={{
                      padding: '15px',
                      borderBottom: '1px solid #e1e5e9'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: user.role === 'admin' ? '#dc3545' : user.role === 'employee' ? '#28a745' : '#007bff',
                          color: 'white'
                        }}>
                          {user.role === 'admin' ? '🛡️' : user.role === 'employee' ? '👷' : '👤'} {user.role}
                        </span>
                        <select
                          value={user.role}
                          onChange={e => handleRoleChange(user, e.target.value)}
                          disabled={user.role === 'admin'}
                          style={{
                            padding: '4px 8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: user.role === 'admin' ? '#f8f9fa' : 'white',
                            color: user.role === 'admin' ? '#6c757d' : '#333',
                            cursor: user.role === 'admin' ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <option value="user" style={{ color: '#333', backgroundColor: 'white' }}>👤 User</option>
                          <option value="employee" style={{ color: '#333', backgroundColor: 'white' }}>👷 Employee</option>
                          <option value="admin" style={{ color: '#333', backgroundColor: 'white' }}>🛡️ Admin</option>
                        </select>
                      </div>
                    </td>
                    <td style={{
                      padding: '15px',
                      borderBottom: '1px solid #e1e5e9',
                      color: '#666'
                    }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{
                      padding: '15px',
                      borderBottom: '1px solid #e1e5e9',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => openEdit(user)}
                          disabled={user.role === 'admin'}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: user.role === 'admin' ? '#6c757d' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: user.role === 'admin' ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'background-color 0.2s',
                            opacity: user.role === 'admin' ? 0.6 : 1
                          }}
                          onMouseOver={(e) => {
                            if (user.role !== 'admin') {
                              e.target.style.backgroundColor = '#218838';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (user.role !== 'admin') {
                              e.target.style.backgroundColor = '#28a745';
                            }
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openResetPassword(user._id, user.name)}
                          disabled={user.role === 'admin'}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: user.role === 'admin' ? '#6c757d' : '#ffc107',
                            color: user.role === 'admin' ? 'white' : '#212529',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: user.role === 'admin' ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'background-color 0.2s',
                            opacity: user.role === 'admin' ? 0.6 : 1
                          }}
                          onMouseOver={(e) => {
                            if (user.role !== 'admin') {
                              e.target.style.backgroundColor = '#e0a800';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (user.role !== 'admin') {
                              e.target.style.backgroundColor = '#ffc107';
                            }
                          }}
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          disabled={user.role === 'admin'}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: user.role === 'admin' ? '#6c757d' : '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: user.role === 'admin' ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'background-color 0.2s',
                            opacity: user.role === 'admin' ? 0.6 : 1
                          }}
                          onMouseOver={(e) => {
                            if (user.role !== 'admin') {
                              e.target.style.backgroundColor = '#c82333';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (user.role !== 'admin') {
                              e.target.style.backgroundColor = '#dc3545';
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: '20px 25px',
            borderTop: '1px solid #e1e5e9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{ color: '#666', fontSize: '14px' }}>
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} users
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: '8px 12px',
                  backgroundColor: page === 1 ? '#e9ecef' : '#007bff',
                  color: page === 1 ? '#6c757d' : 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Previous
              </button>
              <span style={{
                padding: '8px 12px',
                backgroundColor: '#e9ecef',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: '8px 12px',
                  backgroundColor: page === totalPages ? '#e9ecef' : '#007bff',
                  color: page === totalPages ? '#6c757d' : 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '30px',
            minWidth: '400px',
            maxWidth: '90%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{
              color: '#333',
              marginBottom: '20px',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              ✏️ Edit User Account
            </h3>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '600',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    color: '#333',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '600',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    color: '#333',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                />
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '600',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  User Role
                </label>
                <select
                  value={editForm.role}
                  onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    color: '#333',
                    cursor: 'pointer'
                  }}
                >
                  <option value="user" style={{ color: '#333', backgroundColor: 'white' }}>👤 User</option>
                  <option value="employee" style={{ color: '#333', backgroundColor: 'white' }}>👷 Employee</option>
                  <option value="admin" style={{ color: '#333', backgroundColor: 'white' }}>🛡️ Admin</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetUserId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '30px',
            minWidth: '400px',
            maxWidth: '90%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{
              color: '#333',
              marginBottom: '15px',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🔑 Reset Password
            </h3>
            <p style={{
              color: '#666',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              Setting a new password for <strong>{resetUserId.name}</strong>
            </p>
            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '600',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter new password (min 6 characters)"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    color: '#333',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setResetUserId(null)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#ffc107',
                    color: '#212529',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  🔑 Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AdminPage;