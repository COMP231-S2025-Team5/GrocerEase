import React, { useEffect, useState, useRef } from 'react';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);
  const fetchedPages = useRef(new Set());

  useEffect(() => {
    const fetchItems = async () => {
      if (fetchedPages.current.has(page)) return;
      fetchedPages.current.add(page);

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
            <th>Item Image</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.itemName}</td>
              <td>${item.price.toFixed(2)}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={loaderRef} style={{ height: '30px', marginBottom: '20px' }} />
    </>
  );
};

export default ItemList;
