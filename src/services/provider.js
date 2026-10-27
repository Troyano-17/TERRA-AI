import {MockProvider} from './mock-provider.js';
import {APIProvider} from './api-provider.js';
const cfg=window.TERRA_CONFIG||{};
export const provider=cfg.provider==='api' ? new APIProvider(cfg.apiBaseUrl||'/api/v1') : new MockProvider();
export const providerMode=provider.mode;
