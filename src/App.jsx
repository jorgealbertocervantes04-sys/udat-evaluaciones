import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, AlertTriangle, CheckCircle, TrendingUp, ShieldCheck,
  RefreshCw, Database, Filter, ThumbsUp, ThumbsDown
} from 'lucide-react';

// ============================================================================
// DICCIONARIO DE CRITERIOS (Basado en resultados_checklist)
// ============================================================================
const CHECKLIST_LABELS = {
  c1: 'Uso de cinturón de seguridad',
  c2: 'Revisión de espejos antes de arrancar',
  c3: 'Respeto de límites de velocidad',
  c4: 'Uso correcto de direccionales',
  c5: 'Frenado suave y anticipado',
  c6: 'Revisión de puntos ciegos',
  c7: 'Distancia de seguridad adecuada',
  c8: 'Postura correcta al volante',
  c9: 'Uso adecuado del freno de motor',
  c10: 'Conocimiento de reglamento de tránsito'
};

// ============================================================================
// DATOS DE MUESTRA 
// ============================================================================
const mockMentores = [
  { id: '1', nombre: 'Ines Solano Ojeda', puesto: 'Apoyo' },
  { id: '2', nombre: 'Sergio Pérez Pelcastre', puesto: 'Lider' },
  { id: '3', nombre: 'Antonio Barron Ramirez', puesto: 'Apoyo' },
  { id: '4', nombre: 'Rigoberto C. Gallardo', puesto: 'Lider' },
  { id: '5', nombre: 'Francisco J. Perez', puesto: 'Apoyo' },
];

const mockEvaluaciones = [
  { mentor_id: '2', tipo: 'Conducción', calificacion: 85, alerta: false, fecha: '2026-08-01', resultados_checklist: {c1: true, c2: true, c3: false, c4: true, c5: true, c6: false, c7: true, c8: true, c9: true, c10: true} },
  { mentor_id: '4', tipo: 'Maniobras', calificacion: 92, alerta: false, fecha: '2026-08-02', resultados_checklist: {c1: true, c2: true, c3: true, c4: true, c5: false, c6: true, c7: true, c8: true, c9: true, c10: true} },
  { mentor_id: '1', tipo: 'Conducción', calificacion: 47, alerta: true, fecha: '2026-08-05', resultados_checklist: {c1: false, c2: false, c3: true, c4: true, c5: false, c6: false, c7: true, c8: false, c9: false, c10: true} },
  { mentor_id: '2', tipo: 'Reglamento', calificacion: 88, alerta: false, fecha: '2026-08-10', resultados_checklist: {c1: true, c2: true, c3: true, c4: false, c5: true, c6: true, c7: true, c8: true, c9: false, c10: true} },
  { mentor_id: '3', tipo: 'Conducción', calificacion: 78, alerta: false, fecha: '2026-08-12', resultados_checklist: {c1: true, c2: false, c3: true, c4: true, c5: false, c6: true, c7: true, c8: true, c9: true, c10: false} },
  { mentor_id: '5', tipo: 'Maniobras', calificacion: 65, alerta: true, fecha: '2026-08-15', resultados_checklist: {c1: true, c2: false, c3: false, c4: false, c5: true, c6: false, c7: true, c8: true, c9: true, c10: false} },
  { mentor_id: '4', tipo: 'Conducción', calificacion: 95, alerta: false, fecha: '2026-08-20', resultados_checklist: {c1: true, c2: true, c3: true, c4: true, c5: true, c6: true, c7: true, c8: false, c9: true, c10: true} },
];

const mockEncuestas = [
  { mentor_id: '2', clara: 'Feliz', respeto: 'Feliz', seguridad: 'Feliz' },
  { mentor_id: '4', clara: 'Feliz', respeto: 'Feliz', seguridad: 'Feliz' },
  { mentor_id: '1', clara: 'Neutral', respeto: 'Feliz', seguridad: 'Neutral' },
  { mentor_id: '2', clara: 'Feliz', respeto: 'Feliz', seguridad: 'Feliz' },
  { mentor_id: '5', clara: 'Triste', respeto: 'Neutral', seguridad: 'Triste' },
  { mentor_id: '3', clara: 'Feliz', respeto: 'Feliz', seguridad: 'Feliz' },
];

