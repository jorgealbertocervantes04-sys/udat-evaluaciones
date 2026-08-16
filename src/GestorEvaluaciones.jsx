import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import SignatureCanvas from 'react-signature-canvas';
import { QRCodeSVG } from 'qrcode.react';

// =====================================================================
// DICCIONARIO EXACTO DE LOS EXCEL (32 Aula, 29 Maniobras, 30 Conducción)
// =====================================================================

const criteriosAula = [
  { id: 'a1', categoria: 'Antes de iniciar la clase', texto: "Prepara con anticipación el material necesario para su clase (listas de asistencia, exámenes, hojas, lápices, etc.)", riesgo: 'Medio', color: 'yellow' },
  { id: 'a2', categoria: 'Antes de iniciar la clase', texto: "Revisa las condiciones y funcionamiento del equipo electrónico que utilizará para su exposición", riesgo: 'Medio', color: 'yellow' },
  { id: 'a3', categoria: 'Antes de iniciar la clase', texto: "Revisa el orden y limpieza del aula, así como las condiciones de seguridad requeridas para su impartición", riesgo: 'Alto', color: 'red' },
  { id: 'a4', categoria: 'Antes de iniciar la clase', texto: "Comunica las reglas de seguridad y las condiciones de trabajo a realizar antes y durante la sesión", riesgo: 'Alto', color: 'red' },
  { id: 'a5', categoria: 'Durante la clase', texto: "Inicia su sesión explicando el propósito de la actividad o tema", riesgo: 'Medio', color: 'yellow' },
  { id: 'a6', categoria: 'Durante la clase', texto: "Realiza una pregunta detonante que permita centrar a los alumnos en la importancia de prestar atención al tema", riesgo: 'Medio', color: 'yellow' },
  { id: 'a7', categoria: 'Durante la clase', texto: "Utiliza tecnología y domina el uso de la multimedia (por ejemplo, PowerPoints, excel, etc)", riesgo: 'Medio', color: 'yellow' },
  { id: 'a8', categoria: 'Durante la clase', texto: "Entrega contenido consistente con la lección indicada objetivos y plan de estudios.", riesgo: 'Medio', color: 'yellow' },
  { id: 'a9', categoria: 'Durante la clase', texto: "Ilustra los conceptos de la lección con ejemplos relevantes y / o establece conexiones significativas con material relacionado.", riesgo: 'Medio', color: 'yellow' },
  { id: 'a10', categoria: 'Durante la clase', texto: "Se desplaza correctamente en el entorno y mantiene una postura de ejemplo en su clase.", riesgo: 'Medio', color: 'yellow' },
  { id: 'a11', categoria: 'Durante la clase', texto: "Demuestra dominio del contenido / tema de la lección a enseñar", riesgo: 'Medio', color: 'yellow' },
  { id: 'a12', categoria: 'Durante la clase', texto: "Demuestra un enfoque centrado en el estudiante (no pierde tiempos y busca el aprendizaje en todo momento).", riesgo: 'Medio', color: 'yellow' },
  { id: 'a13', categoria: 'Durante la clase', texto: "Facilita los temas y logra la participación de los alumnos en las actividades de la clase", riesgo: 'Medio', color: 'yellow' },
  { id: 'a14', categoria: 'Durante la clase', texto: "Mantiene una relación positiva con la clase, adecua su tono de voz y evita hacer comentarios imprudentes o groseros.", riesgo: 'Alto', color: 'red' },
  { id: 'a15', categoria: 'Durante la clase', texto: "Comprueba la comprensión del tema al realizar preguntas concretas y solicitar respuestas amplias", riesgo: 'Medio', color: 'yellow' },
  { id: 'a16', categoria: 'Durante la clase', texto: "Mantiene la disciplina del grupo antes, durante y después de su clase", riesgo: 'Alto', color: 'red' },
  { id: 'a17', categoria: 'Durante la clase', texto: "Evita el uso de su celular y el de los alumnos durante la clase", riesgo: 'Alto', color: 'red' },
  { id: 'a18', categoria: 'Durante la clase', texto: "Emplea técnicas apropiadas de corrección de errores y/o retroalimentar al alumno (método de los 4 pasos, técnica de los V.E.S.O.S. Veridico, Específico, Sincero, Oportuno, Siempre)", riesgo: 'Medio', color: 'yellow' },
  { id: 'a19', categoria: 'Durante la clase', texto: "Utiliza el material que preparó para la sesión (lista de asistencia, proyección de información y ejercicios o prácticas)", riesgo: 'Bajo', color: 'green' },
  { id: 'a20', categoria: 'Durante la clase', texto: "Emplea técnicas efectivas de gestión del aula (uso del tiempo, no tiempos muertos o desvios del tema)", riesgo: 'Medio', color: 'yellow' },
  { id: 'a21', categoria: 'Durante la clase', texto: "Mantiene la atención de los estudiantes (por ejemplo, controla el uso de la tecnología)", riesgo: 'Medio', color: 'yellow' },
  { id: 'a22', categoria: 'Durante la clase', texto: "Dirige y ajusta el ritmo de la lección para satisfacer las necesidades de los estudiantes, usando varios recursos para generar aprendizajes (Reflexión, Síntesis, etc.)", riesgo: 'Medio', color: 'yellow' },
  { id: 'a23', categoria: 'Durante la clase', texto: "Demuestran la capacidad de instruir y gestionar a los estudiantes en diferentes niveles y/o habilidades.", riesgo: 'Medio', color: 'yellow' },
  { id: 'a24', categoria: 'Durante la clase', texto: "Utiliza materiales didácticos complementarios para explicar mejor el tema (camiones a escala, simuladores, etc.)", riesgo: 'Medio', color: 'yellow' },
  { id: 'a25', categoria: 'Durante la clase', texto: "Demuestra entusiasmo en su proceso de enseñanza", riesgo: 'Medio', color: 'yellow' },
  { id: 'a26', categoria: 'Durante la clase', texto: "Reconoce el logro y avance del alumno en formación con el indicador del desempeño establecido", riesgo: 'Medio', color: 'yellow' },
  { id: 'a27', categoria: 'Durante la clase', texto: "Promueve los valores éticos y de seguridad que la cultura Alianza Trayecto tiene declarados", riesgo: 'Alto', color: 'red' },
  { id: 'a28', categoria: 'Durante la clase', texto: "Facilita las transiciones organizadas entre actividades y/o tareas (resuelve dudas, aclara actividades y da instrucciones completas)", riesgo: 'Medio', color: 'yellow' },
  { id: 'a29', categoria: 'Seguimiento posterior a la Clase', texto: "Facilita las transiciones organizadas entre actividades (desplazamientos entre aula, simulador, camión, etc.)", riesgo: 'Medio', color: 'yellow' },
  { id: 'a30', categoria: 'Seguimiento posterior a la Clase', texto: "Monitorea eficazmente las actividades de práctica de los estudiantes y revisa que se hayan realizado las tareas", riesgo: 'Medio', color: 'yellow' },
  { id: 'a31', categoria: 'Seguimiento posterior a la Clase', texto: "Documenta en el sistema de evaluación las actividades aplicadas en cada cierre de módulo.", riesgo: 'Bajo', color: 'green' },
  { id: 'a32', categoria: 'Seguimiento posterior a la Clase', texto: "Entrega sus evidencias de actividades en tiempo y forma de acuerdo al tiempo asignado (día, semana y cierre)", riesgo: 'Bajo', color: 'green' }
];

