# Publicar TERRA AI Demo en Render

Render puede ejecutar este repositorio como **Web Service con Node.js**, sin instalar dependencias.

## Procedimiento

1. Crea un repositorio privado o público en GitHub con los archivos de `TERRA_AI_DEMO/`.
2. En Render, crea **New > Web Service** desde el repositorio.
3. Selecciona **Runtime: Node**.
4. **Build Command:** `echo "Sin dependencias; demo lista"`
5. **Start Command:** `npm start`
6. **Port:** lo asigna Render automáticamente mediante `PORT`; `server.mjs` lo utiliza.
7. Elige el plan disponible y despliega. El servidor escucha en `0.0.0.0` y entrega frontend y endpoints falsos bajo el mismo dominio.
8. Abre la URL pública y comprueba las secciones, exportaciones y endpoints.

**No se ha desplegado esta demo desde esta conversación; las instrucciones son para que el equipo lo haga desde su cuenta.**

## Limitaciones y recomendaciones

- Los servicios web gratuitos de Render pueden entrar en suspensión por inactividad, por lo que el primer acceso puede tardar en responder.
- No ejecutes entrenamiento pesado en el web service. Usa Google Colab para experimentación; inferencia ligera o tareas precalculadas en el backend.
- No almacenes bases de datos, pesos ni datasets importantes en el disco efímero del servicio.
- Para imágenes GeoTIFF y Parquet, usa almacenamiento de objetos como Cloudflare R2.
- Para consultas geoespaciales, considera Supabase Postgres/PostGIS. El plan gratuito tiene límites de almacenamiento: no lo uses como almacén de raster masivos.
- La demo necesita únicamente Node 18+, funciona en modo mock sin credenciales y no requiere build de frontend.
- Para activación real, utiliza el puerto `APIProvider` y sustituye endpoints con lógica científica verificable.

## Pruebas de humo antes de presentar al jurado

```bash
npm test
curl http://localhost:4173/api/v1/health
```

En Render, visita `/api/v1/health` y espera una respuesta JSON. La respuesta `status: "demo"` significa que los servicios son simulados, aunque el deployment funcione.
