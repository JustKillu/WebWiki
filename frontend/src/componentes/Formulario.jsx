import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Buffer } from 'buffer';

const EntryDetail = () => {
  const [entry, setEntry] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null); 
  const { id } = useParams();

  useEffect(() => {
    const userFromStorage = localStorage.getItem('username');
    const roleFromStorage = localStorage.getItem('rol');
    setUser({ username: userFromStorage, role: roleFromStorage });

    axios.get(`http://localhost:3001/formulario/${id}`)
      .then(res => {
        setEntry(res.data);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleComment = (e) => {
    e.preventDefault();
    const userFromStorage = localStorage.getItem('username');
    const roleFromStorage = localStorage.getItem('rol');
    const currentUser = { username: userFromStorage, role: roleFromStorage };
    axios.post(`http://localhost:3001/formulario/${id}/comment`, { username: currentUser.username, content: newComment })
      .then(res => {
        setEntry(res.data);
        setNewComment('');
      })
      .catch(err => console.log(err));
  };
  

  const handleDeleteComment = (commentId) => {
    axios.delete(`http://localhost:3001/formulario/${id}/comment/${commentId}`)
      .then(res => {
        setEntry(res.data);
      })
      .catch(err => console.log(err));
  };

  if (!entry) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3">
      <div className="p-8">
        {entry.image.data && (
          <img className="w-full h-64 object-cover" src={`data:${entry.image.contentType};base64,${Buffer.from(entry.image.data).toString('base64')}`} alt="Imagen de la entrada"/>
        )}
        <div className="font-bold text-xl mb-2">{entry.title}</div>
        <p className="text-gray-700 text-base">{entry.content}</p>
      </div>
      {entry.comments && entry.comments.map((comment, index) => (
        <div key={index} className="bg-gray-50 rounded-lg shadow-md p-6 my-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg mb-2">{comment.username}</h2>
            {user && user.role === 'adm' && (
              <button onClick={() => handleDeleteComment(comment._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Eliminar comentario</button>
            )}
          </div>
          <p className="text-gray-700 text-base">{comment.content}</p>
          <p className="text-gray-500 text-sm">{new Date(comment.date).toLocaleString()}</p>
        </div>
      ))}
      {user && (
        <div className="bg-gray-50 rounded-lg shadow-md p-6 my-4">
          <form onSubmit={handleComment} className="flex flex-col">
            <textarea className="border p-2 rounded mb-2" placeholder="Añadir un comentario" value={newComment} onChange={e => setNewComment(e.target.value)} />
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EntryDetail;
