import React from 'react';
import { Buffer } from 'buffer';

const Entry = ({ entry, rol, handleDelete, handleEdit, onClick }) => {
  return (
    <div className="max-w-xs mx-auto bg-white dark:bg-slate-700 rounded shadow-md overflow-hidden md:max-w-2xl my-2 cursor-pointer transform transition duration-500 ease-in-out hover:scale-105" onClick={onClick}>
      {entry.image.data && (
        <img className=" w-96 h-32 object-cover" src={`data:${entry.image.contentType};base64,${Buffer.from(entry.image.data).toString('base64')}`} alt="Imagen de la entrada"/>
      )}
      <div className="px-2 py-2">
        <div className="font-bold text-lg mb-2 text-indigo-500">{entry.title}</div>
        <p className="text-gray-500 text-sm">{entry.content.substring(0, 100)}{entry.content.length > 100 ? '...' : ''}</p>
      </div>
      {rol === 'adm' && (
        <div className="px-2 py-2 flex justify-end">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm" onClick={(e) => {e.stopPropagation(); handleDelete(entry._id);}}>Eliminar</button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-2 text-sm" onClick={(e) => {e.stopPropagation(); handleEdit(entry._id);}}>Editar</button>
        </div>
      )}
    </div>
  );
};

export default Entry;
