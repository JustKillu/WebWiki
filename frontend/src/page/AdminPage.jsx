import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Notification from '../componentes/Notificaction';
import FormPeticion from '../componentes/formpeticion';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3001/allusers', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    setUsers(res.data);
  };

  const handleCardClick = (user) => {
     
    setEditingUser(user);
  };

  const handleSaveClick = async (user) => {
    const { _id, username, email, rol } = user;
    await axios.put(`http://localhost:3001/user/${_id}`, { username, email, rol }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    fetchUsers();
    setEditingUser(null);
    setNotification({ title: 'Éxito', description: 'Usuario actualizado con éxito!', color: 'bg-green-500' });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleDeleteClick = async (id) => {
    await axios.delete(`http://localhost:3001/user/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    fetchUsers();
    setNotification({ title: 'Éxito', description: 'Usuario eliminado con éxito!', color: 'bg-red-500' });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleCancelClick = (e) => {
    e.stopPropagation(); 
    setEditingUser(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-5 dark:text-white">Usuarios Registrados</h1>
      {showNotification && notification && <Notification {...notification} />}
      <div className="flex flex-col w-full px-3">
        {users.map((user) => (
          <div key={user._id} className="border rounded px-3 py-2 mb-2 flex justify-between bg-white cursor-pointer" onClick={() => handleCardClick(user)}>
            {editingUser === user ? (
              <div className="w-full">
                <input className="w-full mb-2 p-1 border rounded" type="text" defaultValue={user.username} onChange={(e) => user.username = e.target.value} />
                <input className="w-full mb-2 p-1 border rounded" type="text" defaultValue={user.email} onChange={(e) => user.email = e.target.value} />
                <select className="w-full mb-2 p-1 border rounded" defaultValue={user.rol} onChange={(e) => user.rol = e.target.value}>
                  <option value="adm">adm</option>
                  <option value="user">user</option>
                </select>
                <button className="mr-2 bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleSaveClick(user)}>Guardar</button>
                <button className="bg-gray-500 text-white px-2 py-1 rounded" onClick={(e) => handleCancelClick(e)}>Cancelar</button>
              </div>
            ) : (
              <div className="w-full flex justify-between items-center">
                <div>
                  <h2 className="font-bold">{user.username}</h2>
                  <p>{user.email}</p>
                </div>
                <div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.rol === 'adm' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.rol}
                  </span>
                  <button className="ml-2 bg-red-500 text-white px-2 py-1 rounded" onClick={(e) => {e.stopPropagation(); handleDeleteClick(user._id);}}>Borrar</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <FormPeticion/>
    </div>
  );
};

export default AdminPage;