const criteriosManiobras = [
  { id: 'm1', categoria: 'Práctica en Maniobras', texto: "Expone el propósito / objetivo del ejercicio antes de iniciar cada práctica", riesgo: 'Medio', color: 'yellow' },
  { id: 'm2', categoria: 'Práctica en Maniobras', texto: "Explica los principios de la seguridad antes de iniciar sus prácticas o maniobras", riesgo: 'Alto', color: 'red' },
  { id: 'm3', categoria: 'Práctica en Maniobras', texto: "Utiliza su uniforme y equipo de protección personal (EPP) adecuado a cada ambiente de trabajo.", riesgo: 'Alto', color: 'red' },
  { id: 'm4', categoria: 'Práctica en Maniobras', texto: "Asegura al revisar de manera anticipada que tendrá un ambiente seguro antes de iniciar sus prácticas (Inspección de camión, revisión del sitio para prácticas, etc.).", riesgo: 'Alto', color: 'red' },
  { id: 'm5', categoria: 'Práctica en Maniobras', texto: "Registra en Sistema de Evaluación en tiempo real los datos de la práctica.", riesgo: 'Medio', color: 'yellow' },
  { id: 'm6', categoria: 'Práctica en Maniobras', texto: "Utiliza el método de los 4 pasos en el proceso de práctica de maniobras (explia, demuestra, ejecuta, retroalimenta)", riesgo: 'Medio', color: 'yellow' },
  { id: 'm7', categoria: 'Práctica en Maniobras', texto: "Permanece atento y se asegura de que los procedimientos y movimientos se están realizando de forma segura (no deja a los alumnos solos)", riesgo: 'Alto', color: 'red' },
  { id: 'm8', categoria: 'Práctica en Maniobras', texto: "Mantiene a todo el grupo interesado e involucrado en el proceso de la práctica (pregunta e involucra a los demás alumnos aún cuando no estan en su turno de conducir)", riesgo: 'Medio', color: 'yellow' },
  { id: 'm9', categoria: 'Práctica en Maniobras', texto: "Pregunta sobre lo aprendido y retroalimenta a cada alumno al terminar la maniobra que acaba de realizar (áreas de oportunidad)", riesgo: 'Medio', color: 'yellow' },
  { id: 'm10', categoria: 'Práctica en Maniobras', texto: "Evita actos inseguros anticipandose y retroalimentando al alumno del comportamiento observado (prevenir incidentes y accidentes)", riesgo: 'Alto', color: 'red' },
  { id: 'm11', categoria: 'Práctica en Maniobras', texto: "Conoce, explica y aplica el método propio de cada actividad según corresponda (9-12-9, 3-12-3)", riesgo: 'Medio', color: 'yellow' },
  { id: 'm12', categoria: 'Práctica en Maniobras', texto: "Trata a sus alumnos con respeto, utiliza un lenguaje adecuado y sin groserías.", riesgo: 'Medio', color: 'yellow' },
  { id: 'm13', categoria: 'Práctica en Maniobras', texto: "Demuestra entusiasmo en su proceso de enseñanza y prácticas de campo", riesgo: 'Medio', color: 'yellow' },
  { id: 'm14', categoria: 'Práctica en Maniobras', texto: "Evita el uso de su celular y el de los alumnos durante la clase", riesgo: 'Alto', color: 'red' },
  { id: 'm15', categoria: 'Práctica en Maniobras', texto: "Reconoce el logro y avance del alumno en formación con buen trabajo utilizando el método de los V.E.S.O.S. (Veridico, Específico, Sincero, Oportuno, Simpre)", riesgo: 'Medio', color: 'yellow' },
  { id: 'm16', categoria: 'Práctica en Maniobras', texto: "Promueve los valores éticos y de seguridad que la cultura Alianza Trayecto tiene declarados", riesgo: 'Alto', color: 'red' },
  { id: 'm17', categoria: 'Práctica en Maniobras', texto: "Se asegurarse que la práctica / agenda, se está siguiendo de la manera que se planificó, dando oportunidad a cada uno de los participantes.", riesgo: 'Medio', color: 'yellow' },
  { id: 'm18', categoria: 'Práctica en Maniobras', texto: "Sabe como conducirse / explicar, con el fin de transmitir sus conocimientos correctamente a los alumnos. ", riesgo: 'Medio', color: 'yellow' },
  { id: 'm19', categoria: 'Práctica en Maniobras', texto: "Trasmite y existe muy buena conexión con los alumnos.", riesgo: 'Medio', color: 'yellow' },
  { id: 'm20', categoria: 'Práctica en Maniobras', texto: "Muestra empatía / facilidad para interactuar con diferentes tipos de personas.", riesgo: 'Medio', color: 'yellow' },
  { id: 'm21', categoria: 'Práctica en Maniobras', texto: "Tiene la habilidad para captar y mantener la atención de los alumnos.", riesgo: 'Medio', color: 'yellow' },
  { id: 'm22', categoria: 'Práctica en Maniobras', texto: "Cuenta con la creatividad para adaptar el entrenamiento a las posibilidades de cada alumno", riesgo: 'Medio', color: 'yellow' },
  { id: 'm23', categoria: 'Práctica en Maniobras', texto: "Muestra interes por motivar e influir en sus vidas para que mejoren.", riesgo: 'Medio', color: 'yellow' },
  { id: 'm24', categoria: 'Práctica en Maniobras', texto: "Invita a que los alumnos hagan una síntesis de lo aprendido", riesgo: 'Medio', color: 'yellow' },
  { id: 'm25', categoria: 'Práctica en Maniobras', texto: "Invita a que todos los participantes se comprometan a hacer lo que se les pida durante la práctica.", riesgo: 'Medio', color: 'yellow' },
  { id: 'm26', categoria: 'Práctica en Maniobras', texto: "Se mantiene frente a grupo y en prácticas en constante movimiento, siempre atento a los procedimientos de seguridad", riesgo: 'Alto', color: 'red' },
  { id: 'm27', categoria: 'Práctica en Maniobras', texto: "Desarrolla diversas tecnicas con los alumnos para facilitar el aprendizaje", riesgo: 'Medio', color: 'yellow' },
  { id: 'm28', categoria: 'Práctica en Maniobras', texto: "Previo a cualquier práctica explica a los alumnos los puntos de riesgo que pueden encontrarse al realizar la maniobra", riesgo: 'Alto', color: 'red' },
  { id: 'm29', categoria: 'Práctica en Maniobras', texto: "Trabaja el concepto de \"puntos de referencia\" que le ayuden al alumno a comprender  los movimientos de la unidad", riesgo: 'Medio', color: 'yellow' }
];

