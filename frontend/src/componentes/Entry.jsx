import React from 'react';
import { Buffer } from 'buffer';

const Entry = ({ entry, user, handleDelete, handleEdit, onClick }) => {
  return (
    <div className="rounded overflow-hidden shadow-lg my-2 w-full bg-white cursor-pointer" onClick={onClick}>
      {entry.image.data && (
        <img className="w-full h-64 object-cover" src={`data:${entry.image.contentType};base64,${Buffer.from(entry.image.data).toString('base64')}`} alt="Imagen de la entrada"/>
      )}
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{entry.title}</div>
        <p className="text-gray-700 text-base">{entry.content}</p>
      </div>
      {user && user.role === 'adm' && (
        <div className="px-6 py-4 flex justify-end">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={(e) => {e.stopPropagation(); handleDelete(entry._id);}}>Eliminar</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={(e) => {e.stopPropagation(); handleEdit(entry._id);}}>Editar</button>
        </div>
      )}
    </div>
  );
};

export default Entry;
