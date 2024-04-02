import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import DarkMode from '../componentes/DarkMode';
import { ThemeContext } from '../ThemeProvider';
import { OpenContext } from '../OpenContext'; 

function Navbar() {
  const { isOpen, setIsOpen } = useContext(OpenContext); 
  const { isAuthenticated, rol } = useContext(ThemeContext); 
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    } else {
      setUsername(null);
    }
  }, [isAuthenticated, rol]); 

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setUsername(null);
  };

  return (
    <>
      <div className={`fixed top-0 left-0 z-30 w-64 transition-all duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {isOpen && (
          <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-0 left-0 ml-12 mt-4 mb-36 bg-white text-purple-900 px-2 py-1 rounded w-16 text-lg translate-x-0 hover:bg-purple-200 transition duration-500 ease-in-out">
            <span className="text-purple-900">🠔</span>
          </button>
        )}

        <div className="p-6 bg-gradient-to-r from-purple-900 to-purple-700 text-white w-full border-b border-gray-600">
          <h1 className="text-2xl font-bold">Weiki</h1>
        </div>
        <nav className="p-6 bg-purple-900 text-white h-screen">
          <ul className="flex flex-col space-y-4">
            <li><Link to="/" className=" py-1 hover:text-gray-300 text-lg flex items-center transition duration-500 ease-in-out">{isOpen ? <><i className="fas fa-home mr-2"></i> Inicio</> : <i className="fas fa-home"></i>}</Link></li>
            <li><Link to="/wiki" className=" py-1 hover:text-gray-300 text-lg flex items-center transition duration-500 ease-in-out">{isOpen ? <><i className="fas fa-book mr-2"></i> Wiki</> : <i className="fas fa-book"></i>}</Link></li>
            {rol === 'adm' && <li><Link to="/admin" className=" py-1 hover:text-gray-300 text-lg flex items-center transition duration-500 ease-in-out">{isOpen ? <><i className="fas fa-user-shield mr-2"></i> Admin</> : <i className="fas fa-user-shield"></i>}</Link></li>}
            <hr className="border-gray-600"/>
            <div className="flex flex-col space-y-4 mt-2">
              {username ? (
                <>
                  <li>{username}</li>
                  <li><button onClick={handleLogout} className=" py-1 hover:text-gray-300 text-lg flex items-center transition duration-500 ease-in-out">{isOpen ? <><i className="fas fa-sign-out-alt mr-2"></i> Cerrar sesión</> : <i className="fas fa-sign-out-alt"></i>}</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className=" py-1 hover:text-gray-300 text-lg flex items-center transition duration-500 ease-in-out">{isOpen ? <><i className="fas fa-sign-in-alt mr-2"></i> Iniciar sesión</> : <i className="fas fa-sign-in-alt"></i>}</Link></li>
                  <li><Link to="/register" className=" py-1 hover:text-gray-300 text-lg flex items-center transition duration-500 ease-in-out">{isOpen ? <><i className="fas fa-user-plus mr-2"></i> Registrarse</> : <i className="fas fa-user-plus"></i>}</Link></li>
                </>
              )}
            </div>
            <DarkMode/>
          </ul>
        </nav>
      </div>
      {!isOpen && (
  <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-0 mb-16 left-0 mt-4 bg-white opacity-40 text-purple-900 px-2 py-1 rounded w-16 text-lg z-20 translate-x-2/3 hover:opacity-100 transition duration-500 ease-in-out shadow-lg">
    <span className="text-purple-900">🠖</span>
  </button>
)}
      <div className={`transition-all duration-200 ${isOpen ? 'translate-x-64' : 'translate-x-0'}`}>
      </div>
    </>
  );
}

export default Navbar;
