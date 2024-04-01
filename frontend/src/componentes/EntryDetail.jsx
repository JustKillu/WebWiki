import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { useParams } from 'react-router-dom';

const EntryDetail = () => {
    const [entry, setEntry] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState(null); 
    const { id } = useParams();
  
    useEffect(() => {
      
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      const roleFromStorage = localStorage.getItem('rol');
      setUser({ ...userFromStorage, role: roleFromStorage });
  
      axios.get(`http://localhost:3001/entry/${id}`)
        .then(res => {
          setEntry(res.data);
        })
        .catch(err => console.error(err));
    }, [id]);
    
  const handleComment = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:3001/entry/${id}/comment`, { username: user.username, content: newComment })
      .then(res => {
        setEntry(res.data);
        setNewComment('');
      })
      .catch(err => console.log(err));
  };

  if (!entry) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container mx-auto px-4 bg-gray-100">
      <div className="rounded overflow-hidden shadow-lg my-2 bg-white">
        {entry.image.data && (
          <img className="w-1/2" src={`data:${entry.image.contentType};base64,${Buffer.from(entry.image.data).toString('base64')}`} alt="Imagen de la entrada"/>
        )}
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{entry.title}</div>
          <p className="text-gray-700 text-base">{entry.content}</p>
        </div>
        {entry.comments && entry.comments.map((comment, index) => (
          <div key={index} className="px-6 py-4">
            <p className="text-gray-700 text-base">{comment.content}</p>
          </div>
        ))}
        {user && (
          <div className="px-6 py-4">
            <form onSubmit={handleComment}>
              <input type="text" placeholder="Añadir un comentario" value={newComment} onChange={e => setNewComment(e.target.value)} />
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enviar</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryDetail;