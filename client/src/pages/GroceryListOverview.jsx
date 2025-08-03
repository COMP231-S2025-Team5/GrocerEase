import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GroceryListOverview = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchLists();
  }, []);

  const handleOpenList = (listId) => {
    navigate(`/groceryListPage/${listId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Grocery Lists</h2>

      {loading ? (
        <p>Loading lists...</p>
      ) : lists.length === 0 ? (
        <p>No lists yet. Create one to get started.</p>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroceryListOverview;
