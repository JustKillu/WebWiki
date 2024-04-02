import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Entry from '../componentes/Entry.jsx';
import EntryForm from '../componentes/EntryForm.jsx';
import WikipediaSearch   from '../componentes/WikipediaSearch.jsx';
import { useNavigate } from 'react-router-dom';

const WikiPage = () => {
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', image: '', comments: [] });
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem('user'));
    const roleFromStorage = localStorage.getItem('rol');
    setUser({ ...userFromStorage, role: roleFromStorage });

    axios.get(`http://localhost:3001/entries`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setEntries(res.data);
        } else {
          console.error('Data is not an array:', res.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/entry/${id}`)
      .then(res => {
        setEntries(entries.filter(entry => entry._id !== id));
      })
      .catch(err => console.log(err));
  };

  const handleEdit = (id) => {
    const entryToEdit = entries.find(entry => entry._id === id);
    if (entryToEdit) {
      setNewEntry(entryToEdit);
      setEditMode(true);
      setShowForm(true);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newEntry.title);
    formData.append('content', newEntry.content);
    formData.append('image', newEntry.image);

    const url = editMode ? `http://localhost:3001/entry/${newEntry._id}` : `http://localhost:3001/entry`;
    const method = editMode ? 'put' : 'post';

    axios({
      method,
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        if (editMode) {
          setEntries(entries.map(entry => entry._id === newEntry._id ? res.data : entry));
          setEditMode(false);
        } else {
          setEntries([...entries, res.data.entry]);
        }
        setNewEntry({ title: '', content: '', image: '', comments: [] });
        setShowForm(false);
      })
      .catch(err => console.log(err));
  };

  const handleEntryClick = (id) => {
    navigate(`/entry/${id}`);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 gap-4">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <Entry key={index} entry={entry} user={user} handleDelete={handleDelete} handleEdit={handleEdit} onClick={() => handleEntryClick(entry._id)} />
          ))
        ) : (
          <p>No hay entradas disponibles.</p>
        )}
      </div>

      {user && user.role === 'adm' && (
        <EntryForm newEntry={newEntry} setNewEntry={setNewEntry} handleCreate={handleCreate} showForm={showForm} setShowForm={setShowForm} />
      )}
      <WikipediaSearch />
    </div>
  );
};

export default WikiPage;