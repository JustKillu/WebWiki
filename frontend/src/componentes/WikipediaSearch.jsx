import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WikipediaCard = ({ title, snippet, pageid, onClick }) => {
  const url = `https://es.wikipedia.org/?curid=${pageid}`;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3 cursor-pointer transform transition duration-500 ease-in-out hover:scale-105" onClick={onClick}>
      <div className="p-8">
        <a href={url} target="_blank" rel="noreferrer" className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{title}</a>
        <p className="mt-2 text-gray-500">{snippet ? snippet.replace(/<[^>]*>?/gm, '') : 'No hay descripción disponible'}</p>
        <a href={url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Ver en Wikipedia</a>
      </div>
    </div>
  );
};

const WikipediaSearch = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = () => {
    if (search) {
      axios.get(`https://es.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${search}&format=json`)
        .then(res => {
          setResults(res.data.query.search);
        });
    } else {
      axios.get(`https://es.wikipedia.org/w/api.php?origin=*&action=query&list=random&rnnamespace=0&rnlimit=10&format=json`)
        .then(res => {
          setResults(res.data.query.random);
        });
    }
  };

  const handleCardClick = result => {
    setSelectedResult(result);
  };

  return (
    <div>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar en Wikipedia..." />
      <button className="bg-blue-500 hover:bg-blue-700 ml-6 text-white font-bold py-2 px-4 rounded mt-2" onClick={handleSearch}>Buscar</button>
      {selectedResult ? (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3 p-8">
          <h2 className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{selectedResult.title}</h2>
          <p className="mt-2 text-gray-500">{selectedResult.snippet ? selectedResult.snippet.replace(/<[^>]*>?/gm, '') : 'No hay descripción disponible'}</p>
          <a href={`https://es.wikipedia.org/?curid=${selectedResult.pageid}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Ver en Wikipedia</a>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={() => setSelectedResult(null)}>Volver a los resultados</button>
        </div>
      ) : (
        results.length > 0 ? (
          results.map(result => <WikipediaCard key={result.pageid} title={result.title} snippet={result.snippet} pageid={result.pageid} onClick={() => handleCardClick(result)} />)
        ) : (
          <p>No se encontró nada</p>
        )
      )}
    </div>
  );
};

export default WikipediaSearch;
