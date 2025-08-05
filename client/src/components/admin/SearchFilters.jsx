/**
 * Search Filters Component
 * Provides search and filtering controls for the users table
 */

import React from 'react';

const SearchFilters = ({ 
  q, 
  setQ, 
  role, 
  setRole, 
  sortBy, 
  setSortBy, 
  order, 
  setOrder 
}) => {
  return (
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
  );
};

export default SearchFilters;
