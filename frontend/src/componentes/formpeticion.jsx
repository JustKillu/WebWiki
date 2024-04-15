import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../componentes/Loading';
import { Buffer } from 'buffer';
import Notification from '../componentes/Notificaction';
import EditForm from '../componentes/EditForm.jsx';

const FormularioComponent = () => {
    const [formularios, setFormularios] = useState([]);
    const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [editForm, setEditForm] = useState(null);
   
    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://localhost:3001/admin`)
            .then(res => {
                if (Array.isArray(res.data)) {
                    const formulariosConImagenes = res.data.map(formulario => {
                        if (formulario.image) {
                            const imageBuffer = Buffer.from(formulario.image.data, 'binary');
                            const base64Image = imageBuffer.toString('base64');
                            formulario.image.data = base64Image;
                        }
                        return formulario;
                    });
                    setFormularios(formulariosConImagenes);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    const handleEdit = (formulario, event) => {
        event.stopPropagation();  
        setEditForm(formulario);
        setNotification({ title: 'Información', description: 'Formulario seleccionado para editar.', color: 'bg-yellow-500' });
        setTimeout(() => setNotification(false), 2000);
    };

    const handleDelete = (id, event) => {
        event.stopPropagation(); 
        axios.delete(`http://localhost:3001/formulario/${id}`)
            .then(res => {
                setFormularios(formularios.filter(formulario => formulario._id !== id));
                setNotification({ title: 'Éxito', description: 'Formulario eliminado con éxito.', color: 'bg-green-500' });
                setTimeout(() => setNotification(false), 2000);
            })
            .catch(err => {
                console.error(err);
                setNotification({ title: 'Error', description: 'Hubo un error al eliminar el formulario.', color: 'bg-red-500' });
                setTimeout(() => setNotification(false), 2000);
            });
    };

    if (isLoading) return <div className='relative m-auto'><Loading /></div>;
     
    return (
        <div className='relative m-auto'>
            {notification && <Notification {...notification} />}
            <div className={`mx-6 mt-6 bg-slate-200 rounded-2xl pb-7 mb-4 dark:bg-slate-800 text-black`}>
                <h1 className='mt-0 pt-4 ml-6 text-3xl font-bold'><span className='dark:text-white border-b-4 border-red-500'>Peticiones de usuarios</span></h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4 ">
                    {formularios.length > 0 ? (
                        formularios.map((formulario, index) => (
                            <div key={index} onClick={() => setFormularioSeleccionado(formulario)} className="p-4 rounded dark:bg-slate-700 bg-white shadow cursor-pointer">
                                <h2 className="dark:text-indigo-500 font-bold mb-2">Titulo: {formulario.title}</h2>
                                <p className="mb-2 text-gray-500 overflow-hidden">Descripción: {formulario.content.substring(0, 100)}{formulario.content.length > 100 ? '...' : ''}</p>
                                <p className="mb-2 text-gray-500">Estado: {formulario.status}</p>
                                {formulario.image && <img src={`data:${formulario.image.contentType};base64,${formulario.image.data}`} alt={formulario.title} className="mb-2 w-full h-64 object-cover rounded" />}
                                <div className="flex space-x-4">
                                    <button onClick={(event) => {event.stopPropagation(); handleEdit(formulario, event);}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Editar</button>
                                    <button onClick={(event) => {event.stopPropagation(); handleDelete(formulario._id, event);}} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Eliminar</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay formularios disponibles.</p>
                    )}
                </div>

                {formularioSeleccionado && (
                    <div className='bg-black bg-opacity-80 dark:bg-gray-800 fixed inset-0 p-4  dark:bg-opacity-80 flex items-center justify-center' onClick={() => setFormularioSeleccionado(null)}>
                        <div className="p-4 bg-white  dark:bg-gray-700 rounded-2xl shadow-lg flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4" onClick={e => e.stopPropagation()}>
                            {formularioSeleccionado.image && <img src={`data:${formularioSeleccionado.image.contentType};base64,${formularioSeleccionado.image.data}`} alt={formularioSeleccionado.title} className="w-full md:w-1/2 h-64 object-cover rounded" />}
                            <div className="w-full md:w-1/2 space-y-2">
                                <h2 className="text-2xl font-bold">{formularioSeleccionado.title}</h2>
                                <p>{formularioSeleccionado.content}</p>
                            </div>
                        </div>
                    </div>
                    
                )}
                {editForm && <EditForm formulario={editForm} setEditForm={setEditForm}   />}
            </div>
        </div>
    );
};

export default FormularioComponent;
