import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../componentes/Loading'; 

function Trivia() {
  const [preguntas, setPreguntas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [seleccionada, setSeleccionada] = useState('');
  const [exp, setExp] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [estadoRespuesta, setEstadoRespuesta] = useState(null);
  const [questionsToday, setQuestionsToday] = useState(0);
  const [respondido, setRespondido] = useState(false);
  const username = localStorage.getItem('username');

  useEffect(() => {
    cargarPreguntas();
    cargarQuestionToday();
  }, []);

  const cargarPreguntas = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`http://localhost:3001/user/${username}/questions`);
      if (res.data && res.data.questions && res.data.questions.length > 0) {
        setPreguntas(res.data.questions.map(pregunta => ({
          pregunta: decodeURIComponent(pregunta.question),
          respuestas: [...pregunta.incorrect_answers, pregunta.correct_answer].sort(() => Math.random() - 0.5).map(decodeURIComponent),
          correcta: decodeURIComponent(pregunta.correct_answer)
        })));
      } else {
        throw new Error('No se pudieron obtener las preguntas de la API de trivia');
      }
    } catch (err) {
      console.error(err);
    }
    setCargando(false);
  };
  
  const cargarQuestionToday = () => {
    axios.get(`http://localhost:3001/user/${username}/questionsToday`)
      .then(res => {
        setQuestionsToday(res.data.questionsToday);
        if (res.data.questionsToday < 5) {
          cargarPreguntas();
        }
      })
      .catch(err => console.error(err));
  }
  

  const manejarClick = (respuesta) => {
    if (!respondido && questionsToday < 5) {
      setSeleccionada(respuesta);
      setRespondido(true);
      if (respuesta === preguntas[indiceActual].correcta) {
        const nuevaExp = exp + 1;
        setExp(nuevaExp);
        axios.put(`http://localhost:3001/user/${username}/exp`, { exp: nuevaExp })
          .then(res => console.log(res.data))
          .catch(err => console.error(err));
      }
       else {
        setEstadoRespuesta('incorrecta');
      }
    }
  }

  const siguientePregunta = (e) => {
    e.preventDefault();
    const siguiente = indiceActual + 1;
    setIndiceActual(siguiente < preguntas.length ? siguiente : 0);
    setSeleccionada('');
    setEstadoRespuesta(null);
    setRespondido(false);
    axios.put(`http://localhost:3001/user/${username}/increment`)
      .then(res => {
        console.log(res.data);
        setQuestionsToday(questionsToday + 1);
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {cargando ? (
        <Loading />
      ) : questionsToday === 5 ? (
        <div className="text-white text-center p-4 rounded-lg bg-blue-500">
          Has completado tus preguntas diarias. Por favor, vuelve mañana.
        </div>
      ) : preguntas.length > 0 && preguntas[indiceActual] ? (
        <div className="bg-slate-200 dark:bg-slate-700 p-6 rounded-lg shadow-md">
           <h1 className='text-gray-500 dark:text-indigo-500'> Has respondido {questionsToday}/5 preguntas hoy.</h1>
          <h1 className="text-2xl font-bold mb-4 text-black dark:text-indigo-200">
            {preguntas[indiceActual].pregunta}
          </h1>
          {preguntas[indiceActual].respuestas.map((respuesta, index) => (
            <button
              key={index}
              className={`block w-full p-4 my-2 text-white rounded ${
                respuesta === seleccionada
                  ? respuesta === preguntas[indiceActual].correcta
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : 'bg-blue-500'
              }`}
              onClick={() => manejarClick(respuesta)}
              disabled={respondido}
            >
              {respuesta}
            </button>
          ))}
          {estadoRespuesta === 'correcta' && (
            <div className="text-green-500">Tu respuesta es correcta.</div>
          )}
          {estadoRespuesta === 'incorrecta' && (
            <div className="text-red-500">Tu respuesta es incorrecta.</div>
          )}
          {seleccionada && (
            <button
              className="bg-gray-500 text-white p-2 rounded mt-4"
              onClick={siguientePregunta}
            >
              Siguiente pregunta
            </button>
          )}
        </div>
      ) : (
        <div className="text-white text-center p-4 rounded-lg bg-blue-500">
          No hay más preguntas por responder hoy. Por favor, vuelve mañana.
        </div>
      )}
     
    </div>
  );
  
}

export default Trivia;
