import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GroceryListPage = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // or 'desc'

  useEffect(() => {
    fetch(`http://localhost:5000/api/grocery-lists/${id}/items`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch items');
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching items:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleRemove = (itemId) => {
    fetch(`http://localhost:5000/api/grocery-lists/${id}/remove-item/${itemId}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete item');
        setItems(prev => prev.filter(i => i.item._id !== itemId));
      })
      .catch(err => {
        alert('Error removing item: ' + err.message);
      });

  };


  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const res = await fetch(`http://localhost:5000/api/grocery-lists/${id}/update-quantity`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });

      if (!res.ok) throw new Error('Failed to update quantity');

      const updated = await res.json();

      // Update local state
      setItems(prev =>
        prev.map(i =>
          i.item._id === itemId ? { ...i, quantity: newQuantity } : i
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Could not update quantity.');
    }
  };

  const getSortedItems = () => {
    if (!sortField) return items;

    return [...items].sort((a, b) => {
      const valA = a.item[sortField];
      const valB = b.item[sortField];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return 0; // fallback for unsupported types
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };


  if (loading) return <p>Loading items...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Grocery List</h2>
      {items.length === 0 ? (
        <p>No items in this list.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                Price {sortField === 'price' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('originalPrice')} style={{ cursor: 'pointer' }}>
                Original Price {sortField === 'originalPrice' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Store</th>
              <th>Unit</th>
              <th>Category</th>
              <th>Promotion</th>
              <th>Deal Ends</th>
              <th>Item Image</th>
              <th>Actions</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {getSortedItems().map(({ item, quantity }, idx) => (
              <tr key={idx}>
                <td>{item.itemName}</td>
                <td>
                  {typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : '—'}
                </td>
                <td>{item.originalPrice ? `$${item.originalPrice.toFixed(2)}` : '—'}</td>
                <td>{item.store?.name || '—'}</td>
                <td>{item.unitDetails?.quantity} {item.unitDetails?.unit}</td>
                <td>{item.category || '—'}</td>
                <td>{item.promotion || '—'}</td>
                <td>{item.dealValidUntil ? new Date(item.dealValidUntil).toLocaleDateString() : '—'}</td>
                <td>
                  {item.itemImage?.url
                    ? <img
                      src={item.itemImage.url}
                      alt={item.itemImage.altText || item.itemName}
                      style={{ width: '50px' }}
                    />
                    : '—'}
                </td>
                <td>
                  <button onClick={() => handleRemove(item._id)}>
                    Remove
                  </button>
                </td>
                <td>
                  <button onClick={() => handleUpdateQuantity(item._id, quantity - 1)} disabled={quantity <= 1}>−</button>
                  <span style={{ margin: '0 8px' }}>{quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item._id, quantity + 1)}>+</button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GroceryListPage;
