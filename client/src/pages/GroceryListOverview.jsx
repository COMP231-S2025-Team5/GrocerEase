import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GroceryListOverview = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem('grocerease_token');
        const res = await fetch('/api/grocery-lists', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (data.success) {
          setLists(data.lists || []);
        } else {
          console.error('Failed to fetch lists:', data.message);
          setLists([]);
        }
      } catch (err) {
        console.error('Failed to fetch lists:', err);
        setLists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  const handleOpenList = (listId) => {
    navigate(`/groceryListPage/${listId}`);
  };

  // Function to handle deleting a grocery list
  const handleDeleteList = async (listId) => {
    const confirm = window.confirm('Are you sure you want to delete this list?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('grocerease_token');
      const res = await fetch(`/api/grocery-lists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete list');
      }

      // Remove the deleted list from state
      setLists(prev => prev.filter(list => list._id !== listId));
    } catch (err) {
      console.error('Error deleting list:', err);
      alert('Could not delete the list.');
    }
  };

  // Function to create a new grocery list
  const handleCreateList = async () => {
    if (!newListName.trim()) {
      alert('Please enter a list name');
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem('grocerease_token');
      const res = await fetch('/api/grocery-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newListName.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Add the new list to the state
          setLists(prev => [...prev, data.list]);
          // Reset form
          setNewListName('');
          setShowCreateModal(false);
        } else {
          alert('Failed to create list: ' + data.message);
        }
      } else {
        const errorData = await res.json();
        alert('Failed to create list: ' + errorData.message);
      }
    } catch (err) {
      console.error('Error creating list:', err);
      alert('Could not create the list.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 60px)'
    }}>
      {/* Header Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '30px',
        marginBottom: '30px',
        textAlign: 'center',
        border: '1px solid #e1e5e9'
      }}>
        <h1 style={{
          color: '#333',
          marginBottom: '15px',
          fontSize: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          🛒 Your Grocery Lists
        </h1>
        <p style={{
          color: '#666',
          fontSize: '1.1rem',
          marginBottom: '25px'
        }}>
          Keep track of your shopping with organized grocery lists
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '12px 30px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(40, 167, 69, 0.2)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#218838';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#28a745';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ➕ Create New List
        </button>
      </div>

      {/* Content Area */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '30px',
        border: '1px solid #e1e5e9'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></div>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading your lists...</p>
          </div>
        ) : lists.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📝</div>
            <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '1.8rem' }}>
              No grocery lists yet!
            </h3>
            <p style={{ 
              color: '#666', 
              marginBottom: '30px', 
              fontSize: '1.1rem',
              maxWidth: '400px',
              margin: '0 auto 30px auto',
              lineHeight: '1.6'
            }}>
              Create your first grocery list to start organizing your shopping. 
              You can add items, track quantities, and never forget what you need!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '15px 35px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '600',
                boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '0 auto'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#0056b3';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 12px rgba(0, 123, 255, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#007bff';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)';
              }}
            >
              🚀 Create Your First List
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{
              color: '#333',
              marginBottom: '25px',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📋 Your Lists ({lists.length})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {lists.map(list => (
                <div
                  key={list._id}
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#007bff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e9ecef';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{
                      color: '#333',
                      marginBottom: '8px',
                      fontSize: '1.3rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🛍️ {list.listName}
                    </h4>
                    <p style={{
                      color: '#666',
                      margin: 0,
                      fontSize: '0.95rem'
                    }}>
                      {list.items?.length || 0} {(list.items?.length || 0) === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '15px'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenList(list._id);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 15px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                    >
                      📂 Open
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list._id);
                      }}
                      style={{
                        padding: '10px 15px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
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
            padding: '30px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h3>Create New Grocery List</h3>
            <input
              type="text"
              placeholder="Enter list name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '20px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                backgroundColor: '#f0f8ff',
                color: '#333',
                outline: 'none'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !creating) {
                  handleCreateList();
                }
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewListName('');
                }}
                disabled={creating}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: creating ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                disabled={creating || !newListName.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: creating || !newListName.trim() ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: creating || !newListName.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {creating ? 'Creating...' : 'Create List'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroceryListOverview;
