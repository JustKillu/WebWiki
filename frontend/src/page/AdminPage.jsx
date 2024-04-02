import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('http://localhost:3001/allusers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(res.data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-5 dark:text-white">Usuarios Registrados</h1>
      <div className="flex flex-col w-full px-3">
        {users.map((user) => (
          <div key={user._id} className="border rounded px-3 py-2 mb-2 flex justify-between bg-white">
            <div>
              <h2 className="font-bold">{user.username}</h2>
              <p>{user.email}</p>
            </div>
            <div>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.rol === 'adm' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {user.rol}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
