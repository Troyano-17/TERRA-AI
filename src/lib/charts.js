import {esc} from './icons.js';
const tick=n=>Number(n).toFixed(Math.abs(n)>=100?0:Math.abs(n)>=10?0:1);
export function lineChart({labels=[],series=[],height=228,showGrid=true,area=true,unit='',grid=4}){
 const W=720,H=height,L=39,R=14,T=18,B=34,iw=W-L-R,ih=H-T-B;
 const values=series.flatMap(s=>s.values||[]).filter(Number.isFinite);
 let lo=Math.min(...values,0),hi=Math.max(...values,1);if(hi-lo<5){lo-=2;hi+=2;}
 const pad=(hi-lo)*.11;lo-=pad;hi+=pad;
 const X=i=>L+i*iw/Math.max(labels.length-1,1),Y=v=>T+(hi-v)/(hi-lo)*ih;
 const gid='a'+Math.random().toString(16).slice(2,9);
 const gridMarkup=showGrid?Array.from({length:grid+1},(_,i)=>{const v=lo+(hi-lo)*i/grid,y=Y(v);return `<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" stroke="#29414b" stroke-opacity=".55" stroke-dasharray="3 6"/><text x="${L-9}" y="${y+4}" text-anchor="end" fill="#788e9a" font-size="11">${tick(v)}</text>`}).join(''):'';
 const lines=series.map((s,j)=>{
  const vals=s.values||[],points=vals.map((v,i)=>`${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' '),path=vals.map((v,i)=>`${i?'L':'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
  const base=Y(lo);
  return `${area?`<path d="${path} L${X(vals.length-1)} ${base} L${X(0)} ${base}Z" fill="url(#${gid}${j})" opacity="${j===0?.52:.17}"/>`:''}<polyline points="${points}" stroke="${s.color||'#71dec0'}" stroke-width="${j===0?2.6:1.85}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${X(vals.length-1)}" cy="${Y(vals.at(-1)||0)}" r="3.6" fill="${s.color||'#71dec0'}" stroke="#0d1a25" stroke-width="2"/>${vals.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="9" fill="transparent"><title>${esc(labels[i]||i)}: ${v}${esc(unit)}</title></circle>`).join('')}`;
 }).join('');
 const step=Math.max(1,Math.ceil(labels.length/7));
 const xlabels=labels.map((l,i)=>i%step===0||i===labels.length-1?`<text x="${X(i)}" y="${H-10}" text-anchor="middle" fill="#82939e" font-size="11">${esc(l)}</text>`:'').join('');
 return `<div class="svg-chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Gráfico temporal de datos simulados"><defs>${series.map((s,j)=>`<linearGradient id="${gid}${j}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${s.color||'#71dec0'}" stop-opacity=".36"/><stop offset="100%" stop-color="${s.color||'#71dec0'}" stop-opacity="0"/></linearGradient>`).join('')}</defs>${gridMarkup}${lines}${xlabels}</svg></div>`;
}
export function bars({labels=[],values=[],color='#6ddbb0',height=210,unit=''}){
 const W=720,H=height,L=40,R=12,T=16,B=33,iw=W-L-R,ih=H-T-B,max=Math.max(...values,1)*1.16,barW=Math.max(3,iw/values.length*.56),step=iw/values.length;
 let t=''; for(let i=0;i<=4;i++){const y=T+i/4*ih,vl=max*(1-i/4);t+=`<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="#28414b" stroke-dasharray="3 6"/><text x="${L-8}" y="${y+4}" text-anchor="end" fill="#81949e" font-size="11">${tick(vl)}</text>`;}
 const xstep=Math.max(1,Math.ceil(labels.length/8));
 return `<div class="svg-chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Gráfico de barras con valores simulados"><defs><linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity=".25"/></linearGradient></defs>${t}${values.map((v,i)=>{const h=v/max*ih,x=L+i*step+(step-barW)/2;return `<rect x="${x}" y="${T+ih-h}" width="${barW}" height="${h}" rx="2.5" fill="url(#barGrad)"><title>${esc(labels[i])}: ${v}${esc(unit)}</title></rect>${i%xstep===0?`<text x="${x+barW/2}" y="${H-10}" text-anchor="middle" fill="#81949e" font-size="11">${esc(labels[i])}</text>`:''}`}).join('')}</svg></div>`;
}
export function sparkline(values,color='#6edcb6'){
 const W=106,H=34,l=Math.min(...values)-2,h=Math.max(...values)+2;
 const p=values.map((v,i)=>`${i/(values.length-1)*W},${H-3-(v-l)/(h-l)*(H-8)}`).join(' ');
 return `<svg class="sparkline" viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline points="${p}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
export function gauge(value,color='#70dfb5',size=126){
 const radius=48,circ=2*Math.PI*radius,offset=circ*(1-Math.max(0,Math.min(100,value))/100);
 return `<div class="gauge"><svg viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="Índice simulado ${value} sobre 100"><circle cx="60" cy="60" r="48" stroke="#29404b" stroke-width="10" fill="none"/><circle cx="60" cy="60" r="48" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none" stroke-dasharray="${circ}" stroke-dashoffset="${offset}" transform="rotate(-90 60 60)"/><text x="60" y="64" fill="#eaf9f5" font-size="30" text-anchor="middle" font-weight="700">${value}</text><text x="60" y="81" fill="#8ca0a7" font-size="11" text-anchor="middle">de 100</text></svg></div>`;
}
