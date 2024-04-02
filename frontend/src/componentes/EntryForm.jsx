import React from 'react';

const EntryForm = ({ newEntry, setNewEntry, handleCreate, showForm, setShowForm }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-4 bg-white rounded shadow-lg">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Ocultar formulario' : 'Crear nueva entrada'}
        </button>
        {showForm && (
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="text" placeholder="Título" value={newEntry.title} onChange={e => setNewEntry({ ...newEntry, title: e.target.value })} className="w-full p-2 border border-gray-300 rounded" />
            <textarea type="text" placeholder="Contenido" value={newEntry.content} onChange={e => setNewEntry({ ...newEntry, content: e.target.value })} className="w-full p-2 border border-gray-300 rounded" />
            <input type="file" onChange={e => setNewEntry({ ...newEntry, image: e.target.files[0] })} className="w-full p-2 border border-gray-300 rounded" />
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Enviar</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EntryForm;
