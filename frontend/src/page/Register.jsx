import { useState } from 'react';
import Notification  from '../componentes/Notificaction';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password || !email) {
      setNotification({
        title: 'Error',
        description: 'Por favor, rellena todos los campos.',
        color: 'bg-red-500 text-white'
      });
      return;
    }
  
    const response = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
  
    const data = await response.json();
  
    if (response.ok) {
      setNotification({
        title: 'Éxito',
        description: 'Registro exitoso!',
        color: 'bg-green-500 text-white'
      });
    } else {
      setNotification({
        title: 'Error',
        description: data.error,
        color: 'bg-red-500 text-white'
      });
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
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
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
          <button type="submit" className="block w-full p-2 bg-blue-500 text-white rounded-md">
            Registrarse
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

export default RegisterForm;
