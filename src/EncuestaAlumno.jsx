import React, { useState } from 'react';
import { supabase } from './supabaseClient'; 

export default function EncuestaAlumno() {
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [percepcionClara, setPercepcionClara] = useState(null);
  const [percepcionRespeto, setPercepcionRespeto] = useState(null);
  const [percepcionSeguridad, setPercepcionSeguridad] = useState(null);

  // 1. ESCÁNER BLINDADO: Extraemos los IDs de la URL de forma segura
  const searchParams = new URLSearchParams(window.location.search);
  const evalId = searchParams.get('eval_id') || 'SIN-ID';
  let mentorId = searchParams.get('mentor_id');
  
  // Limpieza de seguridad: Si el mentorId no es un UUID válido, lo dejamos nulo para que Supabase no explote
  if (!mentorId || mentorId === 'null' || mentorId === 'undefined' || mentorId.trim() === '') {
    mentorId = null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!percepcionClara || !percepcionRespeto || !percepcionSeguridad) {
      alert("⚠️ Por favor califica las 3 áreas para poder enviar tu evaluación.");
      return;
    }

    setEnviando(true);

    // 2. TRANSMISIÓN A SUPABASE (Tabla: encuestas_alumnos)
    const { error } = await supabase.from('encuestas_alumnos').insert([{
      evaluacion_id_qr: evalId,
      mentor_id: mentorId,
      percepcion_clara: percepcionClara,
      percepcion_respeto: percepcionRespeto,
      percepcion_seguridad: percepcionSeguridad
    }]);

    setEnviando(false);

    if (error) {
      console.error("Detalle técnico del error:", error);
      // ESTA ALERTA ES CLAVE: Nos dirá exactamente por qué Supabase rechaza el envío
      alert(`❌ Error de Supabase: ${error.message} \n\nDetalles: ${error.details}`);
    } else {
      setEnviado(true);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border-t-8 border-emerald-500">
          <div className="text-7xl mb-6">✅</div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-wide">¡Evaluación Recibida!</h2>
          <p className="text-slate-600 font-medium">Tus respuestas han sido enviadas de forma segura y anónima a nuestra base de datos.</p>
          <p className="mt-6 text-sm text-slate-400 font-bold">Ya puedes cerrar esta pestaña.</p>
        </div>
      </div>
    );
  }

  const CaritaBoton = ({ valor, estadoActual, setEstado, emoji, texto }) => {
    const isSelected = estadoActual === valor;
    return (
      <button 
        type="button" 
        onClick={() => setEstado(valor)}
        disabled={enviando}
        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 w-full ${
          isSelected 
            ? 'border-blue-500 bg-blue-50 transform scale-105 shadow-md' 
            : 'border-slate-200 hover:bg-slate-50 grayscale hover:grayscale-0'
        } ${enviando ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="text-4xl mb-2">{emoji}</span>
        <span className={`text-sm font-bold uppercase tracking-wider ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
          {texto}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* ENCABEZADO */}
        <div className="bg-slate-900 p-6 text-center">
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">Voz del Alumno</h1>
          <p className="text-blue-400 font-medium mt-1">Evaluación de Desempeño del Mentor</p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-8">
            <p className="text-sm text-blue-800 font-medium text-center">
              Instrucciones: Contesta con sinceridad. Esta encuesta es 100% confidencial.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-800 mb-4 text-center text-lg">1. ¿El mentor resolvió tus dudas de forma clara?</p>
            <div className="flex justify-between gap-3">
              <CaritaBoton valor="Feliz" estadoActual={percepcionClara} setEstado={setPercepcionClara} emoji="😃" texto="Muy Claro" />
              <CaritaBoton valor="Neutral" estadoActual={percepcionClara} setEstado={setPercepcionClara} emoji="😐" texto="Regular" />
              <CaritaBoton valor="Triste" estadoActual={percepcionClara} setEstado={setPercepcionClara} emoji="😞" texto="Con Dudas" />
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-800 mb-4 text-center text-lg">2. ¿Te sentiste apoyado y respetado en la práctica?</p>
            <div className="flex justify-between gap-3">
              <CaritaBoton valor="Feliz" estadoActual={percepcionRespeto} setEstado={setPercepcionRespeto} emoji="🤝" texto="Sí" />
              <CaritaBoton valor="Neutral" estadoActual={percepcionRespeto} setEstado={setPercepcionRespeto} emoji="😐" texto="Neutral" />
              <CaritaBoton valor="Triste" estadoActual={percepcionRespeto} setEstado={setPercepcionRespeto} emoji="⚠️" texto="No" />
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-800 mb-4 text-center text-lg">3. ¿Las indicaciones de seguridad fueron entendibles?</p>
            <div className="flex justify-between gap-3">
              <CaritaBoton valor="Feliz" estadoActual={percepcionSeguridad} setEstado={setPercepcionSeguridad} emoji="🛡️" texto="Seguro" />
              <CaritaBoton valor="Neutral" estadoActual={percepcionSeguridad} setEstado={setPercepcionSeguridad} emoji="😐" texto="Confuso" />
              <CaritaBoton valor="Triste" estadoActual={percepcionSeguridad} setEstado={setPercepcionSeguridad} emoji="🚩" texto="Riesgoso" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={enviando}
            className={`w-full bg-blue-600 text-white font-black text-lg p-5 rounded-xl uppercase tracking-widest transition-colors shadow-lg mt-4 ${enviando ? 'opacity-70 cursor-wait' : 'hover:bg-blue-700'}`}
          >
            {enviando ? 'Transmitiendo...' : 'Enviar Evaluación Anónima'}
          </button>
        </div>
      </form>
    </div>
  );
}