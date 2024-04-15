import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from './Loading';

const WikipediaCard = ({ title, snippet, pageid, onClick }) => {
  const url = `https://es.wikipedia.org/?curid=${pageid}`;

  return (
    <div className="flex-grow-0 flex-shrink-0 bg-white dark:bg-slate-700 rounded-xl shadow-md overflow-hidden m-3 cursor-pointer transform transition duration-500 ease-in-out hover:scale-105 h-auto min-h-64 w-full sm:w-64" onClick={onClick}>
      <div className="p-8 h-full flex flex-col justify-between">
        <div>
          <a href={url} target="_blank" rel="noreferrer" className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{title}</a>
          <p className="mt-2 text-gray-500">{snippet ? snippet.replace(/<[^>]*>?/gm, '') : 'No hay descripción disponible'}</p>
        </div>
        <a href={url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Ver en Wikipedia</a>
      </div>
    </div>
  );
};

const WikipediaSearch = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [search]);

  useEffect(() => {
    handleSearch();
  }, [debouncedSearch]);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    let res;
    if (debouncedSearch) {
      res = await axios.get(`https://es.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${debouncedSearch}&format=json`);
    } else {
      res = await axios.get(`https://es.wikipedia.org/w/api.php?origin=*&action=query&list=random&rnnamespace=0&rnlimit=10&format=json`);
    }
    setResults(res.data.query.search || res.data.query.random);
    setIsLoading(false);
  };

  const handleCardClick = result => {
    setSelectedResult(result);
  };

  return (
    <div className="flex flex-col items-center overflow-auto p-4">
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar en Wikipedia..." className="w-full max-w-2xl p-2 mb-4 text-gray-600"  />
      {isLoading ? <Loading /> : (selectedResult ? (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-700 rounded-xl shadow-md overflow-hidden m-3 p-8 h-auto">
          <h2 className="uppercase tracking-wide text-lg text-indigo-500 font-semibold">{selectedResult.title}</h2>
          <p className="mt-2 text-gray-500 text-base">{selectedResult.snippet ? selectedResult.snippet.replace(/<[^>]*>?/gm, '') : 'No hay descripción disponible'}</p>
          <a href={`https://es.wikipedia.org/?curid=${selectedResult.pageid}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Ver en Wikipedia</a>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 flex justify-end" onClick={() => setSelectedResult(null)}>Volver a los resultados</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mr-6">
          {results.length > 0 ? (
            results.map(result => <WikipediaCard key={result.pageid} title={result.title} snippet={result.snippet} pageid={result.pageid} onClick={() => handleCardClick(result)} />)
          ) : (
            <p>No se encontró nada</p>
          )}
        </div>  
      ))}
    </div>
  );
};

export default WikipediaSearch;
