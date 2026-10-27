import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {handler} from '../server.mjs';

test('el servidor entrega interfaz estática y endpoints JSON de demo',async()=>{
 const server=createServer(handler);
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const root=`http://127.0.0.1:${server.address().port}`;
 try{
  const html=await fetch(root+'/');assert.equal(html.status,200);assert.match(await html.text(),/TERRA AI/);
  const health=await(await fetch(root+'/api/v1/health')).json();assert.equal(health.scienceApi,false);
  const r=await(await fetch(root+'/api/v1/regions')).json();assert.ok(r.length>6);
  const out=await(await fetch(root+'/api/v1/dashboard?region=cusco&period=30d')).json();assert.equal(out.region.id,'cusco');assert.equal(out.simulated,true);
  const series=await(await fetch(root+'/api/v1/series?region=huanuco&period=24h')).json();assert.equal(series.labels.length,24);
  const reply=await fetch(root+'/api/v1/assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'cultivos',regionId:'huanuco'})});assert.equal(reply.status,200);assert.match((await reply.json()).text,/humedad/i);
  const ml=await(await fetch(root+'/api/v1/inference',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({modelId:'fire',regionId:'huanuco'})})).json();assert.equal(ml.simulated,true);
  const missing=await fetch(root+'/api/v1/not-found');assert.equal(missing.status,404);
 }finally{await new Promise(ok=>server.close(ok));}
});
