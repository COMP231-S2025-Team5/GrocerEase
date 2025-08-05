/**
 * Users Table Component
 * Main table displaying user information with loading and empty states
 */

import React from 'react';
import AdminLoadingSpinner from './AdminLoadingSpinner';
import UserRow from './UserRow';

const UsersTable = ({ 
  users, 
  loading, 
  total, 
  onRoleChange, 
  onEdit, 
  onResetPassword, 
  onDelete 
}) => {
  return (
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
        <AdminLoadingSpinner />
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
                <UserRow 
                  key={user._id}
                  user={user}
                  index={index}
                  onRoleChange={onRoleChange}
                  onEdit={onEdit}
                  onResetPassword={onResetPassword}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
