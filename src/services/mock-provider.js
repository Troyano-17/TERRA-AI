import {REGIONS,INTEGRATIONS,MODEL_CATALOG,getRegion,makeDashboard,makeSeries,makeHotspots,makeAlerts,assistantReply} from '../data/fixtures.js';
/** Adapter de prueba: cumple los mismos métodos que APIProvider. Sin llamadas externas. */
export class MockProvider {
  mode='mock';
  async getRegions(){return REGIONS;}
  async getDashboard(regionId,period){return makeDashboard(regionId,period);}
  async getSeries(regionId,period){return makeSeries(regionId,period);}
  async getHotspots(regionId,period){return makeHotspots(regionId,period);}
  async getAlerts(){return makeAlerts();}
  async getIntegrations(){return INTEGRATIONS;}
  async getModels(){return MODEL_CATALOG;}
  async askAssistant(message,regionId){return assistantReply(message,regionId);}
  async runInference(modelId,regionId){ const r=getRegion(regionId); return {modelId,regionId,score:modelId==='fire'?r.fireRisk:modelId==='agro'?r.soil:modelId==='earth'?Math.round(r.change*2):Math.round(r.anomaly*21),confidence:78+modelId.length,simulated:true,explanation:`Resultado de demostración de ${modelId} para ${r.name}. No hay un modelo entrenado conectado.`};}
  async health(){ return {status:'demo',provider:'mock',modelServing:false,database:false,scienceApi:false}; }
}
