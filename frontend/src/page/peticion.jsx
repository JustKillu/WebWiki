import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Loading from '../componentes/Loading';
import { Buffer } from 'buffer';
import Notification from '../componentes/Notificaction';
import useOnclickOutside from 'react-cool-onclickoutside';

function Peticion() {
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [formularios, setFormularios] = useState([]);
    const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);
    const username = localStorage.getItem('username');
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('rol') === 'user' || 'adm');
    const [notification, setNotification] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchFormularios = () => {
        setIsLoading(true);
        axios.get(`http://localhost:3001/formulario`)
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
                    const formulariosDelUsuario = formulariosConImagenes.filter(formulario => formulario.username === username);
                    setFormularios(formulariosDelUsuario);
                }
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchFormularios();
    }, []);

    const ref = useOnclickOutside(() => {
        if (showForm) setShowForm(false);
        if (formularioSeleccionado) setFormularioSeleccionado(null);
    });

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image, image.name);
        }
        formData.append('username', username);
        axios.post('http://localhost:3001/formulario', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => { 
                setFormularios(prevFormularios => [...prevFormularios, res.data]);
                setTitle('');
                setContent('');
                setImage(null);
                setShowForm(false); 
                setNotification({ title: 'Éxito', description: 'Peticion Enviado correctamente ', color: 'bg-green-500' });
                fetchFormularios(); 
            })
            .catch(err => {
                console.error(err);
                setNotification({ title: 'Error', description: 'Un error al enviar el Peticion', color: 'bg-red-500' });
            });
    };
    return (
        <div className='relative m-auto' ref={ref}>
            {notification && <Notification {...notification} />}
            <div className={`absolute inset-0 flex items-center justify-center mt-96 ${isLoading ? '' : 'hidden'}`}>
                <Loading />
            </div>
            <div className={`mx-6 mt-6 bg-slate-200 rounded-2xl pb-7 mb-4 dark:bg-slate-800 text-black ${isLoading ? 'opacity-0' : ''}`}>
                <h1 className='mt-0 pt-4 ml-6 text-3xl font-bold'><span className='dark:text-white border-b-4 border-red-500'>Mis peticiones</span></h1>
                {!isLoading && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4 ">
                            {formularios.length > 0 ? (
                                formularios.map((formulario, index) => (
                                    <div key={index} onClick={() => setFormularioSeleccionado(formulario)} className="p-4 rounded dark:bg-slate-700 bg-white shadow cursor-pointer transform transition duration-500 ease-in-out hover:scale-105">
                                        <h2 className="dark:text-indigo-500 font-bold mb-2">Titulo: {formulario.title}</h2>
                                        <p className="mb-2 text-gray-500 overflow-hidden">Descripción: {formulario.content.substring(0, 100)}{formulario.content.length > 100 ? '...' : ''}</p>
                                        <p className="mb-2 text-gray-500">Estado: {formulario.status}</p>
                                        {formulario.image && <img src={`data:${formulario.image.contentType};base64,${formulario.image.data}`} alt={formulario.title} className="mb-2 w-full h-64 object-cover rounded" />}
                                    </div>
                                ))
                            ) : (
                                <p>No hay formularios disponibles.</p>
                            )}
                            <div className="flex justify-center items-center">
                            <button onClick={() => setShowForm(!showForm)} className="bg-blue-500 hover:bg-blue-700 mb-4 text-white font-bold py-2 px-4 rounded-full w-12 h-12 flex items-center justify-center">
                                {showForm ? '-' : '+'}
                            </button>
                        </div>
                        </div>

                        {showForm && isAdmin && (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white dark:bg-slate-700 max-w-lg mx-auto">
        <label className="block mb-2 font-bold dark:text-white">Título</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mb-4 w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:text-white" />
        <label className="block mb-2 font-bold dark:text-white">Contenido</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required className="mb-4 w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:text-white" rows="5" />
        <label className="block mb-2 font-bold dark:text-white">Imagen</label>
        <input type="file" onChange={e => setImage(e.target.files[0])} required className="mb-4 dark:bg-gray-800 dark:text-white" />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enviar</button>
    </form>
)}


{formularioSeleccionado && (
    <div className='bg-black bg-opacity-80 dark:bg-gray-800 fixed inset-0 p-4  dark:bg-opacity-80 flex items-center justify-center' onClick={() => setFormularioSeleccionado(null)}>
        <div className="p-4 bg-white  dark:bg-gray-700 rounded-2xl shadow-lg flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4" onClick={e => e.stopPropagation()}>
            {formularioSeleccionado.image && <img src={`data:${formularioSeleccionado.image.contentType};base64,${formularioSeleccionado.image.data}`} alt={formularioSeleccionado.title} className="w-full md:w-1/2 h-64 object-cover rounded" style={{ objectFit: 'contain' }} />}
            <div className="text-center md:text-left space-y-2">
                <h2 className="font-bold mb-2 dark:text-indigo-500">Titulo: {formularioSeleccionado.title}</h2>
                <p className="mb-2 text-gray-500 overflow-auto">Descripción: {formularioSeleccionado.content}</p>
                <p className="mb-2 text-gray-500">Estado: <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${formularioSeleccionado.status === 'Aprobado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{formularioSeleccionado.status}</span></p>
            </div>
        </div>
    </div>
)}
    
                    </>
                )}
            </div>
        </div>
    );
}

export default Peticion;
