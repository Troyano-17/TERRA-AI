/**
 * DATOS TOTALMENTE FICTICIOS. NO SON MEDICIONES NI PRONOSTICOS REALES.
 * Reemplazar adaptadores en src/services para conectar sistemas productivos.
 */
export const REGIONS = [
 { id:'huanuco',name:'Huánuco',country:'Perú',lat:-9.93,lon:-76.24,temp:24.6,rain:76,hotspots:38,soil:43,change:12.8,anomaly:1.8,fireRisk:72,trend:16,icon:'mountain' },
 { id:'ucayali',name:'Ucayali',country:'Perú',lat:-8.38,lon:-74.54,temp:28.1,rain:122,hotspots:67,soil:61,change:19.3,anomaly:1.2,fireRisk:81,trend:21,icon:'trees' },
 { id:'lima',name:'Lima',country:'Perú',lat:-12.05,lon:-77.04,temp:20.2,rain:7,hotspots:6,soil:25,change:7.4,anomaly:.9,fireRisk:34,trend:10,icon:'building' },
 { id:'cusco',name:'Cusco',country:'Perú',lat:-13.52,lon:-71.97,temp:17.4,rain:92,hotspots:23,soil:48,change:9.3,anomaly:1.5,fireRisk:57,trend:14,icon:'mountain' },
 { id:'piura',name:'Piura',country:'Perú',lat:-5.20,lon:-80.63,temp:30.1,rain:19,hotspots:17,soil:28,change:5.9,anomaly:2.1,fireRisk:69,trend:19,icon:'sun' },
 { id:'arequipa',name:'Arequipa',country:'Perú',lat:-16.40,lon:-71.54,temp:19.3,rain:14,hotspots:13,soil:21,change:4.8,anomaly:1.1,fireRisk:51,trend:11,icon:'mountain' },
 { id:'amazonas',name:'Amazonas',country:'Perú',lat:-5.90,lon:-78.53,temp:25.3,rain:144,hotspots:48,soil:66,change:15.8,anomaly:1.4,fireRisk:75,trend:18,icon:'trees' },
 { id:'saopaulo',name:'São Paulo',country:'Brasil',lat:-23.55,lon:-46.63,temp:26.4,rain:105,hotspots:96,soil:54,change:24.1,anomaly:1.7,fireRisk:79,trend:15,icon:'trees' },
 { id:'california',name:'California',country:'Estados Unidos',lat:36.78,lon:-119.42,temp:29.8,rain:34,hotspots:72,soil:29,change:20.7,anomaly:2.0,fireRisk:88,trend:24,icon:'flame' },
 { id:'jakarta',name:'Java Occidental',country:'Indonesia',lat:-6.20,lon:106.82,temp:30.4,rain:178,hotspots:53,soil:72,change:11.7,anomaly:1.3,fireRisk:63,trend:8,icon:'cloud' },
 { id:'nairobi',name:'Nairobi',country:'Kenia',lat:-1.29,lon:36.82,temp:25.1,rain:62,hotspots:24,soil:39,change:8.1,anomaly:1.9,fireRisk:64,trend:13,icon:'sun' },
 { id:'madrid',name:'Madrid',country:'España',lat:40.42,lon:-3.70,temp:27.6,rain:48,hotspots:21,soil:35,change:5.7,anomaly:1.6,fireRisk:68,trend:12,icon:'sun' }
];
export const LAYERS = [
 {id:'fire',name:'Incendios',color:'#ff9368',kind:'Observación térmica'},
 {id:'rain',name:'Precipitaciones',color:'#6eaafa',kind:'Estimación pluviométrica'},
 {id:'temperature',name:'Temperatura',color:'#f5cc75',kind:'Anomalía térmica'},
 {id:'vegetation',name:'Vegetación',color:'#5ddbb1',kind:'Índice de superficie'}
];
export const INTEGRATIONS = [
 {id:'firms',name:'NASA FIRMS',role:'Detección de focos térmicos',frequency:'Hasta ~3 h',route:'/connectors/nasa/firms',category:'Satélite',url:'https://firms.modaps.eosdis.nasa.gov/'},
 {id:'gpm',name:'NASA GPM IMERG',role:'Estimaciones de precipitación',frequency:'Desde ~4 h',route:'/connectors/nasa/gpm',category:'Satélite',url:'https://gpm.nasa.gov/data/imerg'},
 {id:'power',name:'NASA POWER',role:'Variables climáticas y agroclimáticas',frequency:'Diaria / multidiaria',route:'/connectors/nasa/power',category:'Clima',url:'https://power.larc.nasa.gov/'},
 {id:'nisar',name:'NASA NISAR',role:'Imágenes radar y cambios territoriales',frequency:'Según escena disponible',route:'/connectors/nasa/nisar',category:'Radar',url:'https://science.nasa.gov/mission/nisar/'},
 {id:'supabase',name:'Supabase / PostGIS',role:'Persistencia de entidades geoespaciales',frequency:'Bajo demanda',route:'/repositories/postgis',category:'Base de datos',url:'https://supabase.com/'},
 {id:'r2',name:'Cloudflare R2',role:'Raster, datasets y modelos serializados',frequency:'Bajo demanda',route:'/storage/objects',category:'Storage',url:'https://developers.cloudflare.com/r2/'},
 {id:'model',name:'Model Serving',role:'Inferencia de modelos entrenados en Colab',frequency:'Bajo demanda',route:'/inference/run',category:'Modelos ML',url:'https://colab.research.google.com/'},
 {id:'meteo',name:'Open-Meteo',role:'Pronósticos y series horarias complementarias',frequency:'Variable',route:'/connectors/open-meteo',category:'Clima',url:'https://open-meteo.com/'}
];
export const MODEL_CATALOG = [
 {id:'climate',name:'ClimateNet',description:'Anomalías climáticas y patrones estacionales',method:'XGBoost / Isolation Forest',version:'Prototipo conceptual',confidence:91.2,accuracy:'MAE 0.41',icon:'cloud-sun',color:'#83c3ff'},
 {id:'fire',name:'FireRisk AI',description:'Condiciones asociadas a actividad térmica',method:'LightGBM / XGBoost',version:'Prototipo conceptual',confidence:87.4,accuracy:'PR-AUC 0.84',icon:'flame',color:'#ff9b72'},
 {id:'agro',name:'AgroClimate AI',description:'Estrés agroclimático y calendarios',method:'Random Forest',version:'Prototipo conceptual',confidence:83.1,accuracy:'F1 0.81',icon:'sprout',color:'#6cddab'},
 {id:'earth',name:'EarthVision AI',description:'Cambios de cobertura de superficie',method:'U-Net / PyTorch',version:'Prototipo conceptual',confidence:89.3,accuracy:'IoU 0.76',icon:'satellite',color:'#c9b2ff'}
];
function seed(n){ return function(){ n = (n * 1664525 + 1013904223) >>> 0; return n / 4294967296; }; }
export function getRegion(id){ return REGIONS.find(r=>r.id===id) || REGIONS[0]; }
export function makeSeries(regionId='huanuco',period='7d'){
 const r=getRegion(regionId), num=period==='24h'?24:period==='7d'?14:period==='30d'?30:24;
 const random=seed(regionId.split('').reduce((a,c)=>a+c.charCodeAt(0),0)+num);
 const labels=[],temp=[],rain=[],fire=[],vegetation=[],risk=[];
 for(let i=0;i<num;i++){
   const theta=i/(num-1)*Math.PI*2,noise=(random()-.5)*3.8;
   const t=r.temp+2.5*Math.sin(theta*1.3-.5)+noise/2;
   const precipitation=Math.max(0,r.rain/5+8*Math.cos(theta*1.1+.5)+(random()-.5)*16);
   const fires=Math.max(0,Math.round(r.hotspots/4+Math.sin(theta*1.5)*r.hotspots/7+(random()-.5)*8));
   labels.push(period==='24h'?`${String(i).padStart(2,'0')}:00`:period==='7d'?`D${i+1}`:period==='30d'?`${i+1} oct`:`M${i+1}`);
   temp.push(Number(t.toFixed(1)));
   rain.push(Number(precipitation.toFixed(1)));
   fire.push(fires);
   vegetation.push(Math.max(20,Math.min(95,Math.round(r.soil+15*Math.sin(theta*1.1)+(random()-.5)*13))));
   risk.push(Math.max(0,Math.min(100,Math.round(r.fireRisk+13*Math.sin(theta+.6)+(random()-.5)*10))));
 }
 return {labels,temp,rain,fire,vegetation,risk,period,regionId,unit:'simulado'};
}
export function makeHotspots(regionId='huanuco',period='7d'){
 const rnd=seed(90423+(regionId.length*733)+(period==='24h'?1:period==='30d'?9:3));
 const hubs = regionId === 'global' ? REGIONS : [getRegion(regionId),...REGIONS.filter(x=>x.id!==regionId).slice(0,4)];
 const count=regionId==='global'?180:85;
 return Array.from({length:count},(_,i)=>{
   const h=hubs[i%hubs.length];
   const lat=h.lat+(rnd()-.5)*(i%hubs.length===0?6:10),lon=h.lon+(rnd()-.5)*(i%hubs.length===0?8:12);
   const frp=Math.round(8+rnd()*145),confidence=55+Math.round(rnd()*44);
   return {id:`HS-${String(i+1).padStart(4,'0')}`,lat:Number(lat.toFixed(3)),lon:Number(lon.toFixed(3)),region:h.id,location:`${h.name}, ${h.country}`,frp,confidence,level:frp>100?'Alto':frp>52?'Moderado':'Bajo',ageHours:Math.round(rnd()*(period==='24h'?24:period==='7d'?168:720)),source:i%3===0?'MODIS':'VIIRS',time:`Hace ${Math.round(1+rnd()*8)} h`,simulated:true};
 });
}
export function makeAlerts(){return [
 {id:'AL-1024',regionId:'ucayali',area:'Ucayali, Perú',title:'Alta concentración de focos térmicos',text:'Actividad superior al patrón de referencia simulado.',level:'critical',type:'Incendios',hours:1.1,icon:'flame'},
 {id:'AL-1023',regionId:'huanuco',area:'Huánuco, Perú',title:'Anomalía positiva de temperatura',text:'Temperatura sobre la media sintética del periodo.',level:'warning',type:'Clima',hours:2.3,icon:'thermometer'},
 {id:'AL-1022',regionId:'piura',area:'Piura, Perú',title:'Déficit de lluvias en seguimiento',text:'Precipitación acumulada inferior al escenario base.',level:'warning',type:'Precipitaciones',hours:4.7,icon:'cloud-sun'},
 {id:'AL-1021',regionId:'california',area:'California, EE. UU.',title:'Condiciones de sequedad elevadas',text:'Simulación de un índice combinado de vulnerabilidad.',level:'critical',type:'Incendios',hours:6.5,icon:'flame'},
 {id:'AL-1020',regionId:'cusco',area:'Cusco, Perú',title:'Variación estacional de vegetación',text:'Cambio observado en la serie de referencia ficticia.',level:'info',type:'Superficie',hours:9.2,icon:'leaf'},
 {id:'AL-1019',regionId:'amazonas',area:'Amazonas, Perú',title:'Aumento de actividad térmica',text:'Revisar el análisis temporal antes de interpretar.',level:'warning',type:'Incendios',hours:12.2,icon:'flame'},
 {id:'AL-1018',regionId:'madrid',area:'Madrid, España',title:'Análisis histórico disponible',text:'Comparativo mensual listo en la simulación.',level:'info',type:'Análisis',hours:24.5,icon:'chart-line'}
]}
export function makeDashboard(regionId='huanuco',period='7d'){
 const r=getRegion(regionId),m=period==='24h'?.84:period==='30d'?1.12:period==='1y'?1.25:1;
 const hotspotCount=Math.round(r.hotspots*m);
 return {region:r,period,metrics:{temp:r.temp,hotspots:hotspotCount,precip:r.rain,anomaly:r.anomaly,soil:r.soil,change:r.change,fireRisk:r.fireRisk,trend:r.trend},
  updatedAt:new Date().toISOString(),simulated:true,
  narrative:`En el escenario demostrativo de ${r.name}, se observa una anomalía térmica de +${r.anomaly.toFixed(1)} °C y ${hotspotCount} detecciones térmicas simuladas. La combinación de variables amerita contrastar los datos con series validadas antes de tomar decisiones.`,
  recommendations:[`Revisar el historial multianual de ${r.name}.`,`Contrastar los focos térmicos con imágenes y reportes oficiales.`,`Evaluar anomalías y estacionalidad antes de emitir alertas.`]};
}
export function assistantReply(message,regionId='huanuco'){
 const msg=message.toLowerCase(),r=getRegion(regionId);
 if(/incend|fuego|riesgo/.test(msg)) return {text:`En el escenario de demostración de **${r.name}**, el índice ilustrativo de condiciones asociadas a incendios es **${r.fireRisk}/100**. Los factores representados incluyen temperatura, lluvia y actividad térmica ficticia. **No es una predicción ni una alerta real**. Para una evaluación operacional se deben conectar NASA FIRMS y variables meteorológicas verificadas.`,sources:['Adaptador propuesto: NASA FIRMS','Modelo conceptual: FireRisk AI'],kind:'fire'};
 if(/siembr|cultiv|agric|suelo|riego/.test(msg)) return {text:`Para **${r.name}** la humedad de suelo ilustrativa es **${r.soil}%** y la precipitación acumulada del escenario es **${r.rain} mm**. Una recomendación agrícola válida necesita identificar cultivo, etapa fenológica, suelo y disponibilidad de riego. TERRA puede reunir esas variables cuando conectemos las fuentes reales.`,sources:['Módulo conceptual: AgroClimate AI','Fuente prevista: NASA POWER'],kind:'agro'};
 if(/lluv|clima|temper|niño|calor|anomal/.test(msg)) return {text:`La vista simulada de **${r.name}** muestra **${r.temp.toFixed(1)} °C** y una anomalía de **+${r.anomaly.toFixed(1)} °C**. Estos valores son ficticios y están diseñados para ilustrar análisis de series temporales. El modelo ClimateNet deberá comparar valores observados con una climatología de referencia.`,sources:['Fuente prevista: NASA GPM IMERG','Modelo conceptual: ClimateNet'],kind:'climate'};
 if(/sar|sat[eé]lite|su[p]?erficie|cambio|deforest|radar/.test(msg)) return {text:`La demostración de cambios territoriales en **${r.name}** presenta **${r.change.toFixed(1)} km²** como cifra ilustrativa. El futuro motor EarthVision analizará pares de escenas SAR georreferenciadas para cuantificar cambios, sujetos a verificación con fuentes complementarias.`,sources:['Fuente prevista: NASA NISAR','Modelo conceptual: EarthVision AI'],kind:'earth'};
 return {text:`Puedo explicar condiciones climáticas, actividad térmica, agricultura y cambios territoriales para **${r.name}**. Ahora mismo opero en **modo simulación**: las cifras no representan mediciones del territorio. Elija un módulo o pregunte por lluvias, incendios, cultivos o imágenes SAR.`,sources:['Motor conversacional determinista de demostración'],kind:'general'};
}
