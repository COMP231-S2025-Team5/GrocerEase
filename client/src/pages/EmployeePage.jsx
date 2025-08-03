/**
 * Employee Page - Main page for employee functionality
 * Integrates the EmployeeDashboard component
 */

import React from 'react';
import EmployeeDashboard from '../components/EmployeeDashboard';
import { useAuth } from '../contexts/AuthContext';

const EmployeePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Please log in to access the employee dashboard.</p>
      </div>
    );
  }

  if (user.role !== 'employee' && user.role !== 'admin') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>This page is only accessible to employees and administrators.</p>
      </div>
    );
  }

  return <EmployeeDashboard />;
};

export default EmployeePage;
