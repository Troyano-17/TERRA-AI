import test from 'node:test';
import assert from 'node:assert/strict';

test('renderizado integral de los 11 módulos con adaptador mock y navegación',async()=>{
 const handlers={};
 const app={innerHTML:'',addEventListener:(ev,fn)=>{handlers[ev]=fn;}};
 globalThis.window={TERRA_CONFIG:{provider:'mock'},scrollTo:()=>{}};
 globalThis.document={querySelector:s=>s==='#app'?app:null,getElementById:()=>null,addEventListener:()=>{}};
 await import('../src/app.js');
 await new Promise(ok=>setTimeout(ok,15));
 assert.match(app.innerHTML,/Visión general/);
 assert.match(app.innerHTML,/ENTORNO DE DEMOSTRACIÓN/);
 for(const id of ['map','climate','fire','agro','earth','models','alerts','reports','integrations','settings','overview']){
  const btn={dataset:{nav:id},hasAttribute:()=>false};
  handlers.click({target:{closest:()=>btn}});
  await new Promise(ok=>setTimeout(ok,3));
  assert.ok(app.innerHTML.length>7000,`Pantalla ${id} debe renderizar contenido`);
  assert.match(app.innerHTML,/DATOS FICTICIOS/);
 }
});
