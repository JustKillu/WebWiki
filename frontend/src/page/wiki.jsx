import React, { useState, useEffect, useContext  } from 'react';
import axios from 'axios';
import Entry from '../componentes/Entry.jsx';
import EntryForm from '../componentes/EntryForm.jsx';
import WikipediaSearch from '../componentes/WikipediaSearch.jsx';
import { useNavigate } from 'react-router-dom';
import Loading from '../componentes/Loading';
import { ThemeContext } from '../ThemeProvider';
import { Buffer } from 'buffer';

const WikiPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [user, setUser] = useState(null);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', image: '', comments: [] });
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const { rol } = useContext(ThemeContext); 

  useEffect(() => {
    setIsLoading(true);
    const fetchEntries = axios.get(`http://localhost:3001/entries`);
    const fetchFormularios = axios.get(`http://localhost:3001/formulario`);
  
    axios.all([fetchEntries, fetchFormularios])
      .then(axios.spread((...responses) => {
        const entriesResponse = responses[0];
        const formulariosResponse = responses[1];
        if (Array.isArray(entriesResponse.data)) {
          setEntries(entriesResponse.data);
        }
  
        if (Array.isArray(formulariosResponse.data)) {
          const formulariosConImagenes = formulariosResponse.data.map(formulario => {
            if (formulario.image) {
              const imageBuffer = Buffer.from(formulario.image.data, 'binary');
              const base64Image = imageBuffer.toString('base64');
              formulario.image.data = base64Image;
            }
            return formulario;
          });
          setFormularios(formulariosConImagenes);
        }
      }))
      .catch(errors => {
        
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/entry/${id}`)
      .then(res => {
        setEntries(entries.filter(entry => entry._id !== id));
      });
  };
  const handleDelete1 = (id) => {
    axios.delete(`http://localhost:3001/formulario/${id}`)
      .then(res => {
        setFormularios(formularios.filter(formulario => formulario._id !== id));
      });
  };

  const handleEdit = (id) => {
    const entryToEdit = entries.find(entry => entry._id === id);
    if (entryToEdit) {
      setNewEntry(entryToEdit);
      setEditMode(true);
      setShowForm(true);
    }
  };
  const handleEdit1 = (id) => {
    const formualrioToEdit = formularios.find(formulario => formulario._id === id);
    if (formualrioToEdit) {
      setNewEntry(formualrioToEdit);
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
  
    const isFormulario = newEntry.hasOwnProperty('_id') && formularios.find(formulario => formulario._id === newEntry._id);
    const url = isFormulario ? `http://localhost:3001/formulario/${newEntry._id}` : `http://localhost:3001/entry`;
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
          if (isFormulario) {
            setFormularios(formularios.map(formulario => formulario._id === newEntry._id ? res.data : formulario));
          } else {
            setEntries(entries.map(entry => entry._id === newEntry._id ? res.data : entry));
          }
          setEditMode(false);
        } else {
          if (isFormulario) {
            setFormularios([...formularios, res.data.formulario]);
          } else {
            setEntries([...entries, res.data.entry]);
          }
        }
        setNewEntry({ title: '', content: '', image: '', comments: [] });
        setShowForm(false);
      });
  };
  

  const handleEntryClick = (id) => {
    navigate(`/entry/${id}`);
  };

  const formularioClick = (id) => {
    navigate(`/formulario/${id}`);
  };

  return (
    <div className='relative'>
      <div className={`absolute inset-0 flex items-center justify-center mt-96 ${isLoading ? '' : 'hidden'}`}>
        <Loading />
      </div>
      <div className={`mx-6 mt-6 bg-slate-200 rounded-2xl dark:bg-slate-800 dark:text-white ${isLoading ? 'opacity-0' : ''}`}>
        <h1 className='mt-0 pt-4 ml-6 text-3xl font-bold'><span className='border-b-4 border-red-500'>Artículos de la Comunidad</span></h1>
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4">
              {entries.length > 0 ? (
                entries.map((entry, index) => (
                  <Entry key={index} entry={entry} rol={rol} handleDelete={handleDelete} handleEdit={handleEdit} onClick={() => handleEntryClick(entry._id)} />
                ))
              ) : (
                <p></p>
              )}
              {formularios.length > 0 ? (
  formularios.filter(formulario => formulario.status === 'aprobado').map((formulario, index) => {
    return (
      <div key={index} className="max-w-xs mx-auto bg-white dark:bg-slate-700 rounded shadow-md overflow-hidden md:max-w-2xl my-2 cursor-pointer transform transition duration-500 ease-in-out hover:scale-105" onClick={() => formularioClick(formulario._id)}>
       {formulario.image && <img src={`data:${formulario.image.contentType};base64,${formulario.image.data}`} alt={formulario.title} className="w-96 h-32 object-cover" />}
        <div className="px-2 py-2">
          <div className="font-bold text-lg mb-2 text-indigo-500">{formulario.title}</div>
          <p className="text-gray-500 text-sm">{formulario.content.substring(0, 100)}{formulario.content.length > 100 ? '...' : ''}</p>
          {rol === 'adm' && (
        <div className="px-2 py-2 flex justify-end">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm" onClick={(e) => {e.stopPropagation(); handleDelete1(formulario._id);}}>Eliminar</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-2 text-sm" onClick={(e) => {e.stopPropagation(); handleEdit1(formulario._id);}}>Editar</button>
        </div>
      )}
        </div>
      </div>
    )
  })
) : (
  <p></p>
)}        
            </div>
  
            {rol === 'adm' && (
              <EntryForm newEntry={newEntry} setNewEntry={setNewEntry} handleCreate={handleCreate} showForm={showForm} setShowForm={setShowForm} />
            )}
           
            <WikipediaSearch />
          </>
        )}
      </div>
    </div>
  );
};

export default WikiPage;
