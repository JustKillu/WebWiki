import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../ThemeProvider';
import Notification  from '../componentes/Notificaction';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const { setIsAuthenticated, setRol } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setNotification({
        title: 'Error',
        description: 'Por favor, rellena todos los campos.',
        color: 'bg-red-500 text-white'
      });
      return;
    }

    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const { token, rol } = await response.json(); 
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('rol', rol); 
      setIsAuthenticated(true);
      setRol(rol);
      setNotification({
        title: 'Éxito',
        description: 'Has iniciado sesión correctamente.',
        color: 'bg-green-500 text-white'
      });
      setTimeout(() => navigate('/'), 2000);
    } else {
      setNotification({
        title: 'Error',
        description: 'Error en el inicio de sesión.',
        color: 'bg-red-500 text-white'
      });
    }  
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
          <button type="submit" className="block w-full p-2 bg-blue-500 text-white rounded-md">
            Iniciar sesión
          </button>
          {notification && (
            <Notification 
              title={notification.title} 
              description={notification.description} 
              color={notification.color} 
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
