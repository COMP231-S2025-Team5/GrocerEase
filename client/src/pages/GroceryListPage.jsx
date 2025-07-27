import React, { useEffect, useState } from 'react';

const GroceryListPage = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLists = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/grocery-lists');
      const data = await res.json();
      setLists(data);
    } catch (err) {
      console.error('Failed to fetch lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const createNewList = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/grocery-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setLists(prev => [...prev, data]);
    } catch (err) {
      console.error('Error creating list:', err);
      alert('Failed to create list');
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Grocery Lists</h2>
      <button onClick={createNewList} style={{ marginBottom: '20px' }}>
        + Create New List
      </button>

      {loading ? (
        <p>Loading lists...</p>
      ) : lists.length === 0 ? (
        <p>No lists found. Create your first one!</p>
      ) : (
        <ul>
          {lists.map(list => (
            <li key={list._id}>
              <strong>{list.listName}</strong> — {list.items.length} items
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroceryListPage;
