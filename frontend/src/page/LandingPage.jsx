import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="hero">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Bienvenido a Nuestra Página
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8">
            Aquí puedes encontrar todo lo que necesitas.
          </p>
          <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
            Comienza Ahora
          </button>
        </div>
      </header>
     
    </div>
  );
};

export default LandingPage;
