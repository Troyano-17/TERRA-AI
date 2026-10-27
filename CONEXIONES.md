# TERRA AI — Contratos para conectar datos y modelos reales

Esta demo aplica una arquitectura **Ports & Adapters** a nivel de proveedor de datos del frontend. No hay acoplamiento de las pantallas con NASA, bases de datos ni frameworks de ML.

## Puertos listos

`src/services/mock-provider.js` y `src/services/api-provider.js` exponen las mismas llamadas asíncronas:

| Método | Ruta HTTP recomendada | Uso |
|---|---|---|
| getRegions() | GET `/api/v1/regions` | Regiones y coordenadas |
| getDashboard(regionId, period) | GET `/api/v1/dashboard?region=huanuco&period=7d` | Metadatos, región y métricas |
| getSeries(regionId, period) | GET `/api/v1/series?region=huanuco&period=7d` | Series temporales |
| getHotspots(regionId, period) | GET `/api/v1/hotspots?region=huanuco&period=7d` | Registros armonizados |
| getAlerts() | GET `/api/v1/alerts` | Notificaciones internas del servicio |
| getIntegrations() | GET `/api/v1/integrations` | Catálogo de conexiones |
| getModels() | GET `/api/v1/models` | Inventario y estado de modelos |
| askAssistant(message,regionId) | POST `/api/v1/assistant` | Razonamiento con herramientas científicas |
| runInference(modelId,regionId) | POST `/api/v1/inference` | Inferencia por servicio de modelos |
| health() | GET `/api/v1/health` | Salud y conexiones |

En este ZIP, todas esas rutas tienen respuestas **ficticias** generadas por `server.mjs`. Puedes inspeccionarlas mediante:

```bash
curl http://localhost:4173/api/v1/health
curl 'http://localhost:4173/api/v1/dashboard?region=huanuco&period=7d'
curl 'http://localhost:4173/api/v1/series?region=huanuco&period=30d'
curl 'http://localhost:4173/api/v1/hotspots?region=huanuco&period=7d'
curl -X POST http://localhost:4173/api/v1/inference -H 'Content-Type: application/json' -d '{"modelId":"fire","regionId":"huanuco"}'
```

## Contrato de dashboard

```json
{
  "region": { "id":"huanuco", "name":"Huánuco", "country":"Perú", "lat":-9.93, "lon":-76.24 },
  "period":"7d",
  "metrics": { "temp":24.6, "hotspots":38, "precip":76, "anomaly":1.8, "soil":43, "change":12.8, "fireRisk":72, "trend":16 },
  "updatedAt":"2026-10-22T20:00:00.000Z",
  "simulated":true,
  "narrative":"Explicación del contexto.",
  "recommendations":["...","..."]
}
```

**El JSON anterior es exclusivamente un ejemplo de interfaz.** Para datos reales deberás añadir como mínimo `observedAt`, `availableAt`, `source`, `productVersion`, `spatialResolution`, `temporalResolution`, `qualityFlags`, `units`, `confidence`/`uncertainty` y, para predicciones, su horizonte y método de validación. No usar `updatedAt` como sustituto de tiempo de observación.

## Conector 1: NASA FIRMS, MODIS y VIIRS

- Fuente oficial: https://firms.modaps.eosdis.nasa.gov/
- Backend: capturar y normalizar eventos, registrar fuente, hora en UTC, coordenadas, confianza, FRP y algoritmo/sensor.
- Armonizar por resolución, cobertura y observación; **no equiparar números brutos de diferentes sensores**.
- Guardar metadatos/hotspots como entidades geoespaciales de PostGIS.

## Conector 2: NASA GPM / POWER

- GPM IMERG: https://gpm.nasa.gov/data/imerg
- POWER: https://power.larc.nasa.gov/
- Normalizar zonas horarias, calendarios, unidades, proyección, área de agregación, control de faltantes y climatologías de referencia.
- No confundir precipitación acumulada observacional con pronóstico meteorológico.

## Conector 3: NASA NISAR

- https://science.nasa.gov/mission/nisar/data/
- Seleccionar adquisiciones compatibles, descargar escenas y metadatos a almacenamiento de objetos.
- Preprocesamiento SAR en Python; geometría de adquisición, máscaras y calidad de la comparación.
- EarthVision usará escenas reales y sus productos derivados, nunca la textura CSS de demo.

## Conector 4: Supabase (PostGIS)

Esquema inicial recomendado:

```sql
create extension if not exists postgis;
create table regions (
  id text primary key,
  name text not null,
  country text not null,
  centroid geography(Point,4326)
);
create table observations (
  id uuid primary key default gen_random_uuid(),
  region_id text references regions(id),
  source text not null,
  product text not null,
  variable text not null,
  measured_at timestamptz not null,
  available_at timestamptz,
  value double precision,
  units text,
  position geography(Point,4326),
  quality jsonb not null default '{}'::jsonb,
  provenance jsonb not null default '{}'::jsonb
);
create index observations_geo_idx on observations using gist(position);
create index observations_time_idx on observations(measured_at desc);
```

**Seguridad:** aplica RLS en tablas expuestas por Supabase; idealmente accede desde la API backend con roles limitados. Nunca publiques `service_role`.

## Conector 5: Cloudflare R2

Almacenar datasets grandes, GeoTIFF, COG, Parquet y artefactos de modelos. Servir productos de lectura con URLs firmadas o permisos de solo lectura. Usar CDN/cache; evitar guardar imágenes completas en filas SQL.

## Conector 6: Modelos entrenados en Colab

Los modelos se entrenan y validan fuera de Render. Exportar artefactos versionados y registrar hash, dataset, evaluación, parámetros y fecha.

Servicio candidato FastAPI:

```python
from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()

class InferenceRequest(BaseModel):
    modelId: str
    regionId: str

@app.post('/api/v1/inference')
def infer(payload: InferenceRequest):
    # TODO: cargar artefacto versionado, variables observadas y metadatos
    # TODO: devolver score calibrado con incertidumbre y fuentes
    return {"error": "El modelo real todavía no está conectado"}
```

No declarar un modelo como validado sin métricas sobre particiones temporales/geográficas independientes. El sistema debe indicar claramente qué es observado, pronosticado, calculado y simulado.

## Sustitución progresiva del backend

1. Levantar el proyecto incluido, probar `/api/v1/health`.
2. Conectar tu base Supabase en el servidor real y añadir variables de entorno.
3. Implementar ingestión NASA en workers programados y persistir resultados trazables.
4. Implementar `dashboard`, `series` y `hotspots` con datos reales manteniendo formas JSON compatibles.
5. Construir y validar modelos en Colab; crear servicio de inferencia.
6. Cambiar `provider: 'mock'` por `provider: 'api'` en `config.js`, apuntando al backend real.
7. Cambiar textos e indicadores de la interfaz: NO eliminar la etiqueta de simulación hasta que todos los elementos visibles relevantes estén respaldados por datos reales.
8. Verificar tiempos de observación y pruebas E2E antes de la publicación oficial.
