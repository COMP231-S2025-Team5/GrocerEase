/**
 * User Row Component
 * Displays individual user information in the table
 */

import React from 'react';
import ActionButtons from './ActionButtons';

const UserRow = ({ 
  user, 
  index, 
  onRoleChange, 
  onEdit, 
  onResetPassword, 
  onDelete 
}) => {
  return (
    <tr style={{
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
            onChange={e => onRoleChange(user, e.target.value)}
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
        <ActionButtons 
          user={user}
          onEdit={onEdit}
          onResetPassword={onResetPassword}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
};

export default UserRow;
