import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import EncuestaAlumno from './EncuestaAlumno';
// Esta función activa la caché offline y actualiza la app si hay una nueva versión
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nueva actualización disponible. ¿Deseas recargar?')) {
      updateSW(true)
    }
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)