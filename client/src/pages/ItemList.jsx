const GroceryItemTable = ({ items }) => {
  return (
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
            <td>{item.category}</td>
            <td>{item.promotion || '—'}</td>
            <td>{item.dealValidUntil ? new Date(item.dealValidUntil).toLocaleDateString() : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
