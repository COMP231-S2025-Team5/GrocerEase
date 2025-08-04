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
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Your Grocery Lists</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create New List
        </button>
      </div>

      {loading ? (
        <p>Loading lists...</p>
      ) : lists.length === 0 ? (
        <div>
          <p>No lists yet. Create one to get started.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Your First List
          </button>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {lists.map(list => (
            <li key={list._id} style={{ marginBottom: '10px' }}>
              <strong>{list.listName}</strong> — {list.items?.length || 0} items
              <button
                onClick={() => handleOpenList(list._id)}
                style={{ marginLeft: '10px' }}
              >
                Open
              </button>
              <button
                onClick={() => handleDeleteList(list._id)}
                style={{ marginLeft: '10px' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

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
                fontSize: '16px'
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
