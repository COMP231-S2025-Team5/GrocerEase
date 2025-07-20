import React, { useEffect, useState, useRef } from 'react';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/items?page=${page}&limit=10`);
        const data = await res.json();
        setItems(prev => [...prev, ...data]);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchItems();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Original Price</th>
            <th>Store</th>
            <th>Unit</th>
            <th>Category</th>
            <th>Promotion</th>
            <th>Deal Ends</th>
            <th>Item image</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.itemName}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>${item.originalPrice ? item.originalPrice.toFixed(2) : 'N/A'}</td>
              <td>{item.store.name}</td>
              <td>{item.unitDetails.quantity} {item.unitDetails.unit}</td>
              <td>{item.category}</td>
              <td>{item.promotion || 'N/A'}</td>
              <td>{item.dealValidUntil ? new Date(item.dealValidUntil).toLocaleDateString() : 'N/A'}</td>
              <td>
                {item.itemImage ? (
                  <img src={item.itemImage.url} alt={item.itemImage.altText} style={{ width: '50px' }} />
                ) : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={loaderRef} style={{ height: '30px' }} />
    </>
  );
};

export default ItemList;