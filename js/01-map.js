// ---------- dữ liệu bản đồ
const bl=D.b.map((r,i)=>{const p=r[5];let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(let j=0;j<p.length;j+=2){x0=Math.min(x0,p[j]);x1=Math.max(x1,p[j]);y0=Math.min(y0,p[j+1]);y1=Math.max(y1,p[j+1])}
 const hs=hash(i*7,i*13),H=r[3]||(r[2]?r[2]*3.3:DH[r[1]]||5+hs*6);return{i,n:r[0],t:r[1],lv:r[2],ht:r[3],ar:r[4],p,x0,y0,x1,y1,hs,H:Math.min(H,42),bn:r[0].replace(/\s*–\s*phần\s*\d+$/,''),al:1,ox:Math.round(x0*P)-3}});
bl.forEach(b=>b.oy=Math.round(b.y0*P)-Math.round(b.H*1.5)-3);
const GD=new Map;bl.forEach(b=>{for(let a=Math.floor(b.x0/cs);a<=Math.floor(b.x1/cs);a++)for(let c=Math.floor(b.y0/cs);c<=Math.floor(b.y1/cs);c++){const k=a+','+c;(GD.get(k)||GD.set(k,[]).get(k)).push(b)}});
const hitB=(x,y)=>{const a=GD.get(Math.floor(x/cs)+','+Math.floor(y/cs));let r=null;if(a)for(const b of a)if(x>=b.x0&&x<=b.x1&&y>=b.y0&&y<=b.y1&&inPoly(b.p,x,y)&&(!r||b.ar<r.ar))r=b;return r};
const WP=D.a.filter(a=>a[0]==3).map(a=>a[2]),TR=D.t.map(([x,y,s],i)=>({x,y,s,r:s<16?6:s<22?8:10,v:hash(i,3)<.13?1:0,al:1})),TG=new Map;
TR.forEach(t=>{const k=Math.floor(t.x/16)+','+Math.floor(t.y/16);(TG.get(k)||TG.set(k,[]).get(k)).push(t)});
const blocked=(x,y)=>{if(hitB(x,y))return 1;for(const p of WP)if(inPoly(p,x,y))return 1;for(let a=-1;a<2;a++)for(let c=-1;c<2;c++){const l=TG.get((Math.floor(x/16)+a)+','+(Math.floor(y/16)+c));if(l)for(const t of l)if(Math.hypot(t.x-x,t.y-y)<.75)return 1}return 0};
const free=(x,y)=>!(blocked(x,y)||blocked(x+.6,y)||blocked(x-.6,y)||blocked(x,y+.4)||blocked(x,y-.4));
const AP=Array.from({length:11},()=>new Path2D),HN=new Path2D,MK=new Path2D,RLP=new Path2D,RG=[],rm=new Map;
D.a.forEach(([k,n,p])=>{const pa=new Path2D;line(pa,p,1);AP[k].addPath(pa)});D.hn.forEach(p=>line(HN,p,1));D.rl.forEach(p=>line(RLP,p));
D.rc.forEach(([c,ni,w,p])=>{const k=c+'|'+w;let r=rm.get(k);if(!r){rm.set(k,r={c,w,pa:new Path2D});RG.push(r)}line(r.pa,p)});
D.sp.forEach(([sp,p])=>{let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(let j=0;j<p.length;j+=2){x0=Math.min(x0,p[j]);x1=Math.max(x1,p[j]);y0=Math.min(y0,p[j+1]);y1=Math.max(y1,p[j+1])}const mx=(x0+x1)/2,my=(y0+y1)/2;MK.rect(x0+1,y0+1,x1-x0-2,y1-y0-2);(x1-x0>=y1-y0)?(MK.moveTo(mx,y0),MK.lineTo(mx,y1)):(MK.moveTo(x0,my),MK.lineTo(x1,my));MK.moveTo(mx+Math.min(x1-x0,y1-y0)*.14,my);MK.arc(mx,my,Math.min(x1-x0,y1-y0)*.14,0,6.2832)});