const COLORS = ['#1E3A8A', '#3B82F6', '#93C5FD', '#F59E0B', '#EF4444'];

export default function DashboardOperadores() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [syncMessage, setSyncMessage] = useState({ text: '', type: '' });
  const [selectedMentor, setSelectedMentor] = useState('ALL');
  const [data, setData] = useState({
    mentores: mockMentores,
    evaluaciones: mockEvaluaciones,
    encuestas: mockEncuestas
  });

  // Función auxiliar para convertir el texto CSV a un formato utilizable por el dashboard
  const csvToJson = (csv, tipo) => {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = values[i] ? values[i].trim() : '';
      });

      // Transformaciones especiales según el tipo de tabla
      if (tipo === 'evaluaciones') {
        obj.calificacion = Number(obj.calificacion) || 0;
        obj.alerta = obj.alerta?.toLowerCase() === 'true' || obj.alerta === 'VERDADERO';
        
        // Asumiendo que en tu CSV las columnas de checklist se llaman c1, c2, c3...
        obj.resultados_checklist = {};
        Object.keys(CHECKLIST_LABELS).forEach(key => {
          obj.resultados_checklist[key] = obj[key]?.toLowerCase() === 'true' || obj[key] === 'VERDADERO' || obj[key] === '1';
        });
      }
      return obj;
    });
  };

  const handleUpdateFromSheets = async () => {
    setIsUpdating(true);
    setSyncMessage({ text: 'Conectando con la base de datos...', type: 'info' });
    
    try {
      // ENLACE BASE (El que me proporcionaste)
      const URL_MENTORES = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_l7UUL9iWyN4njouoVWnp_SiImfuSLsA9Okk3uhU1Sunc77BPJJJHKEbQPahxTNMiuBJpyutTfQXg/pubhtml';
      
      // 👉 TRUCO: Reemplaza "PON_AQUI_EL_NUMERO" por el GID que sacaste de la barra de direcciones
      const URL_EVALUACIONES = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_l7UUL9iWyN4njouoVWnp_SiImfuSLsA9Okk3uhU1Sunc77BPJJJHKEbQPahxTNMiuBJpyutTfQXg/pubhtml';
      const URL_ENCUESTAS = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_l7UUL9iWyN4njouoVWnp_SiImfuSLsA9Okk3uhU1Sunc77BPJJJHKEbQPahxTNMiuBJpyutTfQXg/pubhtml';

      // 1. Descargamos Mentores
      const resMentores = await fetch(URL_MENTORES);
      const csvMentores = await resMentores.text();

      // 2. Descargamos Evaluaciones 
      // (Si ves error en pantalla, verifica que el enlace sea correcto y quita el comentario a estas 2 lineas)
      const resEvaluaciones = await fetch(URL_EVALUACIONES);
      const csvEvaluaciones = await resEvaluaciones.text();

      // 3. Descargamos Encuestas
      const resEncuestas = await fetch(URL_ENCUESTAS);
      const csvEncuestas = await resEncuestas.text();

      setData(prevData => ({
        ...prevData,
        mentores: csvToJson(csvMentores, 'mentores'),
        evaluaciones: csvToJson(csvEvaluaciones, 'evaluaciones'),
        encuestas: csvToJson(csvEncuestas, 'encuestas')
      }));

      setSyncMessage({ text: '¡Sincronización exitosa con las 3 hojas!', type: 'success' });
    } catch (error) {
      console.error("Error al sincronizar con Sheets:", error);
      setSyncMessage({ text: 'Error de conexión. Verifica que el documento de Google Sheets sea público.', type: 'error' });
    } finally {
      setIsUpdating(false);
      // Limpiamos la notificación después de 6 segundos
      setTimeout(() => setSyncMessage({ text: '', type: '' }), 6000);
    }
  };

  // ============================================================================
  // FILTRADO DINÁMICO
  // ============================================================================
  const filteredEvaluaciones = useMemo(() => {
    return selectedMentor === 'ALL' 
      ? data.evaluaciones 
      : data.evaluaciones.filter(e => e.mentor_id === selectedMentor);
  }, [selectedMentor, data.evaluaciones]);

  const filteredEncuestas = useMemo(() => {
    return selectedMentor === 'ALL' 
      ? data.encuestas 
      : data.encuestas.filter(e => e.mentor_id === selectedMentor);
  }, [selectedMentor, data.encuestas]);

  // ============================================================================
  // PROCESAMIENTO DE DATOS
  // ============================================================================
  const rendimientoMentores = data.mentores.map(mentor => {
    const evals = data.evaluaciones.filter(e => e.mentor_id === mentor.id);
    const prom = evals.length > 0 ? evals.reduce((acc, curr) => acc + curr.calificacion, 0) / evals.length : 0;
    return { nombre: mentor.nombre, promedio: Math.round(prom) };
  }).filter(m => m.promedio > 0);

  const tiposEvalCount = filteredEvaluaciones.reduce((acc, curr) => {
    acc[curr.tipo] = (acc[curr.tipo] || 0) + 1;
    return acc;
  }, {});
  const dataTiposEval = Object.keys(tiposEvalCount).map(key => ({ name: key, value: tiposEvalCount[key] }));

  // Desglose de aciertos y errores (Solo se usa si hay un mentor seleccionado)
  const analisisTecnico = useMemo(() => {
    if (selectedMentor === 'ALL') return null;
    
    let aciertos = {};
    let errores = {};
    
    filteredEvaluaciones.forEach(evaluacion => {
      Object.entries(evaluacion.resultados_checklist).forEach(([clave, cumplio]) => {
        const etiqueta = CHECKLIST_LABELS[clave] || clave;
        if (cumplio) {
          aciertos[etiqueta] = (aciertos[etiqueta] || 0) + 1;
        } else {
          errores[etiqueta] = (errores[etiqueta] || 0) + 1;
        }
      });
    });

    return { 
      aciertos: Object.entries(aciertos).sort((a, b) => b[1] - a[1]), 
      errores: Object.entries(errores).sort((a, b) => b[1] - a[1]) 
    };
  }, [selectedMentor, filteredEvaluaciones]);

  // KPIs
  const totalEvaluaciones = filteredEvaluaciones.length;
  const promedioGeneral = totalEvaluaciones > 0 
    ? Math.round(filteredEvaluaciones.reduce((acc, curr) => acc + curr.calificacion, 0) / totalEvaluaciones) 
    : 0;
  const alertasRetencion = filteredEvaluaciones.filter(e => e.alerta).length;
  const porcentajeFelices = filteredEncuestas.length > 0 
    ? Math.round((filteredEncuestas.filter(e => e.clara === 'Feliz').length / filteredEncuestas.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 font-sans">
      
      {/* HEADER Y CONTROLES */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-700" />
            Centro de Control de Formación
          </h1>
          <p className="text-slate-500 mt-1">Monitoreo de Desempeño de Mentores</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:min-w-[250px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-slate-400" />
            </div>
            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="ALL">Todos los Mentores (Flotilla General)</option>
              {data.mentores.map(m => (
                <option key={m.id} value={m.id}>{m.nombre} - {m.puesto}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleUpdateFromSheets}
            disabled={isUpdating}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-white transition-colors
              ${isUpdating ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 shadow-sm'}`}
          >
            {isUpdating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
            {isUpdating ? 'Sincronizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* MENSAJE DE SINCRONIZACIÓN (Notificación en pantalla) */}
      {syncMessage.text && (
        <div className={`mb-6 p-4 rounded-md flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          syncMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 
          syncMessage.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {syncMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
           syncMessage.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : 
           <RefreshCw className="w-5 h-5 animate-spin" />}
          <p className="text-sm font-medium">{syncMessage.text}</p>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Evaluaciones" value={totalEvaluaciones} icon={<CheckCircle className="w-6 h-6 text-blue-600" />} />
        <KpiCard title="Promedio" value={`${promedioGeneral}/100`} icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} />
        <KpiCard title="Alertas" value={alertasRetencion} icon={<AlertTriangle className="w-6 h-6 text-amber-500" />} alert={alertasRetencion > 0} />
        <KpiCard title="Satisfacción" value={`${porcentajeFelices}%`} icon={<Users className="w-6 h-6 text-indigo-600" />} />
      </div>

      {/* SECCIÓN DINÁMICA: ANÁLISIS TÉCNICO (Solo visible si se selecciona un mentor) */}
      {selectedMentor !== 'ALL' && analisisTecnico && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">
            Análisis de Desempeño Técnico: {data.mentores.find(m => m.id === selectedMentor)?.nombre}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Aciertos */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-emerald-700">
                <ThumbsUp className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Criterios Cumplidos (Aciertos)</h3>
              </div>
              {analisisTecnico.aciertos.length > 0 ? (
                <ul className="space-y-3">
                  {analisisTecnico.aciertos.map(([criterio, conteo], idx) => (
                    <li key={idx} className="flex justify-between items-center bg-emerald-50 px-4 py-2 rounded-md border border-emerald-100">
                      <span className="text-sm text-slate-700">{criterio}</span>
                      <span className="text-xs font-bold bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full">
                        {conteo} {conteo === 1 ? 'vez' : 'veces'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">No hay registros de aciertos.</p>
              )}
            </div>

            {/* Errores */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-red-700">
                <ThumbsDown className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Áreas de Oportunidad (Errores)</h3>
              </div>
              {analisisTecnico.errores.length > 0 ? (
                <ul className="space-y-3">
                  {analisisTecnico.errores.map(([criterio, conteo], idx) => (
                    <li key={idx} className="flex justify-between items-center bg-red-50 px-4 py-2 rounded-md border border-red-100">
                      <span className="text-sm text-slate-700">{criterio}</span>
                      <span className="text-xs font-bold bg-red-200 text-red-800 px-2 py-1 rounded-full">
                        Falló {conteo} {conteo === 1 ? 'vez' : 'veces'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">¡Excelente! No hay áreas de oportunidad registradas.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Gráfico de Barras: Se oculta si hay un mentor seleccionado para no ser redundante, 
            mostramos una tabla de historial en su lugar */}
        {selectedMentor === 'ALL' ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">Promedio de Calificación por Mentor</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rendimientoMentores} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="nombre" tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#64748b'}} />
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none'}}/>
                  <Bar dataKey="promedio" fill="#1E3A8A" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex flex-col">
             <h2 className="text-lg font-semibold mb-4 text-slate-800">Historial de Evaluaciones</h2>
             <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="pb-3 font-medium">Fecha</th>
                    <th className="pb-3 font-medium">Tipo</th>
                    <th className="pb-3 font-medium">Calificación</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvaluaciones.map((evaluacion, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 text-sm text-slate-700">{evaluacion.fecha}</td>
                      <td className="py-3 text-sm text-slate-700">{evaluacion.tipo}</td>
                      <td className="py-3 text-sm font-bold text-slate-800">{evaluacion.calificacion}</td>
                    </tr>
                  ))}
                  {filteredEvaluaciones.length === 0 && (
                    <tr><td colSpan="3" className="py-4 text-center text-slate-500">Sin evaluaciones</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Distribución por Tipo de Evaluación</h2>
          <div className="h-72 w-full flex-1">
            {dataTiposEval.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataTiposEval}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {dataTiposEval.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none'}}/>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="flex h-full items-center justify-center text-slate-400">Sin datos suficientes</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

function KpiCard({ title, value, icon, alert = false }) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border ${alert ? 'border-amber-300 bg-amber-50/50' : 'border-slate-100'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
}