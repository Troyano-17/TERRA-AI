/** Dependency-free local demo server. Does not use any real external API. */
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {REGIONS,INTEGRATIONS,MODEL_CATALOG,makeDashboard,makeSeries,makeHotspots,makeAlerts,assistantReply,getRegion} from './src/data/fixtures.js';
const root=resolve(fileURLToPath(new URL('.',import.meta.url)));
const port=Number(process.env.PORT||4173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.md':'text/plain; charset=utf-8'};
const json=(res,obj,status=200)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify(obj));};
async function body(req){let chunks='';for await(const chunk of req){chunks+=chunk;if(chunks.length>15000)throw new Error('Body demasiado grande');}return JSON.parse(chunks||'{}');}
export function handler(req,res){return (async()=>{
 try{
  const url=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`),path=url.pathname;
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'});return res.end();}
  if(path.startsWith('/api/v1/')){
   let data,status=200;
   if(path==='/api/v1/health')data={status:'demo',provider:'mock-http',modelServing:false,database:false,scienceApi:false};
   else if(path==='/api/v1/regions')data=REGIONS;
   else if(path==='/api/v1/dashboard')data=makeDashboard(url.searchParams.get('region')||'huanuco',url.searchParams.get('period')||'7d');
   else if(path==='/api/v1/series')data=makeSeries(url.searchParams.get('region')||'huanuco',url.searchParams.get('period')||'7d');
   else if(path==='/api/v1/hotspots')data=makeHotspots(url.searchParams.get('region')||'huanuco',url.searchParams.get('period')||'7d');
   else if(path==='/api/v1/alerts')data=makeAlerts();
   else if(path==='/api/v1/models')data=MODEL_CATALOG;
   else if(path==='/api/v1/integrations')data=INTEGRATIONS;
   else if(path==='/api/v1/assistant'&&req.method==='POST'){const b=await body(req);data=assistantReply(b.message||'',b.regionId||'huanuco');}
   else if(path==='/api/v1/inference'&&req.method==='POST'){const b=await body(req),r=getRegion(b.regionId||'huanuco');data={modelId:b.modelId,regionId:r.id,score:b.modelId==='fire'?r.fireRisk:b.modelId==='agro'?r.soil:b.modelId==='earth'?Math.round(r.change*2):Math.round(r.anomaly*21),confidence:83,simulated:true,explanation:'Inferencia ficticia generada por endpoint local de demostración.'};}
   else {data={error:'Endpoint aún no implementado',path};status=404;}
   return json(res,data,status);
  }
  const rel=decodeURIComponent(path==='/'?'/index.html':path);
  const filename=resolve(root,'.'+rel);
  if(!(filename===root||filename.startsWith(root+sep))){res.writeHead(403);return res.end('Forbidden');}
  const st=await stat(filename).catch(()=>null);
  if(!st||!st.isFile()){res.writeHead(404);return res.end('Not found');}
  const ext=extname(filename);res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':ext==='.html'?'no-store':'public, max-age=600','X-Content-Type-Options':'nosniff'});
  res.end(await readFile(filename));
 }catch(error){json(res,{error:error.message},500);}
 })();}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const server=createServer(handler);server.listen(port,'0.0.0.0',()=>console.log(`\nTERRA AI DEMO activa: http://localhost:${port}\nDATOS 100% SIMULADOS · Ctrl+C para detener\n`));
}
