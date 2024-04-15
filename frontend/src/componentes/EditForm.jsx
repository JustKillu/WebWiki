import React, { useState } from 'react';
import axios from 'axios';

const EditForm = ({ formulario, setEditForm, imageData }) => {
    const [title, setTitle] = useState(formulario.title);
    const [content, setContent] = useState(formulario.content);
    const [status, setStatus] = useState(formulario.status);

    const handleSave = () => {
        const data = {
            title,
            content,
            status,
            imageData
        };

        axios.put(`http://localhost:3001/formulario/${formulario._id}`, data)
            .then(res => {
                console.log(`Status: ${res.status}`);
                setEditForm(null);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleCancel = () => {
        setEditForm(null);
    };

    return (
        <div className='bg-black bg-opacity-80 dark:bg-gray-800 fixed inset-0 p-4  dark:bg-opacity-80 flex items-center justify-center' onClick={handleCancel}>
            <div className="p-4 bg-white  dark:bg-gray-700 rounded-2xl shadow-lg flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4" onClick={e => e.stopPropagation()}>
                <div className="w-full md:w-1/2 space-y-2">
                    <h2 className="text-2xl font-bold pr-56">Editar Formulario</h2>
                    <label>
                        Título:
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                    </label>
                    <label className='flex justify-end '>
                        Contenido:
                        <textarea value={content} onChange={e => setContent(e.target.value)} />
                    </label>
                    <label>
                        Estado:
                        <select value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="en espera">En espera</option>
                            <option value="aprobado">Aprobado</option>
                            <option value="denegado">Denegado</option>
                        </select>
                    </label>
                    <div className="flex space-x-4 mt-4">
                        <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Guardar</button>
                        <button onClick={handleCancel} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditForm;
