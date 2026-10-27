import test from 'node:test';
import assert from 'node:assert/strict';
import {REGIONS,INTEGRATIONS,MODEL_CATALOG,makeDashboard,makeSeries,makeHotspots,makeAlerts,assistantReply} from '../src/data/fixtures.js';
import {MockProvider} from '../src/services/mock-provider.js';

test('todas las regiones tienen coordenadas válidas',()=>{
 assert.equal(REGIONS.length,12);
 for(const r of REGIONS){assert.ok(r.lat>=-90&&r.lat<=90);assert.ok(r.lon>=-180&&r.lon<=180);}
});
test('las series temporales son coherentes con sus etiquetas en todos los periodos',()=>{
 for(const region of REGIONS.slice(0,4))for(const period of ['24h','7d','30d','1y']){
  const s=makeSeries(region.id,period);for(const k of ['temp','rain','fire','vegetation','risk'])assert.equal(s[k].length,s.labels.length);
  assert.ok(s.rain.every(v=>v>=0));
 }
});
test('datos generados son reproducibles por parámetros',()=>{
 assert.deepEqual(makeSeries('huanuco','7d'),makeSeries('huanuco','7d'));
 assert.deepEqual(makeHotspots('global','24h'),makeHotspots('global','24h'));
});
test('los hotspots tienen coordenadas, proveedor simulado y etiqueta obligatoria',()=>{
 const p=makeHotspots('huanuco','7d');assert.equal(p.length,85);
 assert.ok(p.every(x=>x.simulated&&x.frp>=0&&['MODIS','VIIRS'].includes(x.source)));
});
test('adapter mock cumple el contrato y no necesita credenciales',async()=>{
 const p=new MockProvider();
 const [regions,overview,series,hotspots,alerts,integrations,models,reply,inference,health]=await Promise.all([
  p.getRegions(),p.getDashboard('huanuco','7d'),p.getSeries('huanuco','7d'),p.getHotspots('huanuco','7d'),p.getAlerts(),p.getIntegrations(),p.getModels(),p.askAssistant('incendios','huanuco'),p.runInference('fire','huanuco'),p.health()]);
 assert.ok(regions.length>=10);assert.equal(overview.simulated,true);assert.ok(series.labels.length);
 assert.ok(hotspots.length);assert.ok(alerts.length);assert.equal(integrations.length,INTEGRATIONS.length);
 assert.equal(models.length,MODEL_CATALOG.length);assert.match(reply.text,/simulad|demostraci[oó]n/i);assert.equal(inference.simulated,true);assert.equal(health.database,false);
});
