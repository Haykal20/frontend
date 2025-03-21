import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', photo: null });
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching data:', error));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, photo: file});
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = editingId ? `/api/users/${editingId}` : '/api/users';
      const method = editingId ? 'PUT' : 'POST';

      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
      if (formData.photo) {
        form.append('photo', formData.photo);
      }

      const response = await fetch(url, {
        method,
        body: form
      });

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      await fetchUsers();
      setFormData({ name: '', email: '', photo: null });
      setEditingId(null);
      setPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Nama"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <div className="file-input-container">
            <label htmlFor="photo" className="file-input-label">
              Choose Photo
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
          {preview && (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="photo-preview" />
            </div>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : editingId ? 'Update' : 'Tambah'} Pengguna
        </button>
      </form>

      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-photo">
              {user.photo ? (
                <img 
                  src={`http://localhost:3000${user.photo}`} 
                  alt={user.name}
                  className="profile-photo"
                />
              ) : (
                <div className="photo-placeholder">No Photo</div>
              )}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <button onClick={() => handleEdit(user)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;