const criteriosConduccion = [
  { id: 'c1', categoria: 'Manejo en Ciudad y Carretera', texto: "Expone el propósito / objetivo del ejercicio antes de iniciar cada práctica", riesgo: 'Medio', color: 'yellow' },
  { id: 'c2', categoria: 'Manejo en Ciudad y Carretera', texto: "Explica los principios de la seguridad antes de iniciar sus prácticas o maniobras", riesgo: 'Alto', color: 'red' },
  { id: 'c3', categoria: 'Manejo en Ciudad y Carretera', texto: "Utiliza su uniforme y equipo de protección personal adecuado a cada ambiente de trabajo.", riesgo: 'Alto', color: 'red' },
  { id: 'c4', categoria: 'Manejo en Ciudad y Carretera', texto: "Identifica y selecciona la ruta adecuada para la práctica según el propósito del día.", riesgo: 'Medio', color: 'yellow' },
  { id: 'c5', categoria: 'Manejo en Ciudad y Carretera', texto: "Implementa de forma correcta el manejo comentado durante el recorrido. (Realiza las preguntas adecuadas en los momentos oportunos)", riesgo: 'Medio', color: 'yellow' },
  { id: 'c6', categoria: 'Manejo en Ciudad y Carretera', texto: "Retroalimenta en el uso de la transmisión al alumno. (Reconoce y retroalimenta del buen o mal desempeño observado con comentarios claros y adecuados)", riesgo: 'Medio', color: 'yellow' },
  { id: 'c7', categoria: 'Manejo en Ciudad y Carretera', texto: "El mentor preeve las situaciones en la conducción y se anticipa a posibles accidentes durante la conducción. (Manejo preventivo).", riesgo: 'Alto', color: 'red' },
  { id: 'c8', categoria: 'Manejo en Ciudad y Carretera', texto: "Asegura el correcto llenado de formatos y captura de los kilometros y horas recorridas del alumno de manera diaria.", riesgo: 'Bajo', color: 'green' },
  { id: 'c9', categoria: 'Manejo en Ciudad y Carretera', texto: "Verifica que el alumno implemente lo aprendido en los contenidos al momento de salir a carretera (Inspección, Maniobras, Manejo preventivo, Operación técnica)", riesgo: 'Alto', color: 'red' },
  { id: 'c10', categoria: 'Manejo en Ciudad y Carretera', texto: "El mentor integra todas las recomendaciones y observaciones mencionadas durante la práctica en los comentarios de la evaluación.", riesgo: 'Medio', color: 'yellow' },
  { id: 'c11', categoria: 'Manejo en Ciudad y Carretera', texto: "Reconoce y aplica las 5 llaves smith en su enseñanza de campo", riesgo: 'Medio', color: 'yellow' },
  { id: 'c12', categoria: 'Manejo en Ciudad y Carretera', texto: "Evita el uso de su celular y el de los alumnos durante la clase", riesgo: 'Alto', color: 'red' },
  { id: 'c13', categoria: 'Manejo en Ciudad y Carretera', texto: "Reconoce el logro y avance del alumno en formación con buen trabajo utilizando el método de los V.E.S.O.S. (Veridico, Específico, Sincero, Oportuno, Simpre)", riesgo: 'Medio', color: 'yellow' },
  { id: 'c14', categoria: 'Manejo en Ciudad y Carretera', texto: "Promueve los valores éticos y de seguridad que la cultura Alianza Trayecto tiene declarados", riesgo: 'Alto', color: 'red' },
  { id: 'c15', categoria: 'Manejo en Ciudad y Carretera', texto: "Diagnostica / detecta las necesidades/ áreas de oportunidad mas relevantes del estudiante durante su desempeño.", riesgo: 'Medio', color: 'yellow' },
  { id: 'c16', categoria: 'Manejo en Ciudad y Carretera', texto: "Durante el proceso de práctica, les ofrece un reforzamiento en \"síntesis\", de los temas que marca la SCT, tales como: Cultura profesional del operador, Prevención de accidentes, Educación y salud emocional, Educación y Seguridad Víal, Marco normativo (NOM-012, NOM-068 y NOM-087), Conocimiento integral del vehículo, Operación y Conducción, Manejo de carga, Acoplamiento y desacoplamiento, Enfermedades comunes, Cultura del servicio y Medio ambiente.", riesgo: 'Alto', color: 'red' },
  { id: 'c17', categoria: 'Manejo en Ciudad y Carretera', texto: "Durante el proceso de práctica, les recuerda el porque ponerse siempre su cinturón de seguridad.", riesgo: 'Alto', color: 'red' },
  { id: 'c18', categoria: 'Manejo en Ciudad y Carretera', texto: "Durante el proceso de práctica, les recuerda el porque respetar los señalamientos y los límites de velocidad", riesgo: 'Alto', color: 'red' },
  { id: 'c19', categoria: 'Manejo en Ciudad y Carretera', texto: "Durante el proceso de práctica, les recuerda el porque y como sujetar el volante (9:15)", riesgo: 'Alto', color: 'red' },
  { id: 'c20', categoria: 'Manejo en Ciudad y Carretera', texto: "Durante el proceso de práctica, les recuerda el porque hacer ALTO a 5 mts antes de llegar a las vías de ferrocarril.", riesgo: 'Alto', color: 'red' },
  { id: 'c21', categoria: 'Manejo en Ciudad y Carretera', texto: "Durante el proceso de práctica, les recuerda el como aplican las leyes de la física al momento de tomar una curva y que acciones deben de llevar acabo para evitar un accidente.", riesgo: 'Alto', color: 'red' },
  { id: 'c22', categoria: 'Manejo en Ciudad y Carretera', texto: "Durante el proceso de práctica, les recuerda las normas aplicables de la STPS. (NOM-002). (Extintores)", riesgo: 'Alto', color: 'red' },
  { id: 'c23', categoria: 'Manejo en Ciudad y Carretera', texto: "Durante el proceso de práctica, les ofrece un reforzamiento de lo que significa: \"La regla de los 4 segundos\"", riesgo: 'Medio', color: 'yellow' },
  { id: 'c24', categoria: 'Manejo en Ciudad y Carretera', texto: "Durante el proceso de práctica, les recuerda las normas aplicables de la STPS. (NOM-017). (EPP)", riesgo: 'Alto', color: 'red' },
  { id: 'c25', categoria: 'Manejo en Ciudad y Carretera', texto: "Conserva la calma, no grita y no se molesta al momento de que el alumno conduce la unidad.", riesgo: 'Medio', color: 'yellow' },
  { id: 'c26', categoria: 'Manejo en Ciudad y Carretera', texto: "Recomienda al alumno técnicas para realizar una pendiente ascendente o descendente", riesgo: 'Medio', color: 'yellow' },
  { id: 'c27', categoria: 'Manejo en Ciudad y Carretera', texto: "Se asegura de que el alumno comprenda y aplique el freno de motor dentro de su rango de operación (RPM)", riesgo: 'Alto', color: 'red' },
  { id: 'c28', categoria: 'Manejo en Ciudad y Carretera', texto: "El mentor verifica que el alumno circule con luces encendidas y haga uso adecuado de las mismas", riesgo: 'Medio', color: 'yellow' },
  { id: 'c29', categoria: 'Manejo en Ciudad y Carretera', texto: "Al reaizar una maniobra de adelantamiento el mentor se asegura que se realicen las 3 interrogantes corresponientes: ¿Es necesario? ¿Es seguro? ¿Es legal?", riesgo: 'Medio', color: 'yellow' },
  { id: 'c30', categoria: 'Manejo en Ciudad y Carretera', texto: "Se asegura que el alumno comprenda y haga uso adecudo de retrovisores en todo momento", riesgo: 'Medio', color: 'yellow' }
];

