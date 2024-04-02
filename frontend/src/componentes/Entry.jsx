import React from 'react';
import { Buffer } from 'buffer';

const Entry = ({ entry, user, handleDelete, handleEdit, onClick }) => {
  return (
    <div className="max-w-xs mx-2 bg-white rounded shadow-md overflow-hidden md:max-w-2xl my-2 cursor-pointer transform transition duration-500 ease-in-out hover:scale-105" onClick={onClick}>
      {entry.image.data && (
        <img className="w-full h-32 object-cover" src={`data:${entry.image.contentType};base64,${Buffer.from(entry.image.data).toString('base64')}`} alt="Imagen de la entrada"/>
      )}
      <div className="px-2 py-2">
        <div className="font-bold text-lg mb-2">{entry.title}</div>
        <p className="text-gray-700 text-sm">{entry.content}</p>
      </div>
      {user && user.role === 'adm' && (
        <div className="px-2 py-2 flex justify-end">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm" onClick={(e) => {e.stopPropagation(); handleDelete(entry._id);}}>Eliminar</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-2 text-sm" onClick={(e) => {e.stopPropagation(); handleEdit(entry._id);}}>Editar</button>
        </div>
      )}
    </div>
  );
};

export default Entry;
