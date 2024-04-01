import React from 'react';

const EntryForm = ({ newEntry, setNewEntry, handleCreate, showForm, setShowForm }) => {
  return (
    <div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Ocultar formulario' : 'Crear nueva entrada'}
      </button>
      {showForm && (
        <form onSubmit={handleCreate}>
          <input type="text" placeholder="Título" value={newEntry.title} onChange={e => setNewEntry({ ...newEntry, title: e.target.value })} />
          <input type="text" placeholder="Contenido" value={newEntry.content} onChange={e => setNewEntry({ ...newEntry, content: e.target.value })} />
          <input type="file" onChange={e => setNewEntry({ ...newEntry, image: e.target.files[0] })} />
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enviar</button>
        </form>
      )}
    </div>
  );
};

export default EntryForm;
