import React, { useState } from 'react';

const RegistrationPage = () => {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.registered) {
        setMessage(`Registration successful! Welcome, ${data.name}.`);
        // Optionally clear form fields
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 60px)', // Subtract navigation height
      width: '100%',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h1>Register</h1>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name}
          onChange={e => setName(e.target.value)}
          required 
          style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          required 
          style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          required 
          style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
        />
        <button 
          type="submit" 
          style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}
        >
          Register
        </button>
      </form>
      {message && <p style={{ marginTop: '15px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default RegistrationPage;
