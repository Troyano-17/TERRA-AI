import {COUNTRIES} from '../data/world.js';
import {REGIONS} from '../data/fixtures.js';

/** Renderizador cartográfico Canvas 2D offline: geografía Natural Earth simplificada.
 * Los halos y puntos son sintéticos. NO son imágenes de satélite ni datos medidos. */
export function mountMap(container,{hotspots=[],regionId='huanuco',layers=['fire','rain'],onSelect=()=>{},globalView=false}={}){
 if(!container)return ()=>{};
 const canvas=container.querySelector('canvas');if(!canvas)return ()=>{};
 const ctx=canvas.getContext('2d');
 const base=document.createElement('canvas');const bg=base.getContext('2d');
 let rect,w,h,zoom=globalView?1.00:3.55,lon=globalView?-8:-75,lat=globalView?9:-10,disposed=false,points=[],drag=false,startX=0,startY=0,lastX=0,lastY=0,raf=null,frame=0,moved=false;
 const colorFire='#ff936b',active=REGIONS.find(r=>r.id===regionId)||REGIONS[0];
 const setDims=()=>{
  rect=canvas.getBoundingClientRect();w=Math.max(200,Math.round(rect.width));h=Math.max(200,Math.round(rect.height));
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  base.width=w*dpr;base.height=h*dpr;bg.setTransform(dpr,0,0,dpr,0,0);
  drawBase();
 };
 const scale=()=>w/360*zoom;
 const project=(x,y)=>[w/2+(x-lon)*scale(),h/2+(lat-y)*scale()];
 const drawBase=()=>{
  bg.clearRect(0,0,w,h);
  const sea=bg.createLinearGradient(0,0,w,h);sea.addColorStop(0,'#112730');sea.addColorStop(.65,'#0c1e28');sea.addColorStop(1,'#102b32');bg.fillStyle=sea;bg.fillRect(0,0,w,h);
  bg.lineWidth=.8;bg.strokeStyle='rgba(84,142,151,.105)';
  for(let la=-80;la<=80;la+=20){let [x,y]=project(-180,la);bg.beginPath();bg.moveTo(0,y);bg.lineTo(w,y);bg.stroke();}
  for(let lo=-180;lo<=180;lo+=20){let [x,y]=project(lo,0);bg.beginPath();bg.moveTo(x,0);bg.lineTo(x,h);bg.stroke();}
  for(const [name,polys] of COUNTRIES){
    bg.beginPath();let visible=false;
    for(const polygon of polys){let started=false;for(const [lo,la] of polygon){const [x,y]=project(lo,la);if(x>-35&&x<w+35&&y>-35&&y<h+35)visible=true;if(!started){bg.moveTo(x,y);started=true;}else bg.lineTo(x,y);}bg.closePath();}
    if(!visible)continue;
    const peru=name==='Peru';
    bg.fillStyle=peru?'#29574b':name==='Brazil'?'#1e433b':'#1b3940';
    bg.fill();bg.strokeStyle=peru?'rgba(118,226,180,.56)':'rgba(87,140,138,.45)';bg.lineWidth=peru?1.2:.65;bg.stroke();
  }
  // subtle coast contour and vignette
  const glow=bg.createRadialGradient(w*.57,h*.6,0,w*.57,h*.6,Math.max(w,h)*.72);glow.addColorStop(0,'rgba(37,101,105,.14)');glow.addColorStop(1,'rgba(3,14,23,.34)');bg.fillStyle=glow;bg.fillRect(0,0,w,h);
 };
 const ring=(x,y,r,fill)=>{
  const g=ctx.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,fill);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,2*Math.PI);ctx.fill();
 };
 const draw=()=>{
  if(disposed)return;frame++;ctx.clearRect(0,0,w,h);ctx.drawImage(base,0,0,base.width,base.height,0,0,w,h);
  if(layers.includes('rain')) {
   REGIONS.forEach((r,i)=>{const [x,y]=project(r.lon,r.lat),rr=Math.max(35,Math.min(120,75*zoom/3));if(x<-rr||x>w+rr||y<-rr||y>h+rr)return;ring(x-8,y+10,rr,'rgba(64,133,247,.13)');});
  }
  if(layers.includes('temperature')) {
   REGIONS.forEach((r,i)=>{const [x,y]=project(r.lon,r.lat);ring(x+18,y-12,Math.min(90,30+zoom*12),'rgba(255,181,93,.15)');});
  }
  if(layers.includes('vegetation')){
   REGIONS.forEach(r=>{const [x,y]=project(r.lon,r.lat);ring(x,y,Math.min(75,22+zoom*11),'rgba(68,221,139,.13)');});
  }
  if(layers.includes('fire')){
   let max=zoom<1.5?90:150;
   for(let i=0;i<Math.min(hotspots.length,max);i++){
    const p=hotspots[i],[x,y]=project(p.lon,p.lat);if(x<-20||x>w+20||y<-20||y>h+20)continue;
    const size=p.frp>100?3.7:2.25;const pulse=(1+Math.sin(frame*.075+i)*.25);
    if(p.frp>75){ctx.strokeStyle=`rgba(255,145,99,${.19+.14*Math.sin(frame*.08+i)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,(size+4)*pulse,0,2*Math.PI);ctx.stroke();}
    ctx.fillStyle=p.frp>100?'#ff9270':'#ffcc8a';ctx.beginPath();ctx.arc(x,y,size,0,2*Math.PI);ctx.fill();
   }
  }
  points=[];
  for(const r of REGIONS){
   const [x,y]=project(r.lon,r.lat);if(x<20||x>w-20||y<18||y>h-18)continue;
   const sel=r.id===regionId;
   if(sel){ring(x,y,34,'rgba(107,231,184,.18)');ctx.strokeStyle='rgba(129,238,192,.4)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,12+2*Math.sin(frame*.05),0,Math.PI*2);ctx.stroke();}
   ctx.fillStyle=sel?'#7ff2c2':'#b8ded8';ctx.strokeStyle='#10202b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,sel?5.5:3.5,0,2*Math.PI);ctx.fill();ctx.stroke();
   if(sel||zoom>3&&r.country==='Perú'||globalView&&['huanuco','saopaulo','california','jakarta','nairobi'].includes(r.id)){
    const label=r.name.toUpperCase();ctx.font=`${sel?'700':'600'} 10px system-ui`;ctx.textAlign='left';ctx.fillStyle=sel?'#e0fff2':'#8cabaf';ctx.fillText(label,x+9,y-10);
   }
   points.push({x,y,r});
  }
  // map attribution
  ctx.fillStyle='rgba(5,17,26,.72)';ctx.fillRect(10,h-27,285,20);ctx.font='10px system-ui';ctx.fillStyle='#a2b9bf';ctx.fillText('BASE NATURAL EARTH · CAPAS SIMULADAS',17,h-13);
 };
 let interval=setInterval(draw,90);
 const onResize=()=>{setDims();draw();};
 const pointerDown=e=>{drag=true;moved=false;startX=lastX=e.clientX;startY=lastY=e.clientY;canvas.style.cursor='grabbing';canvas.setPointerCapture(e.pointerId);};
 const pointerMove=e=>{if(!drag)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(e.clientX-startX)+Math.abs(e.clientY-startY)>5)moved=true;lon=Math.max(-185,Math.min(185,lon-dx/scale()));lat=Math.max(-82,Math.min(82,lat+dy/scale()));lastX=e.clientX;lastY=e.clientY;drawBase();draw();};
 const pointerUp=e=>{if(!drag)return;drag=false;canvas.style.cursor='grab';if(moved)return;const box=canvas.getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top;let closest=null,d=25;for(const point of points){const dd=Math.hypot(x-point.x,y-point.y);if(dd<d){d=dd;closest=point.r;}}if(closest)onSelect(closest.id);};
 const wheel=e=>{e.preventDefault();zoom=Math.max(.85,Math.min(8.5,zoom*(e.deltaY<0?1.18:.84)));drawBase();draw();};
 canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('wheel',wheel,{passive:false});
 const zoomin=container.querySelector('[data-map-zoom-in]'),zoomout=container.querySelector('[data-map-zoom-out]'),reset=container.querySelector('[data-map-reset]');
 const handleIn=()=>{zoom=Math.min(8.5,zoom*1.4);drawBase();draw();},handleOut=()=>{zoom=Math.max(.85,zoom/1.4);drawBase();draw();},handleReset=()=>{zoom=globalView?1:3.55;lon=globalView?-8:-75;lat=globalView?9:-10;drawBase();draw();};
 zoomin?.addEventListener('click',handleIn);zoomout?.addEventListener('click',handleOut);reset?.addEventListener('click',handleReset);
 const observer=new ResizeObserver(onResize);observer.observe(container);setDims();draw();
 return ()=>{disposed=true;clearInterval(interval);observer.disconnect();canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointermove',pointerMove);canvas.removeEventListener('pointerup',pointerUp);canvas.removeEventListener('wheel',wheel);zoomin?.removeEventListener('click',handleIn);zoomout?.removeEventListener('click',handleOut);reset?.removeEventListener('click',handleReset);};
}
