# TERRA AI — Earth Intelligence Platform

**Demostración funcional y ejecutable de una plataforma de inteligencia ambiental multimodelo.**

> [!IMPORTANT]
> **EL SISTEMA INCLUYE DATOS Y RESULTADOS 100 % SIMULADOS.** Los mapas usan fronteras reales simplificadas (Natural Earth, dominio público), pero las temperaturas, precipitaciones, focos térmicos, alertas, índices agrícolas, cambios del terreno y respuestas de IA son ficticios. NO sirve para pronosticar desastres, planificar cultivos, emitir alertas ni tomar decisiones reales.

## Ejecutar la demo ahora

**Windows:** descomprime el ZIP y haz doble clic en `INICIAR_DEMO.bat`. Requiere Node.js 18+ (recomendado). Si solo tienes Python 3 también funciona como sitio estático (el modo mock integrado sigue activo).

**macOS / Linux:** abre una terminal dentro de la carpeta y ejecuta `./INICIAR_DEMO.sh`.

**Cualquier SO con Node.js 18+:**

```bash
npm start
```

Abre **http://localhost:4173**. Para detener el servidor pulsa `Ctrl+C`.

No necesitas instalar dependencias, crear una cuenta, obtener tokens, descargar mapas ni ejecutar `npm install`.

## Funciones que sí funcionan

- 11 pantallas navegables y diseño responsive.
- Mapa mundial propio, basado en límites públicos de países; zoom, pan, selección de 12 regiones, filtros de capas y puntos de calor **ficticios**.
- Series y gráficos de temperatura, lluvia, incendios y vegetación según región y periodo (24h/7d/30d/1 año).
- Centro de incidentes y detalles de alertas simuladas.
- Monitor de registros de focos térmicos simulados con filtrado, coordenadas y ventana de detalles.
- Simulador agrícola interactivo: cultivo, aumento/disminución de temperatura y precipitación.
- Comparador visual de cambio de superficie (imágenes **procedurales**, no SAR reales).
- Centro de cuatro modelos conceptuales, simulación de inferencia y asistente con respuestas explicativas de demostración.
- Exportación real de CSV, JSON y reportes HTML imprimibles.
- Búsqueda de regiones y secciones mediante `Ctrl+K`.
- Adaptadores `MockProvider` y `APIProvider` con la **misma interfaz de métodos**.
- API HTTP local funcional con `/api/v1/*` que entrega las mismas respuestas ficticias del adaptador en memoria.
- Pruebas automatizadas con `npm test` (sin dependencias).

## Qué NO está implementado

- No se han conectado NASA, Copernicus, SENAMHI ni Open-Meteo.
- No existen datos observacionales en la demo ni credenciales vinculadas.
- No hay una base de datos Supabase, MongoDB ni almacenamiento de objetos real.
- No hay modelos entrenados; los resultados de ML y métricas de la interfaz son **ficticios**.
- La vista de cambios no procesa SAR; es una prueba de interfaz.
- No hay un sistema verificado de riesgos, alertas operativas ni predicción meteorológica.
- No se ha desplegado esta carpeta en Render automáticamente.

## Estructura

```text
TERRA_AI_DEMO/
├── INICIAR_DEMO.bat          # Arranque Windows
├── INICIAR_DEMO.sh           # Arranque Mac / Linux
├── index.html                # SPA de frontend
├── config.js                 # Selección de adaptador sin secretos
├── server.mjs                # Servidor estático + mock API REST (Node nativo)
├── package.json              # npm start / npm test (sin dependencias)
├── src/
│   ├── app.js                # 11 módulos y acciones
│   ├── styles.css            # Design System responsive
│   ├── data/
│   │   ├── fixtures.js       # Datos sintéticos deterministas
│   │   └── world.js          # Natural Earth simplificado
│   ├── lib/
│   │   ├── map.js            # Motor geoespacial Canvas 2D (sin teselas)
│   │   ├── charts.js         # Gráficos SVG propios
│   │   └── icons.js          # Iconos SVG embebidos
│   └── services/
│       ├── provider.js       # Selección del adaptador
│       ├── mock-provider.js  # Datos de demo
│       └── api-provider.js   # Puerto hacia backend real
├── tests/                    # Pruebas Node.js
├── CONEXIONES.md             # Endpoints, contratos y ejemplos
└── DESPLIEGUE_RENDER.md      # Publicación gratuita en Render
```

## Cambiar a API real

Edita `config.js`:

```js
window.TERRA_CONFIG = {
  provider: 'api',
  apiBaseUrl: '/api/v1',
  simulationLabel: false,
  refreshSeconds: 45,
  locale: 'es-PE'
};
```

**Advertencia:** el servidor incluido en esta demo sigue entregando datos ficticios, incluso cuando cambies el provider a `api`. Para conectarte a datos verdaderos debes implementar o sustituir los endpoints HTTP indicados en `CONEXIONES.md`. Mantén `simulationLabel: true` mientras el backend no use registros verificados. La etiqueta global actual es explícita y fija; al pasar a producción tendrás que diseñar su estado en función de la procedencia y calidad de las fuentes.

**Para conectar bases de datos, NASA o modelos Colab, implementa el backend** y usa secretos en su entorno de servidor. No pongas contraseñas, claves privadas ni credenciales de servicio en `config.js`.

## Ciencia y trazabilidad

Los algoritmos propuestos (LightGBM/XGBoost, Isolation Forest, U-Net) no están incluidos como artefactos entrenados. Cuando se introduzcan observaciones reales se deberán implementar pipelines reproducibles, calidad y procedencia de datos, validación temporal y geográfica y estimaciones de incertidumbre. Ver `CONEXIONES.md`.

## Licencias y recursos

El código original de la demo puede reutilizarse dentro del proyecto TERRA AI. El fichero `src/data/world.js` contiene fronteras simplificadas derivadas del dataset Natural Earth (dominio público). No se descargan tiles, fuentes, iconos ni bibliotecas de CDNs para ejecutar: la declaración CSS de fuentes web es opcional y cuenta con fuentes locales de respaldo.

**Proyecto conceptual TERRA AI · SANTRIX · NASA Space Apps 2026 (no afiliado a NASA).**
