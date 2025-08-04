import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [groceryLists, setGroceryLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);

  useEffect(() => {
    const fetchGroceryLists = async () => {
      if (!user) return;
      
      try {
        const token = localStorage.getItem('grocerease_token');
        const response = await fetch('/api/grocery-lists', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setGroceryLists(data.lists || []);
        }
      } catch (error) {
        console.error('Error fetching grocery lists:', error);
      } finally {
        setListsLoading(false);
      }
    };

    fetchGroceryLists();
  }, [user]);

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
        <h2>Please log in to access your dashboard</h2>
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

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
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
          Welcome back, {user.name}! 👋
        </h1>
        <p style={{ color: '#666' }}>
          Your personal GrocerEase dashboard
        </p>
      </div>

      {/* User Info Card */}
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
          👤 Profile Information
        </h2>
        
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
      </div>

      {/* Quick Actions */}
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
          🚀 Quick Actions
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr',
          gap: '20px'
        }}>
          <Link
            to="/search"
            style={{
              display: 'block',
              padding: '20px',
              backgroundColor: '#e7f3ff',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              border: '1px solid #b8e0ff',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔍</div>
            <h3 style={{ color: '#0066cc', margin: '0 0 8px 0' }}>Search Items</h3>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              Find the best deals on groceries
            </p>
          </Link>

          <Link
            to="/itemlist"
            style={{
              display: 'block',
              padding: '20px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              border: '1px solid #c7d2fe',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📋</div>
            <h3 style={{ color: '#4f46e5', margin: '0 0 8px 0' }}>Browse All Items</h3>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              Explore our complete inventory
            </p>
          </Link>

          <div
            style={{
              padding: '20px',
              backgroundColor: '#fef7f7',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #fecaca',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            onClick={logout}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚪</div>
            <h3 style={{ color: '#dc2626', margin: '0 0 8px 0' }}>Logout</h3>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              Sign out of your account
            </p>
          </div>
        </div>
      </div>

      {/* My Grocery Lists */}
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
            🛒 My Grocery Lists
          </h2>
          <Link
            to="/groceryListOverview"
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            View All →
          </Link>
        </div>
        
        {listsLoading ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            Loading your lists...
          </p>
        ) : groceryLists.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '2px dashed #dee2e6'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📝</div>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No grocery lists yet</h3>
            <p style={{ color: '#999', marginBottom: '20px' }}>
              Create your first grocery list to start organizing your shopping!
            </p>
            <Link
              to="/groceryListOverview"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '600'
              }}
            >
              Create Your First List
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
            gap: '15px'
          }}>
            {groceryLists.slice(0, 3).map((list) => (
              <Link
                key={list._id}
                to={`/groceryListPage/${list._id}`}
                style={{
                  display: 'block',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  border: '1px solid #dee2e6',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}>
                  <h4 style={{
                    color: '#333',
                    margin: 0,
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    {list.listName}
                  </h4>
                  <span style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {list.items?.length || 0} items
                  </span>
                </div>
                <p style={{
                  color: '#666',
                  margin: 0,
                  fontSize: '14px'
                }}>
                  {list.items?.length === 0 
                    ? 'Empty list - start adding items!'
                    : `Contains ${list.items.length} item${list.items.length !== 1 ? 's' : ''}`
                  }
                </p>
              </Link>
            ))}
            
            {groceryLists.length > 3 && (
              <Link
                to="/groceryListOverview"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  backgroundColor: '#e7f3ff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  border: '2px dashed #007bff',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#d1ecf1';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#e7f3ff';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>➕</div>
                <span style={{ color: '#007bff', fontWeight: '600' }}>
                  View {groceryLists.length - 3} more lists
                </span>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Account Management */}
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
          ⚙️ Account Management
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Link
            to="/account"
            style={{
              display: 'block',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              border: '1px solid #dee2e6',
              transition: 'transform 0.2s',
              minWidth: '280px'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👤</div>
            <h3 style={{ color: '#495057', margin: '0 0 8px 0' }}>Account Settings</h3>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              Edit profile, change password, manage account
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
