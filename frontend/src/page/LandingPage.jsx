import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [entries, setEntries] = useState([]);
  const [githubUser, setGithubUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      const res = await axios.get('http://localhost:3001/entries');
      setEntries(res.data.slice(0, 4));
    };

    const fetchGithubUser = async () => {
      const res = await axios.get('https://api.github.com/users/JustKillu');
      setGithubUser(res.data);
    };

    fetchEntries();
    fetchGithubUser();
  }, []);

  const handleEntryClick = () => {
    navigate(`/wiki`);
  };

  return (
    <div className="min-h-screen text-white pb-20">
      <header className="hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 mt-12">
            Bienvenido a Nuestra Página Wiki
          </h1>
          <p className="text-base sm:text-xl md:text-2xl font-light mb-8">
            Aquí puedes encontrar todo lo que necesitas. Explora las últimas entradas de nuestra comunidad y descubre contenido nuevo y emocionante todos los días.
          </p>
        </div>
      </header>
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-3xl font-bold mb-4 mt-12 text-center">
          Últimas Entradas
        </h2>
        <hr className="mb-8 w-full sm:w-2/4 mx-auto border-red-500"/>
        <div className="grid grid-cols-2 gap-4 w-full sm:w-2/4 mx-auto">
          {entries.map((entry) => (
            <div key={entry._id} className="relative bg-gray-800 p-4 rounded-lg cursor-pointer" onClick={() => handleEntryClick(entry._id)}>
              {entry.image.data && (
                <img className="absolute top-0 left-0 w-full h-full object-cover opacity-50" src={`data:${entry.image.contentType};base64,${Buffer.from(entry.image.data).toString('base64')}`} alt="Imagen de la entrada"/>
              )}
              <div className="relative">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">{entry.title}</h2>
                <p className="text-gray-300">{entry.content}</p>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-xl sm:text-3xl font-bold mb-4 mt-12 text-center">
          Creador
        </h2>
        <hr className="mb-8 w-full sm:w-2/4 mx-auto border-red-500"/>
        {githubUser && (
          <div onClick={() => window.location.href = githubUser.html_url} className="flex justify-center items-center bg-gray-800 p-4 rounded-lg w-full sm:w-2/4 mx-auto cursor-pointer">
            <img className="w-8 sm:w-16 h-8 sm:h-16 rounded-full mr-4" src={githubUser.avatar_url} alt="Avatar de GitHub"/>
            <div className="text-xs sm:text-sm">
              <p className="text-white leading-none">{githubUser.name}</p>
              <p className="text-gray-400">{githubUser.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