export default function GestorEvaluaciones({ evaluadorEmail }) {
  // RED Y SEGURIDAD
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sincronizando, setSincronizando] = useState(false);
  const [listaMentores, setListaMentores] = useState([]);
  const [enviandoData, setEnviandoData] = useState(false);
  
  // ESTADOS DE EVALUACIÓN
  const [mentorId, setMentorId] = useState('');
  const [tipoEvaluacion, setTipoEvaluacion] = useState('Aula');
  const [respuestasChecklist, setRespuestasChecklist] = useState({});
  const [evaluacionId] = useState(crypto.randomUUID()); 
  
  // ESTADOS DEL PLAN DE ACCIÓN SMART
  const [compromisoFortaleza, setCompromisoFortaleza] = useState('');
  const [compromisoMejora, setCompromisoMejora] = useState('');

  const firmaMentorRef = useRef(null);
  const firmaEvaluadorRef = useRef(null);
  
  // INIT
  useEffect(() => {
    const fetchMentores = async () => {
      const { data, error } = await supabase.from('mentores').select('id, nombre_completo, puesto');
      if (!error && data) setListaMentores(data);
    };
    fetchMentores();

    const handleOnline = () => { setIsOnline(true); sincronizarDatosPendientes(); };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  useEffect(() => { 
    setRespuestasChecklist({}); 
    setCompromisoFortaleza('');
    setCompromisoMejora('');
    if (firmaMentorRef.current) firmaMentorRef.current.clear();
    if (firmaEvaluadorRef.current) firmaEvaluadorRef.current.clear();
  }, [tipoEvaluacion]);

  const limpiarFirmaMentor = () => {
    if (firmaMentorRef.current) firmaMentorRef.current.clear();
  };
  
  const limpiarFirmaEvaluador = () => {
    if (firmaEvaluadorRef.current) firmaEvaluadorRef.current.clear();
  };

  const limpiarFormulario = () => {
    setMentorId('');
    setRespuestasChecklist({});
    setCompromisoFortaleza('');
    setCompromisoMejora('');
    limpiarFirmaMentor();
    limpiarFirmaEvaluador();
  };

  // Traduce el valor del botón (1 / 0.5 / 0) a las columnas reales de resultados_criterios
  const mapearCriteriosParaGuardar = (criteriosDetalle) => {
    return criteriosDetalle.map((c) => ({
      categoria: c.categoria,
      criterio_evaluado: c.texto,
      nivel_riesgo: c.riesgo,
      cumple: c.valor === 1,
      observaciones: c.valor === 1 ? 'Cumple (100%)' : c.valor === 0.5 ? 'Cumplimiento parcial (50%)' : 'No cumple (0%)'
    }));
  };

  // TRANSMISIÓN: ahora inserta evaluación + todos los criterios individuales
  const procesarEvaluacion = async (datosFormulario, criteriosDetalle) => {
    setEnviandoData(true);
    if (isOnline) {
      const { data: evaluacionInsertada, error: errorEvaluacion } = await supabase
        .from('evaluaciones')
        .insert([datosFormulario])
        .select('id')
        .single();

      if (errorEvaluacion) {
        setEnviandoData(false);
        console.error("Falla Supabase (evaluaciones):", errorEvaluacion);
        alert(`❌ ERROR DE BASE DE DATOS:\n\n${errorEvaluacion.message}\n\nDetalles: ${errorEvaluacion.details}\n\nPor favor envíame captura de este cuadro rojo.`);
        return;
      }

      const filasCriterios = mapearCriteriosParaGuardar(criteriosDetalle).map((c) => ({
        ...c,
        evaluacion_id: evaluacionInsertada.id
      }));

      const { error: errorCriterios } = await supabase.from('resultados_criterios').insert(filasCriterios);

      setEnviandoData(false);

      if (errorCriterios) {
        console.error("Falla Supabase (resultados_criterios):", errorCriterios);
        alert(`⚠️ La evaluación se guardó (ID ${evaluacionInsertada.id}), pero los criterios detallados fallaron:\n\n${errorCriterios.message}\n\nPor favor envíame captura de este cuadro.`);
      } else {
        alert(`✅ Evaluación de ${tipoEvaluacion} sellada y enviada a la base de datos con éxito (${filasCriterios.length} criterios guardados).`);
        limpiarFormulario();
      }
    } else {
      guardarLocal(datosFormulario, criteriosDetalle);
      setEnviandoData(false);
    }
  };

  const guardarLocal = (datosFormulario, criteriosDetalle) => {
    const pendientes = JSON.parse(localStorage.getItem('evaluaciones_offline')) || [];
    pendientes.push({ datosFormulario, criteriosDetalle });
    localStorage.setItem('evaluaciones_offline', JSON.stringify(pendientes));
    alert("Modo offline: No hay internet. La evaluación se guardó en la tablet.");
    limpiarFormulario();
  };

  const sincronizarDatosPendientes = async () => {
    const pendientes = JSON.parse(localStorage.getItem('evaluaciones_offline')) || [];
    if (pendientes.length === 0) return;
    setSincronizando(true);

    const pendientesFallidos = [];
    let enviadosOk = 0;

    for (const item of pendientes) {
      const { datosFormulario, criteriosDetalle } = item;

      const { data: evaluacionInsertada, error: errorEvaluacion } = await supabase
        .from('evaluaciones')
        .insert([datosFormulario])
        .select('id')
        .single();

      if (errorEvaluacion) {
        pendientesFallidos.push(item);
        continue;
      }

      const filasCriterios = mapearCriteriosParaGuardar(criteriosDetalle || []).map((c) => ({
        ...c,
        evaluacion_id: evaluacionInsertada.id
      }));

      if (filasCriterios.length > 0) {
        const { error: errorCriterios } = await supabase.from('resultados_criterios').insert(filasCriterios);
        if (errorCriterios) {
          console.error("Falla al sincronizar criterios de evaluación offline:", errorCriterios);
        }
      }

      enviadosOk++;
    }

    localStorage.setItem('evaluaciones_offline', JSON.stringify(pendientesFallidos));
    setSincronizando(false);

    if (enviadosOk > 0) {
      alert(`Sincronización: ${enviadosOk} bitácoras enviadas a la nube.${pendientesFallidos.length > 0 ? ` ${pendientesFallidos.length} quedaron pendientes por error.` : ''}`);
    }
  };

  const criteriosAMostrar = tipoEvaluacion === 'Aula' ? criteriosAula : tipoEvaluacion === 'Maniobras' ? criteriosManiobras : criteriosConduccion;

  const criteriosAgrupados = criteriosAMostrar.reduce((acc, obj) => {
    if (!acc[obj.categoria]) acc[obj.categoria] = [];
    acc[obj.categoria].push(obj);
    return acc;
  }, {});

  const handleChecklistChange = (id, valor) => {
    setRespuestasChecklist(prev => ({ ...prev, [id]: valor }));
  };

  const calcularCalificacionGlobal = () => {
    const total = criteriosAMostrar.length;
    let puntos = 0, contestadas = 0;
    criteriosAMostrar.forEach(c => {
      if (respuestasChecklist[c.id] !== undefined) {
        contestadas++;
        puntos += respuestasChecklist[c.id]; 
      }
    });
    return { 
      total, 
      contestadas, 
      calificacion: total > 0 ? Math.round((puntos / total) * 100) : 0 
    };
  };

  const { total, contestadas, calificacion } = calcularCalificacionGlobal();

  const obtenerProgresoCategoria = (categoria) => {
    const preguntasCat = criteriosAgrupados[categoria];
    let ptos = 0, cont = 0;
    preguntasCat.forEach(p => {
      if (respuestasChecklist[p.id] !== undefined) {
        cont++;
        ptos += respuestasChecklist[p.id];
      }
    });
    const pct = preguntasCat.length > 0 ? Math.round((ptos / preguntasCat.length) * 100) : 0;
    return { pct, completo: cont === preguntasCat.length };
  };

  const generarFeedbackVisual = () => {
    const fortalezas = criteriosAMostrar.filter(c => respuestasChecklist[c.id] === 1);
    const debilidades = criteriosAMostrar.filter(c => respuestasChecklist[c.id] === 0 || respuestasChecklist[c.id] === 0.5);
    return { fortalezas, debilidades };
  };

  const { fortalezas, debilidades } = generarFeedbackVisual();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (contestadas < total) {
      alert(`⚠️ OPERACIÓN DENEGADA:\n\nDe los ${total} criterios de la etapa de ${tipoEvaluacion}, solo has contestado ${contestadas}.\n\nTe faltan evaluar ${total - contestadas} rubros. Revisa la lista por favor.`);
      return;
    }
    if (firmaMentorRef.current.isEmpty() || firmaEvaluadorRef.current.isEmpty()) {
      alert("⚠️ Faltan las firmas de validación para poder sellar la bitácora.");
      return;
    }
    if (!compromisoMejora) {
      alert("⚠️ El plan de acción y mejora continua es obligatorio para el cierre.");
      return;
    }

    const datosEvaluacion = {
      evaluador_email: evaluadorEmail || 'usuario@udat.com',
      mentor_id: mentorId || null,
      tipo_evaluacion: tipoEvaluacion,
      calificacion_final: calificacion, 
      resultados_checklist: JSON.stringify({
        evaluacion_id_qr: evaluacionId, 
        respuestas: respuestasChecklist
      }),
      comentarios_generales: `FORTALEZAS: ${compromisoFortaleza} | PLAN DE MEJORA: ${compromisoMejora}`,
      alerta_retencion: calificacion < 80, 
      percepcion_alumno_clara: 'Pendiente de QR',
      percepcion_alumno_respeto: 'Pendiente de QR',
      percepcion_alumno_seguridad: 'Pendiente de QR',
      firma_mentor_url: firmaMentorRef.current.getCanvas().toDataURL('image/png'),
      firma_evaluador_url: firmaEvaluadorRef.current.getCanvas().toDataURL('image/png'),
      fecha_evaluacion: new Date().toISOString(),
      evaluacion_id_qr: evaluacionId
    };

    const criteriosDetalle = criteriosAMostrar.map((c) => ({
      categoria: c.categoria,
      texto: c.texto,
      riesgo: c.riesgo,
      valor: respuestasChecklist[c.id]
    }));
    
    procesarEvaluacion(datosEvaluacion, criteriosDetalle);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto font-sans pb-20 bg-slate-50 min-h-screen">
      
      <div className={`p-4 text-center text-white font-black uppercase tracking-widest mb-6 rounded-xl shadow-lg transition-colors duration-500 ${isOnline ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' : 'bg-gradient-to-r from-red-600 to-red-500'}`}>
        {isOnline ? '🟢 Telemetría Activa - Nube Conectada' : '🔴 Modo Offline - Guardado Local'}
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider flex items-center border-b pb-4 mb-6">
              <span className="bg-slate-900 text-white rounded-lg w-8 h-8 inline-flex items-center justify-center mr-3">1</span>
              Alineación de Auditoría
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block font-bold text-slate-500 text-xs uppercase tracking-wider mb-2">Mentor Evaluado:</label>
                <select required className="w-full p-4 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={mentorId} onChange={(e) => setMentorId(e.target.value)}>
                  <option value="">-- Seleccione Mentor --</option>
                  {listaMentores.map((m) => (<option key={m.id} value={m.id}>{m.nombre_completo} - ({m.puesto})</option>))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-500 text-xs uppercase tracking-wider mb-2">Módulo Operativo (Separa las evaluaciones):</label>
                <select className="w-full p-4 border border-slate-300 rounded-xl bg-slate-50 font-black text-blue-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={tipoEvaluacion} onChange={(e) => setTipoEvaluacion(e.target.value)}>
                  <option value="Aula">📖 Etapa 1: Evaluación en Aula Teórica (32 Criterios)</option>
                  <option value="Maniobras">🚜 Etapa 2: Prácticas en Maniobras (29 Criterios)</option>
                  <option value="Conduccion">🛣️ Etapa 3: Manejo en Ciudad/Carretera (30 Criterios)</option>
                </select>
              </div>
            </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 border-b pb-4">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider flex items-center mb-4 lg:mb-0">
              <span className="bg-slate-900 text-white rounded-lg w-8 h-8 inline-flex items-center justify-center mr-3">2</span>
              Auditoría Técnica - 100% Estricta
            </h2>
            <div className={`px-6 py-3 rounded-xl font-black text-lg border-2 shadow-inner transition-colors duration-500 ${calificacion >= 90 ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : calificacion >= 75 ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
              Evaluado: {contestadas}/{total} | Score: {calificacion}%
            </div>
          </div>
          
          <div className="space-y-10">
            {Object.keys(criteriosAgrupados).map((categoria, catIndex) => {
              const { pct, completo } = obtenerProgresoCategoria(categoria);
              return (
                <div key={catIndex} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{categoria}</h3>
                    <div className="flex items-center gap-3 w-full sm:w-1/3">
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full transition-all duration-500 ${pct >= 90 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${completo ? pct : 0}%` }}></div>
                      </div>
                      <span className="text-xs font-black text-slate-600 min-w-[40px]">{completo ? `${pct}%` : '---'}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-3">
                    {criteriosAgrupados[categoria].map((criterio, index) => (
                      <div key={criterio.id} className={`flex flex-col xl:flex-row items-start xl:items-center justify-between p-4 rounded-xl transition-all border ${respuestasChecklist[criterio.id] !== undefined ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-blue-100 shadow-sm'}`}>
                        <div className="flex-1 pr-4 mb-4 xl:mb-0 w-full">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-white shadow-sm ${criterio.color === 'red' ? 'bg-red-500' : criterio.color === 'yellow' ? 'bg-amber-500 text-amber-900' : 'bg-emerald-500'}`}>
                              Riesgo {criterio.riesgo}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">ITEM {(index+1)}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800 leading-relaxed">{criterio.texto}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 shrink-0 w-full xl:w-auto justify-start xl:justify-end">
                          <button type="button" onClick={() => handleChecklistChange(criterio.id, 1)} className={`px-5 py-2.5 rounded-lg font-bold text-xs transition-all border ${respuestasChecklist[criterio.id] === 1 ? 'bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'}`}>Sí (100%)</button>
                          <button type="button" onClick={() => handleChecklistChange(criterio.id, 0.5)} className={`px-5 py-2.5 rounded-lg font-bold text-xs transition-all border ${respuestasChecklist[criterio.id] === 0.5 ? 'bg-amber-500 text-white border-amber-500 shadow-md transform scale-105' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'}`}>Medio (50%)</button>
                          <button type="button" onClick={() => handleChecklistChange(criterio.id, 0)} className={`px-5 py-2.5 rounded-lg font-bold text-xs transition-all border ${respuestasChecklist[criterio.id] === 0 ? 'bg-red-600 text-white border-red-600 shadow-md transform scale-105' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'}`}>No (0%)</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {contestadas === total && total > 0 && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-white animate-fade-in-up">
            <h2 className="text-xl font-black uppercase tracking-wider flex items-center border-b border-slate-700 pb-4 mb-6">
              <span className="bg-blue-600 text-white rounded-lg w-8 h-8 inline-flex items-center justify-center mr-3">3</span>
              Diagnóstico y Plan de Acción SMART
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-800 p-5 rounded-xl border border-emerald-900/50">
                <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2"><span className="text-xl">⭐</span> Top Fortalezas Detectadas</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {fortalezas.length > 0 ? fortalezas.slice(0, 3).map(f => <li key={f.id} className="flex gap-2"><span>✅</span> {f.texto}</li>) : <li className="italic text-slate-500">No se detectaron fortalezas plenas.</li>}
                </ul>
              </div>
              
              <div className="bg-slate-800 p-5 rounded-xl border border-red-900/50">
                <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2"><span className="text-xl">⚠️</span> Áreas Críticas a Corregir</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {debilidades.length > 0 ? debilidades.slice(0, 3).map(d => <li key={d.id} className="flex gap-2"><span>🎯</span> {d.texto}</li>) : <li className="text-emerald-400 font-bold">¡Excelente! Cero áreas críticas detectadas.</li>}
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl text-slate-800 shadow-inner">
              <h3 className="font-black text-slate-800 mb-4 uppercase tracking-widest text-sm">Acuerdo de Mejora Continua (Obligatorio)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Reconocimiento del Evaluador (¿Qué hizo bien el mentor?)</label>
                  <textarea rows="2" required placeholder="Escribe aquí el refuerzo positivo que le darás al mentor basándote en las fortalezas..." className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={compromisoFortaleza} onChange={(e) => setCompromisoFortaleza(e.target.value)}></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-red-500 uppercase mb-2">Compromiso Correctivo (¿Qué debe cambiar y cuándo lo revisarán?)</label>
                  <textarea rows="3" required placeholder="Ej: A partir de mañana, el mentor se compromete a no usar el celular en patio. Revisión de cumplimiento en la próxima ruta." className="w-full p-3 border border-red-300 bg-red-50/30 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm" value={compromisoMejora} onChange={(e) => setCompromisoMejora(e.target.value)}></textarea>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider flex items-center border-b pb-4 mb-6">
            <span className="bg-slate-900 text-white rounded-lg w-8 h-8 inline-flex items-center justify-center mr-3">4</span>
            Voz del Alumno (Encuesta QR)
          </h2>
          
          {mentorId ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 bg-blue-50 p-8 rounded-xl border border-blue-100">
              <div className="text-center sm:text-left max-w-sm">
                <h3 className="font-black text-blue-900 text-lg mb-2">Código Sincronizado</h3>
                <p className="text-sm text-blue-800 font-medium leading-relaxed">Pide a tus estudiantes que escaneen este código. Sus respuestas viajarán directamente a la base de datos y se promediarán con la calificación técnica que acabas de realizar.</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200">
                <QRCodeSVG value={`https://osuna-app1.vercel.app/encuesta?eval_id=${evaluacionId}&mentor_id=${mentorId}`} size={160} level={"H"} />
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-slate-400 font-bold bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              Selecciona un mentor en el Paso 1 para habilitar el QR.
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider flex items-center border-b pb-4 mb-6">
              <span className="bg-slate-900 text-white rounded-lg w-8 h-8 inline-flex items-center justify-center mr-3">5</span>
              Sellado y Firmas
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block font-black text-slate-700 text-sm uppercase mb-3 text-center">Firma Evaluador</label>
                    <div className="border-2 border-dashed border-slate-300 bg-white rounded-xl overflow-hidden"><SignatureCanvas ref={firmaEvaluadorRef} canvasProps={{ className: 'w-full h-40' }}/></div>
                    <button type="button" onClick={limpiarFirmaEvaluador} className="w-full text-xs text-red-500 mt-3 font-bold uppercase tracking-wider hover:text-red-700">Limpiar Panel</button>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block font-black text-slate-700 text-sm uppercase mb-3 text-center">Firma Mentor Evaluado</label>
                    <div className="border-2 border-dashed border-slate-300 bg-white rounded-xl overflow-hidden"><SignatureCanvas ref={firmaMentorRef} canvasProps={{ className: 'w-full h-40' }}/></div>
                    <button type="button" onClick={limpiarFirmaMentor} className="w-full text-xs text-red-500 mt-3 font-bold uppercase tracking-wider hover:text-red-700">Limpiar Panel</button>
                </div>
            </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-slate-900 text-white p-6 rounded-2xl text-xl font-black hover:bg-blue-700 transition-all shadow-xl uppercase tracking-widest"
        >
          {enviandoData ? 'Enviando Datos a Supabase...' : `Sellar Evaluación de ${tipoEvaluacion}`}
        </button>
      </form>
    </div>
  );
}
