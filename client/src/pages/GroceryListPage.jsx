import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GroceryListPage = () => {
  const { id } = useParams(); // Get the list ID from the URL
  const [items, setItems] = useState([]); // Store grocery items
  const [loading, setLoading] = useState(true); // Optional: loading state
  const [error, setError] = useState(null); // Optional: error state

  // Fetch items when component mounts or listId changes
  useEffect(() => {
    fetch(`/api/grocery-lists/${id}/items`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch items');
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Remove item from list
  const handleRemove = (itemId) => {
    fetch(`/api/items/${itemId}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete item');
        setItems(prev => prev.filter(item => item.id !== itemId));
      })
      .catch(err => {
        alert('Error removing item: ' + err.message);
      });
  };

  // Render loading or error
  if (loading) return <p>Loading items...</p>;
  if (error) return <p>Error: {error}</p>;

  // Render grocery list
  return (
    <div>
      <h2>Grocery List</h2>
      {items.length === 0 ? (
        <p>No items in this list.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name}
              <button onClick={() => handleRemove(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroceryListPage;
