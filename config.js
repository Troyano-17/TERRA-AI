/* PUNTO DE CONEXIÓN 1/4 — cambia `provider` a 'api' cuando implementes tu API real.
   Se sirve sin secretos; nunca agregues claves privadas aquí. */
window.TERRA_CONFIG = {
  provider: 'mock',                 // 'mock' | 'api'
  apiBaseUrl: '/api/v1',            // Ruta del backend real cuando esté listo
  simulationLabel: true,           // Mantener true mientras haya datos ficticios
  refreshSeconds: 45,              // Actualización visible del simulador
  locale: 'es-PE'
};
