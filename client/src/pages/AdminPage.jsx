import React, { useEffect, useState } from 'react';

const API_URL = '/api/admin/users';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [resetUserId, setResetUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams({ q, role, sortBy, order, page, limit });
    const res = await fetch(`${API_URL}?${params}`, { credentials: 'include' });
    const data = await res.json();
    setUsers(data.data?.users || []);
    setTotal(data.data?.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [q, role, sortBy, order, page, limit]);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    fetchUsers();
  };

  // Open edit modal
  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/admin/users/${editUser._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(editForm)
    });
    setEditUser(null);
    fetchUsers();
  };

  // Change role
  const handleRoleChange = async (user, newRole) => {
    await fetch(`/api/admin/users/${user._id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role: newRole })
    });
    fetchUsers();
  };

  // Open reset password modal
  const openResetPassword = (userId) => {
    setResetUserId(userId);
    setNewPassword('');
  };

  // Submit reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    await fetch(`/api/admin/users/${resetUserId}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ newPassword })
    });
    setResetUserId(null);
    setNewPassword('');
    fetchUsers();
  };

  // Pagination controls
  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin User Management</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Search by name"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <select value={role} onChange={e => setRole(e.target.value)} style={{ marginRight: 8 }}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ marginRight: 8 }}>
          <option value="createdAt">Created At</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
        </select>
        <select value={order} onChange={e => setOrder(e.target.value)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role}
                      <select
                        value={user.role}
                        onChange={e => handleRoleChange(user, e.target.value)}
                        style={{ marginLeft: 8 }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                    <td>
                      <button onClick={() => openEdit(user)} style={{ marginRight: 8 }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(user._id)} style={{ color: 'red', marginRight: 8 }}>
                        Delete
                      </button>
                      <button onClick={() => openResetPassword(user._id)}>
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div style={{ marginTop: 16 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <span style={{ margin: '0 8px' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <form
            onSubmit={handleEditSubmit}
            style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 300 }}
          >
            <h3>Edit User</h3>
            <div>
              <label>Name:</label>
              <input
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                required
                style={{ width: '100%', marginBottom: 8 }}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                required
                style={{ width: '100%', marginBottom: 8 }}
              />
            </div>
            <div>
              <label>Role:</label>
              <select
                value={editForm.role}
                onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                style={{ width: '100%', marginBottom: 8 }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" style={{ marginRight: 8 }}>Save</button>
            <button type="button" onClick={() => setEditUser(null)}>Cancel</button>
          </form>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetUserId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <form
            onSubmit={handleResetPassword}
            style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 300 }}
          >
            <h3>Reset Password</h3>
            <div>
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: '100%', marginBottom: 8 }}
              />
            </div>
            <button type="submit" style={{ marginRight: 8 }}>Reset</button>
            <button type="button" onClick={() => setResetUserId(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPage;