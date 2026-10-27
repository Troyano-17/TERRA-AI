/**
 * PUNTO DE CONEXIÓN 2/4 — Adapter de API REST real.
 * Implementa estos endpoints en tu backend y cambia `provider: 'api'` en config.js.
 * No introduzcas claves privadas en el navegador. Mantén la integración de proveedores
 * satelitales y los modelos detrás de tu backend.
 */
export class APIProvider {
  mode='api';
  constructor(base='/api/v1'){this.base=base.replace(/\/$/,'');}
  async request(path,options={}){
    const res=await fetch(this.base+path,{headers:{'Accept':'application/json',...(options.body?{'Content-Type':'application/json'}:{}),...options.headers},...options});
    if(!res.ok){let message=`API ${res.status}`;try{message=(await res.json()).error||message}catch{};throw new Error(message);}
    return res.json();
  }
  getRegions(){return this.request('/regions');}
  getDashboard(regionId,period){return this.request(`/dashboard?region=${encodeURIComponent(regionId)}&period=${encodeURIComponent(period)}`);}
  getSeries(regionId,period){return this.request(`/series?region=${encodeURIComponent(regionId)}&period=${encodeURIComponent(period)}`);}
  getHotspots(regionId,period){return this.request(`/hotspots?region=${encodeURIComponent(regionId)}&period=${encodeURIComponent(period)}`);}
  getAlerts(){return this.request('/alerts');}
  getIntegrations(){return this.request('/integrations');}
  getModels(){return this.request('/models');}
  askAssistant(message,regionId){return this.request('/assistant',{method:'POST',body:JSON.stringify({message,regionId})});}
  runInference(modelId,regionId){return this.request('/inference',{method:'POST',body:JSON.stringify({modelId,regionId})});}
  health(){return this.request('/health');}
}
