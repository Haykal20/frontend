import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching data:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId 
      ? `/api/users/${editingId}`
      : '/api/users';
    
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then(() => {
        fetchUsers();
        setFormData({ name: '', email: '' });
        setEditingId(null);
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditingId(user.id);
  };

  return (
    <div className="App">
      <h1>Daftar Pengguna</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <button type="submit">
          {editingId ? 'Update' : 'Tambah'} Pengguna
        </button>
      </form>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleEdit(user)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;