import React from 'react';
import GestorEvaluaciones from './GestorEvaluaciones';
import EncuestaAlumno from './EncuestaAlumno';

export default function App() {
  // Escáner de ruta: Detecta si alguien entró a la encuesta por el Código QR
  const path = window.location.pathname;

  if (path === '/encuesta') {
    return <EncuestaAlumno />;
  }

  // Si no es la encuesta, carga el panel principal de evaluación
  return <GestorEvaluaciones evaluadorEmail="admin@udat.com" />;
}