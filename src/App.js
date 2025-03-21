import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', photo: null });
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

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    if (formData.photo) {
      form.append('photo', formData.photo);
    }
    if (editingId && formData.existingPhoto) {
      form.append('existingPhoto', formData.existingPhoto);
    }

    fetch(url, {
      method,
      body: form
    })
      .then((response) => response.json())
      .then(() => {
        fetchUsers();
        setFormData({ name: '', email: '', photo: null });
        setEditingId(null);
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleEdit = (user) => {
    setFormData({ 
      name: user.name, 
      email: user.email, 
      existingPhoto: user.photo 
    });
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
        />
        <button type="submit">
          {editingId ? 'Update' : 'Tambah'} Pengguna
        </button>
      </form>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.photo && (
              <img 
                src={`http://localhost:3000${user.photo}`} 
                alt={user.name}
                className="profile-photo"
              />
            )}
            <div>
              {user.name} - {user.email}
              <button onClick={() => handleEdit(user)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;