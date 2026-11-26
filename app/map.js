// ===== Bản đồ 2.5D HNUE: định vị · chỉ đường · dẫn đường =====
const D=window.HNUE;D.home=D.home||[-357,-360,76,203];const X=window.HNUE_X||{rn:[],al:{}},$=s=>document.querySelector(s),ML=D.ml,cv=$('#cv'),ctx=cv.getContext('2d'),DPR=Math.min(2,devicePixelRatio||1);
const TY=[['Nhà dân & công trình khác','#e8e1d3','#3b4048','#d3c9b4','#4b515b'],['Giảng đường · khối học','#f6b96b','#cf8e42','#c9822e','#e8a95a'],['Thư viện','#86b8f2','#4d83c6','#4a7fc4','#86b6ee'],['Căn tin · kiốt ăn uống','#f49b8c','#c8685d','#c2594b','#f08e80'],['Khán đài','#c5b0ec','#8d75c0','#8a6fba','#bba5e8'],['Chùa · đình','#ebaab8','#b97a8a','#b06577','#e79bab'],['Ký túc xá','#88d5c1','#49a38c','#3f9d86','#82d2bc'],['Ga metro','#a3afc4','#707d94','#6a7790','#a6b3c9'],['Thương mại · chung cư','#cdc1de','#6e6188','#9a8cb4','#aa9ac6'],['Công trình khác','#ded4c0','#4c5057','#c5b99f','#5c616a']];
const AR=[['#d4e9b6','#2f4a30'],['#ece6d9','#2a3037'],['#a8d98f','#3f6e3c'],['#a9d3ef','#2d5a7a'],['#b6d898','#2a4b2b'],['#e3e1ec','#393d49'],['#c6e3a3','#305131'],['#efdbd3','#3a3339'],['#e1f0c3','#43532f'],['#dee9ba','#39462d'],['#ecdac6','#41392f'],['#f1ede3','#1b2026']],AO=[1,7,9,0,6,4,8,10,5,3,2];
const RS=[['#e0b866','#5b4b2b','#ffe3a1','#7f6c42'],['#e5cd8c','#504731','#fff0c4','#6e5e3d'],['#d9d1c0','#2d3238','#fffbe9','#565c64'],['#d9d1c0','#2d3238','#fff','#4f555e'],['#d9d1c0','#2d3238','#fff','#4f555e'],['#ddd5c3','#2d3238','#f7f3ea','#454b53']];
const PC=['#e8734a','#4a90d9','#7b61c9','#2f9e8f','#6b7a90','#c9803a'];
let W=innerWidth,H=innerHeight,need=1,dk=localStorage.hnueDark=='1',G={},me=null,sel=null,RT=null,OR=null,DS=null,speed=1.35,hi=null,chip=null;
const K=(l,d)=>dk?d:l,esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nz=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
const ll=(lat,lon)=>[(lon-D.c[1])*ML[1],(D.c[0]-lat)*ML[0]];
const V={cx:0,cy:0,s:1,r:0,t:.62},hz=()=>Math.sqrt(1-V.t*V.t)*1.15+.001;
// ---- dữ liệu
const bs=D.b.map((r,i)=>{const p=r[5];let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,cx=0,cy=0,n=p.length/2;for(let j=0;j<p.length;j+=2){x0=Math.min(x0,p[j]);x1=Math.max(x1,p[j]);y0=Math.min(y0,p[j+1]);y1=Math.max(y1,p[j+1]);cx+=p[j];cy+=p[j+1]}
 return{i,n:r[0],bn:r[0].replace(/\s*–\s*phần\s*\d+$/,''),t:r[1],lv:r[2],H:Math.min(r[3]||(r[2]?r[2]*3.3:4+(i*37)%7),48),ar:r[4],p,x0,y0,x1,y1,cx:cx/n,cy:cy/n}});
const BUILD_KEY='hnueMapBuilds';
let buildMode=0,buildType=1,buildTool='place',buildSize=12,buildHeight=9,buildHover=null,placed=[],buildLoadError=null,buildSaveError=false,buildUndo=[],buildRedo=[],buildSeq=0;
function buildFrom(q){const{x,y,w,d,height:h,t,id}=q,p=[x,y-d/2,x+w/2,y,x,y+d/2,x-w/2,y],bn=`${TY[t][0]} · ${String(id).slice(-4)}`;return{i:'custom-'+id,id,n:bn,bn,t,lv:Math.max(1,Math.round(h/3)),H:h,height:h,ar:w*d,p,x0:x-w/2,x1:x+w/2,y0:y-d/2,y1:y+d/2,cx:x,cy:y,w,d,custom:1}}
try{const saved=JSON.parse(localStorage.getItem(BUILD_KEY)||'[]'),ids=new Set;if(!Array.isArray(saved))throw new TypeError('Dữ liệu công trình phải là một danh sách');placed=saved.map(q=>{if(!q||typeof q.id!=='string'||![q.x,q.y,q.w,q.d,q.height,q.t].every(Number.isFinite)||!Number.isInteger(q.t)||q.t<0||q.t>=TY.length||q.w<=0||q.d<=0||q.height<=0||ids.has(q.id))throw new TypeError('Dữ liệu công trình không hợp lệ');ids.add(q.id);return buildFrom(q)})}catch(e){buildLoadError=e;placed=[]}
const areas=D.a.map(a=>{const p=a[2];let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(let j=0;j<p.length;j+=2){x0=Math.min(x0,p[j]);x1=Math.max(x1,p[j]);y0=Math.min(y0,p[j+1]);y1=Math.max(y1,p[j+1])}return{t:a[0],p,x0,y0,x1,y1,o:AO.indexOf(a[0])}}).sort((a,b)=>a.o-b.o);
const WAYS=D.rc.map(r=>({cls:r[0],nm:r[1],w:r[2],p:r[3]})).sort((a,b)=>a.w-b.w),wname=w=>{if(w<0)return'';const n=X.rn[WAYS[w].nm]||'';return n=='Đường'||n=='Đường đi'?'':n};
const PO=D.p.map(p=>({k:'p',cat:p[0],name:p[1],x:p[2],y:p[3],icon:p[4],label:p[5]}));
const seen=new Set,PL=[];bs.slice().sort((a,b)=>(a.t==0)-(b.t==0)||b.ar-a.ar).forEach(b=>{if(b.bn.length<3||seen.has(b.bn)||/^(Nhà|Tòa nhà)$/i.test(b.bn))return;seen.add(b.bn);PL.push({k:'b',name:b.bn,b,x:b.cx,y:b.cy,icon:'',label:TY[b.t]?TY[b.t][0]:'',cat:-1})});
PO.forEach(p=>PL.push(p));X.rn.forEach((n,i)=>{const w=WAYS.find(w=>w.nm==i);if(w&&!PL.some(p=>p.name==n)){const m=w.p.length/4|0;PL.push({k:'r',name:n,x:w.p[m*2],y:w.p[m*2+1],icon:'',label:'Đường · ngõ',cat:-2})}});
PL.forEach(p=>p.s=nz(p.name+' '+(X.al[p.name]||'')+' '+p.label));
// ---- đồ thị đường đi
const SG=[];WAYS.forEach((w,wi)=>{for(let j=0;j+3<w.p.length;j+=2)SG.push({a:[w.p[j],w.p[j+1]],b:[w.p[j+2],w.p[j+3]],w:wi,ts:[]})});
const GC=25,gk=(a,b)=>a+','+b,GR=new Map;SG.forEach((s,i)=>{for(let a=Math.floor(Math.min(s.a[0],s.b[0])/GC);a<=Math.floor(Math.max(s.a[0],s.b[0])/GC);a++)for(let b=Math.floor(Math.min(s.a[1],s.b[1])/GC);b<=Math.floor(Math.max(s.a[1],s.b[1])/GC);b++){const k=gk(a,b);(GR.get(k)||GR.set(k,[]).get(k)).push(i)}});
const EXTRA=[],done=new Set;
for(const l of GR.values())for(let i=0;i<l.length;i++)for(let j=i+1;j<l.length;j++){const A=SG[l[i]],B=SG[l[j]];if(A.w==B.w)continue;const key=l[i]*1e5+l[j];if(done.has(key))continue;done.add(key);
 const rx=A.b[0]-A.a[0],ry=A.b[1]-A.a[1],sx=B.b[0]-B.a[0],sy=B.b[1]-B.a[1],d=rx*sy-ry*sx;if(Math.abs(d)<1e-9)continue;const qx=B.a[0]-A.a[0],qy=B.a[1]-A.a[1],t=(qx*sy-qy*sx)/d,u=(qx*ry-qy*rx)/d;if(t>.001&&t<.999&&u>.001&&u<.999){A.ts.push(t);B.ts.push(u)}}
function proj(s,x,y){const dx=s.b[0]-s.a[0],dy=s.b[1]-s.a[1],L=dx*dx+dy*dy||1e-9;let t=((x-s.a[0])*dx+(y-s.a[1])*dy)/L;t=Math.max(0,Math.min(1,t));return[t,s.a[0]+dx*t,s.a[1]+dy*t]}
SG.forEach((s,i)=>{for(const e of[s.a,s.b]){const c=GR.get(gk(Math.floor(e[0]/GC),Math.floor(e[1]/GC)))||[];for(const j of c){const o=SG[j];if(o.w==s.w)continue;const[t,px,py]=proj(o,e[0],e[1]),d=Math.hypot(px-e[0],py-e[1]);if(d<3&&t>.001&&t<.999){o.ts.push(t);EXTRA.push([e[0],e[1],px,py,s.w])}}}});
const NX=[],NY=[],AJ=[],KM=new Map,ED=[];
function node(x,y){const k=Math.round(x*2)+','+Math.round(y*2);let i=KM.get(k);if(i===undefined){i=NX.length;NX.push(x);NY.push(y);AJ.push([]);KM.set(k,i)}return i}
function addE(u,v,w){if(u===v)return;const l=Math.hypot(NX[u]-NX[v],NY[u]-NY[v]),k=ED.length;ED.push([u,v,l,w]);AJ[u].push([v,l,k]);AJ[v].push([u,l,k])}
SG.forEach(s=>{const ts=[0,...s.ts.sort((a,b)=>a-b),1];for(let i=0;i<ts.length-1;i++){if(ts[i+1]-ts[i]<1e-6)continue;const p=t=>[s.a[0]+(s.b[0]-s.a[0])*t,s.a[1]+(s.b[1]-s.a[1])*t],a=p(ts[i]),b=p(ts[i+1]);addE(node(a[0],a[1]),node(b[0],b[1]),s.w)}});
EXTRA.forEach(e=>addE(node(e[0],e[1]),node(e[2],e[3]),e[4]));
// nối các cụm đường rời nhau (dữ liệu OSM đã giản lược) bằng cầu nối ngắn ≤ 40 m
(function(){const N=NX.length,q=Array.from({length:N},(_,i)=>i),f=i=>{while(q[i]!=i){q[i]=q[q[i]];i=q[i]}return i};ED.forEach(e=>{q[f(e[0])]=f(e[1])});const ng=new Map;for(let i=0;i<N;i++){const k=gk(Math.floor(NX[i]/30),Math.floor(NY[i]/30));(ng.get(k)||ng.set(k,[]).get(k)).push(i)}
 for(let pass=0;pass<10;pass++){let ch=0;const roots=new Set;for(let i=0;i<N;i++)roots.add(f(i));if(roots.size<2)break;
  for(const r of roots){if(f(r)!==r)continue;let best=null;for(let i=0;i<N;i++){if(f(i)!==r)continue;const a0=Math.floor(NX[i]/30),b0=Math.floor(NY[i]/30);for(let a=a0-1;a<=a0+1;a++)for(let b=b0-1;b<=b0+1;b++){for(const j of ng.get(gk(a,b))||[]){if(f(j)===r)continue;const d=Math.hypot(NX[i]-NX[j],NY[i]-NY[j]);if(d<40&&(!best||d<best.d))best={i,j,d}}}}
   if(best){addE(best.i,best.j,-1);q[f(best.i)]=f(best.j);ch=1}}if(!ch)break}})();
const EC=20,EG=new Map;ED.forEach((e,i)=>{const x0=Math.min(NX[e[0]],NX[e[1]]),x1=Math.max(NX[e[0]],NX[e[1]]),y0=Math.min(NY[e[0]],NY[e[1]]),y1=Math.max(NY[e[0]],NY[e[1]]);for(let a=Math.floor(x0/EC);a<=Math.floor(x1/EC);a++)for(let b=Math.floor(y0/EC);b<=Math.floor(y1/EC);b++){const k=gk(a,b);(EG.get(k)||EG.set(k,[]).get(k)).push(i)}});
function snap(x,y){const a0=Math.floor(x/EC),b0=Math.floor(y/EC);let best=null;for(const r of[1,2,4,8,16]){for(let a=a0-r;a<=a0+r;a++)for(let b=b0-r;b<=b0+r;b++){const l=EG.get(gk(a,b));if(!l)continue;for(const k of l){const e=ED[k],s={a:[NX[e[0]],NY[e[0]]],b:[NX[e[1]],NY[e[1]]]},[t,px,py]=proj(s,x,y),d=Math.hypot(px-x,py-y);if(!best||d<best.d)best={e:k,t,x:px,y:py,d}}}if(best&&best.d<=r*EC)break}return best}
class Heap{constructor(){this.h=[]}push(d,n){const h=this.h;h.push([d,n]);let i=h.length-1;while(i){const p=(i-1)>>1;if(h[p][0]<=h[i][0])break;[h[p],h[i]]=[h[i],h[p]];i=p}}pop(){const h=this.h,t=h[0],l=h.pop();if(h.length){h[0]=l;let i=0;for(;;){let a=i*2+1,b=a+1,m=i;if(a<h.length&&h[a][0]<h[m][0])m=a;if(b<h.length&&h[b][0]<h[m][0])m=b;if(m==i)break;[h[m],h[i]]=[h[i],h[m]];i=m}}return t}get n(){return this.h.length}}
function ends(p){if(p.k!='b'||!p.b)return{x:p.x,y:p.y};const q=[[p.b.cx,p.b.cy]];for(let j=0;j<p.b.p.length;j+=2)q.push([p.b.p[j],p.b.p[j+1]]);let best=null;for(const c of q){const s=snap(c[0],c[1]);if(s&&(!best||s.d<best.s.d))best={s,c}}return best?{x:best.c[0],y:best.c[1],s:best.s}:{x:p.x,y:p.y}}
function findRoute(A,B){const a=ends(A),b=ends(B),sa=a.s||snap(a.x,a.y),sb=b.s||snap(b.x,b.y);if(!sa||!sb||sa.d>250||sb.d>250)return null;const N=NX.length,EX=[[],[]],ex=new Map;
 const link=(vi,s)=>{const e=ED[s.e],l1=e[2]*s.t,l2=e[2]*(1-s.t);EX[vi].push([e[0],l1,-1],[e[1],l2,-1]);for(const[u,l]of[[e[0],l1],[e[1],l2]]){(ex.get(u)||ex.set(u,[]).get(u)).push([N+vi,l,-1])}};
 link(0,sa);link(1,sb);if(sa.e==sb.e){const l=ED[sa.e][2]*Math.abs(sa.t-sb.t);EX[0].push([N+1,l,-1]);EX[1].push([N,l,-1])}
 const dist=new Map([[N,0]]),prev=new Map,hp=new Heap;hp.push(0,N);let ok=0;
 while(hp.n){const[d,u]=hp.pop();if(d>dist.get(u))continue;if(u==N+1){ok=1;break}const L=u>=N?EX[u-N]:AJ[u],L2=ex.get(u);for(const l of L2?L.concat(L2):L){const v=l[0],nd=d+l[1];if(nd<(dist.has(v)?dist.get(v):1e18)){dist.set(v,nd);prev.set(v,[u,l[2]]);hp.push(nd,v)}}}
 if(!ok)return null;const ids=[];let c=N+1;while(c!=N){ids.push(c);c=prev.get(c)[0]}ids.push(N);ids.reverse();
 const pos=i=>i==N?[sa.x,sa.y]:i==N+1?[sb.x,sb.y]:[NX[i],NY[i]],pts=[],ways=[];
 if(Math.hypot(a.x-sa.x,a.y-sa.y)>1.5){pts.push([a.x,a.y]);ways.push(-1)}
 for(let i=0;i<ids.length;i++){pts.push(pos(ids[i]));if(i<ids.length-1){const pr=prev.get(ids[i+1]),k=pr[1];ways.push(k>=0?ED[k][3]:ED[(ids[i]==N?sa:sb).e][3])}}
 if(Math.hypot(b.x-sb.x,b.y-sb.y)>1.5){pts.push([b.x,b.y]);ways.push(-1)}
 const P=[pts[0]],Wy=[];for(let i=1;i<pts.length;i++){if(Math.hypot(pts[i][0]-P[P.length-1][0],pts[i][1]-P[P.length-1][1])<.05)continue;P.push(pts[i]);Wy.push(ways[i-1])}
 const cum=[0];for(let i=1;i<P.length;i++)cum.push(cum[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));return{pts:P,ways:Wy,cum,len:cum[cum.length-1],A,B}}
// ---- chỉ dẫn từng bước
const brg=(a,b)=>Math.atan2(b[0]-a[0],-(b[1]-a[1]))*180/Math.PI,turnText=t=>Math.abs(t)<30?'Đi thẳng':Math.abs(t)<70?'Rẽ nhẹ sang '+(t>0?'phải':'trái'):Math.abs(t)<150?'Rẽ '+(t>0?'phải':'trái'):'Quay đầu';
function mkSteps(r){const P=r.pts,Wy=r.ways,nm=w=>wname(w)||'đường nội bộ',out=[];let s0=0;out.push({turn:0,text:'Xuất phát'+(Wy[0]>=0&&wname(Wy[0])?', đi theo '+wname(Wy[0]):''),s0:0,at:P[0]});
 for(let i=1;i<P.length-1;i++){const t=((brg(P[i],P[i+1])-brg(P[i-1],P[i])+540)%360)-180,n1=nm(Wy[i-1]),n2=nm(Wy[i]);if(Math.abs(t)>=30||(n1!==n2&&Math.abs(t)>=15&&Wy[i]>=0)){out.push({turn:t,text:turnText(t)+(Wy[i]>=0&&n2!='đường nội bộ'?' vào '+n2:''),s0:r.cum[i],at:P[i]})}}
 out.push({turn:0,fin:1,text:'Đến '+r.B.name,s0:r.len,at:P[P.length-1]});const f=out.filter((s,i)=>i==0||s.fin||out[i+1].s0-s.s0>=8);for(let i=0;i<f.length-1;i++)f[i].d=f[i+1].s0-f[i].s0;return f}
// ---- chiếu 2.5D
function setG(){const c=Math.cos(V.r),s=Math.sin(V.r),S=V.s;G={c,s,a:c*S,b:s*S*V.t,c2:-s*S,d:c*S*V.t};G.e=W/2-G.a*V.cx-G.c2*V.cy;G.f=H/2-G.b*V.cx-G.d*V.cy;G.h=S*hz()}
const pr=(x,y,z)=>[G.a*x+G.c2*y+G.e,G.b*x+G.d*y+G.f-(z||0)*G.h];
function inv(sx,sy){const X=sx-G.e,Y=sy-G.f,det=G.a*G.d-G.c2*G.b;return[(G.d*X-G.c2*Y)/det,(-G.b*X+G.a*Y)/det]}
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),shade=(h,f)=>{const c=hex(h);return`rgb(${Math.min(255,c[0]*f)|0},${Math.min(255,c[1]*f)|0},${Math.min(255,c[2]*f)|0})`};
function inP(p,x,y){let c=false;for(let i=0,j=p.length-2;i<p.length;j=i,i+=2)if((p[i+1]>y)!=(p[j+1]>y)&&x<(p[j]-p[i])*(y-p[i+1])/(p[j+1]-p[i+1])+p[i])c=!c;return c}
let tm0=0;
function draw(t){need=0;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle=K('#f1ede3','#1b2026');ctx.fillRect(0,0,W,H);setG();
 const cs=[inv(0,0),inv(W,0),inv(0,H),inv(W,H)],M=[70,70,110,70],bx0=Math.min(...cs.map(c=>c[0]))-70,bx1=Math.max(...cs.map(c=>c[0]))+70,by0=Math.min(...cs.map(c=>c[1]))-70,by1=Math.max(...cs.map(c=>c[1]))+110,vi=o=>o.x1>=bx0&&o.x0<=bx1&&o.y1>=by0&&o.y0<=by1;
 const gt=()=>ctx.setTransform(G.a*DPR,G.b*DPR,G.c2*DPR,G.d*DPR,G.e*DPR,G.f*DPR),poly=(p)=>{ctx.moveTo(p[0],p[1]);for(let j=2;j<p.length;j+=2)ctx.lineTo(p[j],p[j+1]);ctx.closePath()};
 gt();for(const a of areas)if(vi(a)){ctx.fillStyle=K(AR[a.t][0],AR[a.t][1]);ctx.beginPath();poly(a.p);ctx.fill();if(a.t==3){ctx.strokeStyle=K('#86bfe6','#3d7aa3');ctx.lineWidth=1;ctx.stroke()}}
 const roads=WAYS.filter(w=>w.p.length>3),rp=w=>{ctx.beginPath();ctx.moveTo(w.p[0],w.p[1]);for(let j=2;j<w.p.length;j+=2)ctx.lineTo(w.p[j],w.p[j+1])};ctx.lineCap=ctx.lineJoin='round';
 for(const pass of[0,1])for(const w of roads){const R=RS[Math.min(w.cls,5)];ctx.strokeStyle=K(R[pass?2:0],R[pass?3:1]);ctx.lineWidth=Math.max(w.w,1.6/V.s)+(pass?0:1.3);rp(w);ctx.stroke()}
 ctx.strokeStyle=K('#e07a1f','#f2a24f');ctx.lineWidth=Math.max(1.6,2/V.s);ctx.setLineDash([8,5]);for(const h of D.hn){if(h.length>6){ctx.beginPath();poly(h);ctx.stroke()}}ctx.setLineDash([]);
 const vb=bs.filter(vi).concat(placed.filter(vi));
 if($('#oS').checked&&V.s>.5){ctx.fillStyle=K('rgba(40,30,20,.07)','rgba(0,0,0,.1)');for(const b of vb)for(const k of[.4,.7,1]){ctx.save();ctx.translate(b.H*.5*k,b.H*.32*k);ctx.beginPath();poly(b.p);ctx.fill();ctx.restore()}}
 if(RT){ctx.lineCap=ctx.lineJoin='round';const w=Math.max(4,6/V.s);ctx.strokeStyle='#fff';ctx.lineWidth=w+2.4;ctx.beginPath();RT.pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.strokeStyle='#2f7cf6';ctx.lineWidth=w;ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=w*.28;ctx.setLineDash([w*1.4,w*2.2]);ctx.lineDashOffset=-(t||0)/60;ctx.stroke();ctx.setLineDash([])}
 if(me&&me.acc){ctx.fillStyle='rgba(66,133,244,.14)';ctx.beginPath();ctx.arc(me.x,me.y,Math.min(me.acc,60),0,7);ctx.fill()}
 ctx.setTransform(DPR,0,0,DPR,0,0);
 // cây + công trình theo thứ tự chiều sâu
 const it=[];if($('#oT').checked)for(const tr of D.t){if(tr[0]<bx0||tr[0]>bx1||tr[1]<by0||tr[1]>by1)continue;const p=pr(tr[0],tr[1],0);it.push({k:p[1],tr,p})}
 for(const b of vb){let m=-1e9;b.sb=[];for(let j=0;j<b.p.length;j+=2){const p=pr(b.p[j],b.p[j+1],0);b.sb.push(p);m=Math.max(m,p[1])}it.push({k:m,b})}it.sort((a,b)=>a.k-b.k);
 const hs=hz()*V.s,dr=[];
 for(const o of it){if(o.tr){const r=Math.max(2.2,o.tr[2]*.16)*V.s,p=o.p;ctx.fillStyle='rgba(0,0,0,.14)';ctx.beginPath();ctx.ellipse(p[0]+r*.3,p[1],r*.9,r*.5*V.t+.5,0,0,7);ctx.fill();ctx.fillStyle=K('#6e4f33','#5b4129');ctx.fillRect(p[0]-r*.1,p[1]-r*1.1,Math.max(1,r*.2),r*1.1);
   const cy=p[1]-r*1.9*(hz()+.3);ctx.fillStyle=K('#79b266','#3a6b3e');ctx.beginPath();ctx.arc(p[0],cy,r,0,7);ctx.fill();ctx.fillStyle=K('#9bcb82','#4d8650');ctx.beginPath();ctx.arc(p[0]-r*.25,cy-r*.28,r*.55,0,7);ctx.fill();continue}
  const b=o.b,T=TY[b.t]||TY[9],base=K(T[1],T[2]),line=K(T[3],T[4]),h=b.H*hs,top=b.sb.map(p=>[p[0],p[1]-h]);b.st=top;b.wq=[];let A=0;for(let i=0;i<b.sb.length;i++){const p=b.sb[i],q=b.sb[(i+1)%b.sb.length];A+=p[0]*q[1]-q[0]*p[1]}
  if(V.s>.45)for(let i=0;i<b.sb.length;i++){const j=(i+1)%b.sb.length,p=b.sb[i],q=b.sb[j],dx=q[0]-p[0],dy=q[1]-p[1];let nx=A>0?dy:-dy,ny=A>0?-dx:dx;if(ny<=0)continue;const nl=Math.hypot(nx,ny)||1,f=.8-.2*(nx/nl);
   ctx.fillStyle=shade(base,dk?f*.8:f*.93);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.lineTo(top[j][0],top[j][1]);ctx.lineTo(top[i][0],top[i][1]);ctx.closePath();ctx.fill();b.wq.push([p,q,top[j],top[i]]);
   if(V.s>1.4&&b.H>6){ctx.strokeStyle='rgba(0,0,0,.1)';ctx.lineWidth=1;ctx.beginPath();for(let z=3.3;z<b.H-1;z+=3.3){const k=z*hs;ctx.moveTo(p[0],p[1]-k);ctx.lineTo(q[0],q[1]-k)}ctx.stroke()}}
  ctx.fillStyle=dk?shade(base,.95):shade(base,1.04);ctx.strokeStyle=line;ctx.lineWidth=1;ctx.beginPath();top.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();ctx.stroke();
  if(sel&&sel.b&&sel.b.bn==b.bn||hi&&hi.has(b.bn)){ctx.strokeStyle='#ee5a4f';ctx.lineWidth=2.5;ctx.stroke()}dr.push(b)}
 gb=dr;
 if(buildMode&&buildHover){const x=Math.round(buildHover[0]/5)*5,y=Math.round(buildHover[1]/5)*5,w=buildSize,d=buildSize,p=[[x,y-d/2],[x+w/2,y],[x,y+d/2],[x-w/2,y]],q=p.map(v=>pr(v[0],v[1],0));ctx.save();ctx.globalAlpha=.48;ctx.fillStyle=TY[buildType][1];ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.setLineDash([5,4]);ctx.beginPath();q.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
 // nhãn công trình
 if($('#oL').checked&&V.s>.75){const L=dr.filter(b=>b.t>0&&b.t<9||b.ar>260).sort((a,b)=>b.ar-a.ar),box=[];ctx.font='600 11px system-ui,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.lineJoin='round';
  const nm=new Set;for(const b of L){if(box.length>70)break;if(nm.has(b.bn))continue;const p=pr(b.cx,b.cy,b.H),w=ctx.measureText(b.bn).width+4,r=[p[0]-w/2,p[1]-7,w,14];if(r[0]<0||r[0]+w>W||r[1]<0||r[1]>H)continue;if(box.some(q=>r[0]<q[0]+q[2]&&r[0]+r[2]>q[0]&&r[1]<q[1]+q[3]&&r[1]+r[3]>q[1]))continue;box.push(r);nm.add(b.bn);ctx.strokeStyle=K('rgba(255,255,255,.9)','rgba(20,24,30,.9)');ctx.strokeText(b.bn,p[0],p[1]+4);ctx.fillStyle=K('#2a2926','#ebe8e1');ctx.fillText(b.bn,p[0],p[1]+4)}}
 // điểm tiện ích
 ps=[];if($('#oP').checked||chip){const only=chip?chip.f:null;for(const p of PO){if(only?!only(p):V.s<(p.cat==2||p.cat==3||p.cat==5?1.2:2.6))continue;if(p.x<bx0||p.x>bx1||p.y<by0||p.y>by1)continue;const q=pr(p.x,p.y,0);ps.push({p,q});ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(q[0],q[1]+2,8,3,0,0,7);ctx.fill();ctx.fillStyle=PC[p.cat]||'#666';ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(q[0],q[1]-9,10,0,7);ctx.fill();ctx.stroke();ctx.font='12px system-ui,"Apple Color Emoji","Segoe UI Emoji"';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(p.icon,q[0],q[1]-4.5)}}
 // điểm đầu / cuối
 const pin=(p,c,tx)=>{const q=pr(p[0],p[1],0);ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(q[0],q[1],8,3,0,0,7);ctx.fill();ctx.fillStyle=c;ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.bezierCurveTo(q[0]-16,q[1]-18,q[0]-13,q[1]-36,q[0],q[1]-36);ctx.bezierCurveTo(q[0]+13,q[1]-36,q[0]+16,q[1]-18,q[0],q[1]);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(q[0],q[1]-24,5,0,7);ctx.fill()};
 if(RT){pin(RT.pts[0],'#3ecf6e');pin(RT.pts[RT.pts.length-1],'#ee5a4f')}else if(sel&&sel.k!='r'&&!sel.b)pin([sel.x,sel.y],'#ee5a4f');
 if(me){const q=pr(me.x,me.y,0);if(me.hd!=null){ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(me.hd*Math.PI/180+V.r);ctx.fillStyle='rgba(66,133,244,.35)';ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,34,-Math.PI/2-.55,-Math.PI/2+.55);ctx.closePath();ctx.fill();ctx.restore()}ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(q[0],q[1],9,0,7);ctx.fill();ctx.fillStyle='#4285f4';ctx.beginPath();ctx.arc(q[0],q[1],6.5,0,7);ctx.fill()}
 $('#tl').textContent=V.t>.95?'2D':'2.5D';$('#tl').classList.toggle('on',V.t<.95)}
let gb=[],ps=[];
function loop(t){if(need||RT||anim)draw(t);requestAnimationFrame(loop)}
let anim=0;
function resize(){W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;need=1}addEventListener('resize',resize);
function fly(o,ms=600){const a={...V},t0=performance.now();anim=1;(function f(t){const k=Math.min(1,(t-t0)/ms),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;for(const q in o)V[q]=a[q]+(o[q]-a[q])*e;if(k<1)requestAnimationFrame(f);else anim=0})(t0)}
function fitBox(x0,y0,x1,y1,pad=80,lw=0){const w=Math.max(30,x1-x0),h=Math.max(30,y1-y0),s=Math.max(.3,Math.min((W-pad*2-lw)/w,(H-pad*2)/(h*V.t+30))*.95);return{cx:(x0+x1)/2-lw/2/s,cy:(y0+y1)/2,s}}
const home=()=>{const h=D.home;fly({...fitBox(h[0],h[1],h[2],h[3],40),r:0,t:.62})};
// ---- tương tác bản đồ
const pt=new Map;let dn=null,lpT=0;
cv.addEventListener('pointermove',e=>{if(buildMode){buildHover=inv(e.clientX,e.clientY);need=1}});
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pt.set(e.pointerId,[e.clientX,e.clientY]);hideAll();if(pt.size==1){dn={x:e.clientX,y:e.clientY,t:performance.now(),w:inv(e.clientX,e.clientY),mv:0,button:e.button,rot:e.button==2||e.shiftKey};clearTimeout(lpT);if(e.pointerType=='touch')lpT=setTimeout(()=>{if(dn&&!dn.mv)ctxMenu(e.clientX,e.clientY)},550)}else{dn=null;clearTimeout(lpT)}});
cv.addEventListener('pointermove',e=>{if(!pt.has(e.pointerId))return;const o=pt.get(e.pointerId);pt.set(e.pointerId,[e.clientX,e.clientY]);need=1;
 if(pt.size==2){const k=[...pt.values()],n=k[0],m=k[1],oo=e.pointerId==[...pt.keys()][0]?[o,m]:[n,o],d0=Math.hypot(oo[0][0]-oo[1][0],oo[0][1]-oo[1][1]),d1=Math.hypot(n[0]-m[0],n[1]-m[1]),a0=Math.atan2(oo[1][1]-oo[0][1],oo[1][0]-oo[0][0]),a1=Math.atan2(m[1]-n[1],m[0]-n[0]),mid0=[(oo[0][0]+oo[1][0])/2,(oo[0][1]+oo[1][1])/2],mid=[(n[0]+m[0])/2,(n[1]+m[1])/2],aw=inv(mid0[0],mid0[1]);
  V.s=Math.max(.25,Math.min(14,V.s*d1/(d0||1)));V.r+=a1-a0;setG();const cw=inv(mid[0],mid[1]);V.cx+=aw[0]-cw[0];V.cy+=aw[1]-cw[1];return}
 if(!dn)return;if(Math.hypot(e.clientX-dn.x,e.clientY-dn.y)>5){dn.mv=1;clearTimeout(lpT)}if(!dn.mv)return;
 if(dn.rot){V.r+=(e.clientX-o[0])*.008;V.t=Math.max(.45,Math.min(1,V.t+(e.clientY-o[1])*.003));return}
 setG();const cw=inv(e.clientX,e.clientY);V.cx+=dn.w[0]-cw[0];V.cy+=dn.w[1]-cw[1];NAVFOLLOW=0});
cv.addEventListener('pointerup',e=>{pt.delete(e.pointerId);clearTimeout(lpT);if(dn&&!dn.mv&&performance.now()-dn.t<500)tap(e.clientX,e.clientY,dn.button);dn=null});cv.addEventListener('pointercancel',e=>{pt.delete(e.pointerId);dn=null});
cv.addEventListener('wheel',e=>{e.preventDefault();setG();const aw=inv(e.clientX,e.clientY);V.s=Math.max(.25,Math.min(14,V.s*Math.exp(-e.deltaY*.0015)));setG();const cw=inv(e.clientX,e.clientY);V.cx+=aw[0]-cw[0];V.cy+=aw[1]-cw[1];need=1},{passive:false});
cv.addEventListener('contextmenu',e=>{e.preventDefault();if(!buildMode)ctxMenu(e.clientX,e.clientY)});
function zoomBy(k){V.s=Math.max(.25,Math.min(14,V.s*k));need=1}
$('#zi').onclick=()=>zoomBy(1.4);$('#zo').onclick=()=>zoomBy(1/1.4);$('#cp').onclick=()=>fly({r:0});$('#tl').onclick=()=>fly({t:V.t>.95?.62:1});$('#hm').onclick=home;$('#ly').onclick=()=>$('#lyp').classList.toggle('show');
document.querySelectorAll('#lyp input').forEach(i=>i.onchange=()=>{if(i.id=='oD'){dk=i.checked;localStorage.hnueDark=dk?'1':'0';document.documentElement.style.background=K('#f1ede3','#1b2026')}need=1});$('#oD').checked=dk;
$('#lyp').insertAdjacentHTML('beforeend','<label><input type="checkbox" id="oV"> Đọc chỉ đường bằng tiếng Việt</label>');
const vnVoicePrefs='hnueVoiceVN';let vnVoice=null,vnVoiceWarned=false,pendingVNText='';
function findVNVoice(voices){return voices.find(v=>String(v.lang||'').replace('_','-').toLowerCase()=='vi-vn')||voices.find(v=>/^vi(?:-|$)/i.test(String(v.lang||'')))||null}
function refreshVNVoice(){const synth=window.speechSynthesis;if(!synth)return null;vnVoice=findVNVoice(synth.getVoices());if(vnVoice)vnVoiceWarned=false;return vnVoice}
function warnNoVNVoice(){if(vnVoiceWarned)return;vnVoiceWarned=true;toast('Thiết bị chưa có giọng tiếng Việt. Cài giọng vi-VN trong cài đặt đọc văn bản.')}
function speakVietnamese(text){const synth=window.speechSynthesis;if(!synth||!window.SpeechSynthesisUtterance){toast('Trình duyệt không hỗ trợ đọc chỉ đường');return}
 const voices=synth.getVoices(),voice=findVNVoice(voices);vnVoice=voice;if(!voices.length){pendingVNText=text;return}if(!voice){pendingVNText='';warnNoVNVoice();return}
 const u=new SpeechSynthesisUtterance(text);u.lang='vi-VN';u.voice=voice;u.rate=.95;u.pitch=1;synth.speak(u)}
function onVNVoicesChanged(){const synth=window.speechSynthesis,voices=synth?synth.getVoices():[];vnVoice=findVNVoice(voices);if(vnVoice&&pendingVNText){const text=pendingVNText;pendingVNText='';speakVietnamese(text)}else if(voices.length&&!vnVoice&&pendingVNText){pendingVNText='';warnNoVNVoice()}}
if(window.speechSynthesis){refreshVNVoice();if(window.speechSynthesis.addEventListener)window.speechSynthesis.addEventListener('voiceschanged',onVNVoicesChanged);else window.speechSynthesis.onvoiceschanged=onVNVoicesChanged}
const voiceToggle=$('#oV');voiceToggle.checked=localStorage.getItem(vnVoicePrefs)=='1';voiceToggle.onchange=()=>{localStorage.setItem(vnVoicePrefs,voiceToggle.checked?'1':'0');if(voiceToggle.checked){if(window.speechSynthesis)window.speechSynthesis.getVoices();speakVietnamese('Đã bật hướng dẫn bằng tiếng Việt.')}else{pendingVNText='';if(window.speechSynthesis)window.speechSynthesis.cancel()}};
// ---- toast / menu / chọn
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',2600)};
const copyPlaced=()=>placed.map(b=>({...b,p:b.p.slice()}));
function updateBuildPanel(){document.querySelectorAll('#bp-types button').forEach(b=>b.classList.toggle('on',+b.dataset.type==buildType));document.querySelectorAll('#bp-tools button').forEach(b=>b.classList.toggle('on',b.dataset.buildTool==buildTool));$('#bundo').disabled=!buildUndo.length;$('#bredo').disabled=!buildRedo.length;$('#bsize-v').textContent=buildSize+' m';$('#bheight-v').textContent=buildHeight+' m';$('#bstatus').textContent=buildSaveError?'Không lưu được — giải phóng dung lượng trình duyệt rồi thử lại':buildLoadError?'Dữ liệu công trình đã lưu không hợp lệ':`${placed.length} công trình tự đặt · tự lưu trên thiết bị này`}
function persistPlaced(){try{localStorage.setItem(BUILD_KEY,JSON.stringify(placed.map(({id,t,cx,cy,w,d,height})=>({id,t,x:cx,y:cy,w,d,height}))));buildSaveError=false;buildLoadError=null;updateBuildPanel();return true}catch(e){buildSaveError=true;console.error('Không lưu được công trình tự đặt:',e);toast('Lưu thất bại — trình duyệt không đủ dung lượng');updateBuildPanel();return false}}
function snapshotPlaced(){buildUndo.push(copyPlaced());if(buildUndo.length>60)buildUndo.shift();buildRedo=[];updateBuildPanel()}
function placePlaced(p){snapshotPlaced();const x=Math.round(p[0]/5)*5,y=Math.round(p[1]/5)*5,id=`u${Date.now().toString(36)}-${(++buildSeq).toString(36)}`;placed.push(buildFrom({id,t:buildType,x,y,w:buildSize,d:buildSize,height:buildHeight}));persistPlaced();updateBuildPanel();need=1}
function erasePlaced(x,y){let found=null;for(let i=gb.length-1;i>=0;i--){const b=gb[i];if(b.custom&&b.st&&(inP(flat(b.st),x,y)||inP(flat(b.sb),x,y)||b.wq.some(q=>inP(flat(q),x,y)))){found=b;break}}
 if(!found){toast('Nhấp lên công trình tự đặt để xóa');return}snapshotPlaced();placed=placed.filter(b=>b.id!==found.id);persistPlaced();updateBuildPanel();need=1}
function undoPlaced(){if(!buildUndo.length)return;buildRedo.push(copyPlaced());placed=buildUndo.pop();persistPlaced();updateBuildPanel();need=1}
function redoPlaced(){if(!buildRedo.length)return;buildUndo.push(copyPlaced());placed=buildRedo.pop();persistPlaced();updateBuildPanel();need=1}
function setBuildMode(on){buildMode=on?1:0;$('#bp').classList.toggle('show',!!on);$('#ed').classList.toggle('on',!!on);buildHover=null;need=1;if(on)toast('Chế độ xây dựng: nhấp để đặt, nhấp phải để xóa');else toast('Đã thoát chế độ xây dựng')}
$('#ed').onclick=()=>setBuildMode(!buildMode);$('#bpx').onclick=()=>setBuildMode(false);
$('#bp-types').innerHTML=TY.map((t,i)=>`<button data-type="${i}" title="${esc(t[0])}"><i style="background:${t[1]}"></i><span>${esc(t[0])}</span></button>`).join('');
$('#bp-types').onclick=e=>{const b=e.target.closest('[data-type]');if(b){buildType=+b.dataset.type;updateBuildPanel()}};
$('#bp-tools').onclick=e=>{const b=e.target.closest('[data-build-tool]');if(b){buildTool=b.dataset.buildTool;updateBuildPanel()}};
$('#bsize').oninput=e=>{buildSize=+e.target.value;updateBuildPanel();need=1};
$('#bheight').oninput=e=>{buildHeight=+e.target.value;updateBuildPanel()};
$('#bundo').onclick=undoPlaced;$('#bredo').onclick=redoPlaced;
$('#bsave').onclick=()=>{if(persistPlaced())toast('Đã lưu công trình trên thiết bị này')};
$('#bexport').onclick=()=>{const blob=new Blob([JSON.stringify(placed.map(({id,t,cx,cy,w,d,height})=>({id,t,x:cx,y:cy,w,d,height})),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='hnue-map-builds.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$('#bimport').onclick=()=>$('#bfile').click();
$('#bfile').onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(String(reader.result));if(!Array.isArray(data))throw new TypeError('Tệp phải chứa danh sách công trình');const ids=new Set,next=data.map((q,i)=>{if(!q||![q.x,q.y,q.w,q.d,q.height,q.t].every(Number.isFinite)||!Number.isInteger(q.t)||q.t<0||q.t>=TY.length||q.w<=0||q.d<=0||q.height<=0)throw new TypeError(`Công trình thứ ${i+1} không hợp lệ`);const id=typeof q.id=='string'&&q.id?q.id:`import-${i+1}`;if(ids.has(id))throw new TypeError(`ID công trình bị trùng: ${id}`);ids.add(id);return buildFrom({...q,id})});snapshotPlaced();placed=next;if(persistPlaced()){need=1;toast(`Đã nhập ${placed.length} công trình`)} }catch(err){console.error('Không nhập được bản dựng:',err);toast('Không thể nhập JSON — kiểm tra định dạng tệp')}e.target.value=''};reader.readAsText(file)};
$('#bclear').onclick=()=>{if(!placed.length)return toast('Chưa có công trình tự đặt');if(!confirm(`Xóa ${placed.length} công trình tự đặt?`))return;snapshotPlaced();placed=[];persistPlaced();updateBuildPanel();need=1};
updateBuildPanel();if(buildLoadError){console.error('Không thể nạp công trình đã lưu:',buildLoadError);toast('Không thể đọc công trình đã lưu — dữ liệu không hợp lệ')}
function hideAll(){$('#ctx').style.display='none';$('#sg').style.display='none';$('#dsg').style.display='none';$('#lyp').classList.remove('show')}
function tap(x,y,button){setG();if(buildMode){if(buildTool=='erase'||button===2)erasePlaced(x,y);else placePlaced(inv(x,y));return}for(const o of ps){if(Math.hypot(o.q[0]-x,o.q[1]-y-9)<13){return choose(o.p)}}
 for(let i=gb.length-1;i>=0;i--){const b=gb[i];if(b.st&&(inP(flat(b.st),x,y)||inP(flat(b.sb),x,y)||b.wq.some(q=>inP(flat(q),x,y)))){const p=PL.find(p=>p.b&&p.b.bn==b.bn)||{k:'b',name:b.bn,b,x:b.cx,y:b.cy,label:TY[b.t][0]};return choose(p,1)}}
 sel=null;$('#card').style.display='none';need=1}
const flat=a=>a.flatMap(p=>p);
function ctxMenu(x,y){const w=inv(x,y),c=$('#ctx');c.innerHTML='<div data-a="to">Chỉ đường đến đây</div><div data-a="from">Xuất phát từ đây</div><div data-a="me">Đặt vị trí của tôi ở đây</div>';c.style.display='block';c.style.left=Math.min(x,W-220)+'px';c.style.top=Math.min(y,H-150)+'px';
 c.onclick=e=>{const a=e.target.dataset.a;if(!a)return;c.style.display='none';const p={k:'x',name:'Điểm đã chọn',x:w[0],y:w[1]};if(a=='to')setDst(p);else if(a=='from'){OR=p;$('#oi').value=p.name;openDir();recalc()}else{me={x:w[0],y:w[1],acc:0,manual:1};onMe();toast('Đã đặt vị trí của bạn');}}}
function choose(p,noFly){sel=p;showCard(p);if(!noFly)fly({cx:p.x,cy:p.y,s:Math.max(V.s,2.4)});need=1;history.replaceState(null,'','#'+(p.k=='b'?'b='+encodeURIComponent(p.name):''))}
function showCard(p){const c=$('#card'),b=p.b,info=[p.label||'',b&&b.lv?b.lv+' tầng':'',b&&b.ar?Math.round(b.ar)+' m²':''].filter(Boolean).join(' · ');
 c.innerHTML=`<button class="x ib" id="cx">✕</button><h2>${p.icon?p.icon+' ':''}${esc(p.name)}</h2><p>${esc(info)||'Địa điểm'}</p><div class="row"><button class="p" id="cd">Chỉ đường</button><button id="cf">Xuất phát từ đây</button><button id="cs">Chia sẻ</button></div>`;c.style.display='block';
 $('#cx').onclick=()=>{c.style.display='none';sel=null;need=1};$('#cd').onclick=()=>setDst(p);$('#cf').onclick=()=>{OR=p;$('#oi').value=p.name;openDir();recalc()};$('#cs').onclick=()=>{const u=location.href.split('#')[0]+'#b='+encodeURIComponent(p.name);navigator.clipboard&&navigator.clipboard.writeText(u);toast('Đã sao chép liên kết')}}
// ---- tìm kiếm + chip
function look(q){q=nz(q.trim());if(!q)return[];return PL.map(p=>({p,sc:p.s.startsWith(q)?0:p.s.includes(' '+q)?1:p.s.includes(q)?2:9})).filter(o=>o.sc<9).sort((a,b)=>a.sc-b.sc||(b.p.k=='p')-(a.p.k=='p')).slice(0,9).map(o=>o.p)}
const row=p=>`<div class="it"><i>${p.icon||(p.k=='r'?'↔':'🏢')}</i><span>${esc(p.name)}</span><small>${esc(p.label)}</small></div>`;
function suggest(inp,box,list,pick){const show=l=>{box.innerHTML=l.map(row).join('')||'<div class="it"><span>Không tìm thấy</span></div>';box.style.display='block';[...box.children].forEach((d,i)=>d.onclick=()=>l[i]&&pick(l[i]))};
 inp.oninput=()=>{const l=list(inp.value);l.length||inp.value?show(l):(box.style.display='none')};inp.onfocus=()=>{if(inp.value)inp.oninput();else if(list.def)show(list.def())};inp.onkeydown=e=>{if(e.key=='Enter'){const l=list(inp.value);if(l[0])pick(l[0])}}}
suggest($('#q'),$('#sg'),look,p=>{$('#sg').style.display='none';$('#q').value=p.name;choose(p)});
const gates=PO.filter(p=>/Cổng/.test(p.label));suggest($('#oi'),$('#dsg'),Object.assign(look,{}),p=>{OR=p;$('#oi').value=p.name;$('#dsg').style.display='none';recalc()});
suggest($('#di'),$('#dsg'),look,p=>setDst(p));
const CH=[['Tất cả',null],['Ăn uống',p=>p.cat==0],['Cà phê',p=>/cà phê/i.test(p.label)],['ATM',p=>p.label=='ATM'],['Bus · Metro',p=>p.cat==3],['Thư viện',p=>/Thư viện|Nhà sách/.test(p.label)],['Khoa',p=>/Khoa/.test(p.label)],['Cổng',p=>/Cổng/.test(p.label)],['Giảng đường',null,1],['Ký túc xá',null,6]];
$('#chips').innerHTML=CH.map((c,i)=>`<button data-i="${i}" class="${i?'':'on'}">${c[0]}</button>`).join('');
$('#chips').onclick=e=>{const b=e.target.closest('button');if(!b)return;const c=CH[b.dataset.i];document.querySelectorAll('#chips button').forEach(x=>x.classList.toggle('on',x==b));hi=null;chip=null;
 if(c[2]!==undefined){hi=new Set(bs.filter(x=>x.t==c[2]).map(x=>x.bn));const l=PL.filter(p=>p.b&&hi.has(p.name)).slice(0,12);listBox(l)}else if(c[1]){chip={f:c[1]};const l=PO.filter(c[1]).sort((a,b)=>Math.hypot(a.x-V.cx,a.y-V.cy)-Math.hypot(b.x-V.cx,b.y-V.cy));listBox(l.slice(0,12))}else $('#sg').style.display='none';need=1};
function listBox(l){const b=$('#sg');b.innerHTML=l.map(row).join('');b.style.display=l.length?'block':'none';[...b.children].forEach((d,i)=>d.onclick=()=>{b.style.display='none';choose(l[i])})}
// ---- chỉ đường
function openDir(){$('#dir').classList.add('show')}
function setDst(p){DS=p;$('#di').value=p.name;$('#card').style.display='none';openDir();if(!OR&&!me){$('#oi').focus();toast('Chọn điểm xuất phát hoặc bật định vị');locate(1)}recalc()}
$('#dirb').onclick=openDir;$('#dx').onclick=()=>{$('#dir').classList.remove('show');RT=null;NAV.on=0;$('#nav').style.display='none';need=1};
$('#sw').onclick=()=>{[OR,DS]=[DS,OR];$('#oi').value=OR?OR.name:'';$('#di').value=DS?DS.name:'';recalc()};
$('#mw').onclick=()=>{speed=1.35;$('#mw').classList.add('on');$('#mb').classList.remove('on');recalc()};$('#mb').onclick=()=>{speed=4.2;$('#mb').classList.add('on');$('#mw').classList.remove('on');recalc()};
const ICO=t=>`<svg viewBox="0 0 24 24" style="transform:rotate(${t}deg)"><path d="M12 20V5M6 11l6-6 6 6"/></svg>`,FLAG='<svg viewBox="0 0 24 24"><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></svg>',fm=d=>d>=1000?(d/1000).toFixed(1)+' km':Math.round(d/5)*5+' m';
function recalc(keep){const o=OR||(me?{k:'x',name:'Vị trí của tôi',x:me.x,y:me.y}:null);if(!o||!DS){RT=null;$('#sum').style.display=$('#stp').style.display='none';need=1;return}
 const r=findRoute(o,DS);if(!r){RT=null;$('#sum').style.display='block';$('#sum').innerHTML='<span>Không tìm được đường đi giữa hai điểm này.</span>';$('#stp').style.display='none';need=1;return}
 RT=r;RT.steps=mkSteps(r);const min=Math.max(1,Math.round(r.len/speed/60));$('#sum').style.display='block';$('#sum').innerHTML=`<b>${min} phút</b><span>${fm(r.len)} · ${speed>2?'xe đạp':'đi bộ'}</span>`;
 $('#stp').style.display='block';$('#stp').innerHTML=RT.steps.map((s,i)=>`<div class="st" data-i="${i}">${s.fin?FLAG:ICO(s.turn)}<span>${esc(s.text)}</span><small>${s.fin?'':fm(s.d)}</small></div>`).join('');
 $('#stp').onclick=e=>{const d=e.target.closest('.st');if(d){const s=RT.steps[d.dataset.i];fly({cx:s.at[0],cy:s.at[1],s:Math.max(V.s,3)})}};
 if(!keep&&!NAV.on){const xs=r.pts.map(p=>p[0]),ys=r.pts.map(p=>p[1]);fly(fitBox(Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys),70,W>700?420:0))}need=1}
// ---- định vị + dẫn đường
let watch=0,NAVFOLLOW=0;const NAV={on:0,rr:0,said:-1,prog:0};
function locate(quiet){if(!navigator.geolocation){toast('Trình duyệt không hỗ trợ định vị — nhấn giữ bản đồ để đặt vị trí');return}
 if(!watch)watch=navigator.geolocation.watchPosition(p=>{const[x,y]=ll(p.coords.latitude,p.coords.longitude);if(me&&me.manual&&SIM.t)return;const first=!me;me={x,y,acc:p.coords.accuracy,hd:p.coords.heading};onMe();if(first&&!quiet)fly({cx:x,cy:y,s:Math.max(V.s,2.2)});if(first&&(Math.abs(x)>D.ext[2]||Math.abs(y)>D.ext[3]))toast('Bạn đang ở ngoài khu vực bản đồ trường')},e=>toast('Không lấy được vị trí ('+e.message+') — nhấn giữ bản đồ để đặt vị trí'),{enableHighAccuracy:true,maximumAge:2000,timeout:20000});
 if(me&&!quiet)fly({cx:me.x,cy:me.y,s:Math.max(V.s,2.4)})}
$('#lc').onclick=()=>locate();
function onMe(){need=1;if(RT&&!OR&&$('#dir').classList.contains('show')&&!NAV.on&&!RT.fixed)recalc(1);if(!NAV.on||!RT)return;let best=1e9,bi=0,bt=0;const P=RT.pts;for(let i=0;i<P.length-1;i++){const s={a:P[i],b:P[i+1]},[t,px,py]=proj(s,me.x,me.y),d=Math.hypot(px-me.x,py-me.y);if(d<best){best=d;bi=i;bt=t}}
 const prog=RT.cum[bi]+bt*(RT.cum[bi+1]-RT.cum[bi]);NAV.prog=prog;if(best>35&&Date.now()-NAV.rr>8000){NAV.rr=Date.now();OR=null;toast('Đang tính lại đường…');recalc(1);return}
 const rem=RT.len-prog,st=RT.steps.find(s=>s.s0>prog+3)||RT.steps[RT.steps.length-1],dd=st.s0-prog;
 $('#nav').innerHTML=`<div class="m">${st.fin?FLAG:ICO(st.turn)}<div><b>${st.fin?esc(st.text):'Sau '+fm(Math.max(dd,0))+': '+esc(st.text)}</b><small>Còn ${fm(rem)} · ${Math.max(1,Math.round(rem/speed/60))} phút</small></div><button id="nx">Dừng</button></div>`;$('#nx').onclick=stopNav;
 if($('#oV').checked&&dd<35&&NAV.said!==st){NAV.said=st;speakVietnamese((st.fin?'':'Sau '+Math.round(dd)+' mét, ')+st.text)}
 if(rem<12){toast('Bạn đã đến nơi');stopNav();return}
 V.cx=me.x;V.cy=me.y;if($('#oH').checked&&me.hd!=null)V.r=-me.hd*Math.PI/180}
function stopNav(){NAV.on=0;SIM.t&&clearInterval(SIM.t);SIM.t=0;$('#nav').style.display='none';need=1}
$('#go').onclick=()=>{if(!RT){toast('Hãy chọn điểm đến trước');return}if(!me){me={x:RT.pts[0][0],y:RT.pts[0][1],acc:0,manual:1};locate(1)}if(W<700)$('#dir').classList.remove('show');NAV.on=1;NAV.said=-1;$('#nav').style.display='block';fly({cx:me.x,cy:me.y,s:Math.max(V.s,3.2),t:.62});onMe()};
const SIM={t:0};$('#sim').onclick=()=>{if(!RT){toast('Hãy chọn điểm đến trước');return}stopNav();let p=0;const P=RT.pts,C=RT.cum;NAV.on=1;$('#nav').style.display='block';RT.fixed=1;
 SIM.t=setInterval(()=>{p+=1.1;if(p>=RT.len){stopNav();return}let i=0;while(C[i+1]<p)i++;const f=(p-C[i])/(C[i+1]-C[i]||1);me={x:P[i][0]+(P[i+1][0]-P[i][0])*f,y:P[i][1]+(P[i+1][1]-P[i][1])*f,acc:0,hd:brg(P[i],P[i+1]),manual:1};V.r+=((-me.hd*Math.PI/180)-V.r)*0*1;onMe()},110);fly({s:Math.max(V.s,3.2)})};
// ---- game ở góc
$('#gbtn').onclick=()=>{$('#gfr').src='game.html';$('#gmod').style.display='block'};const closeG=()=>{$('#gmod').style.display='none';$('#gfr').src='about:blank'};$('#gx').onclick=closeG;addEventListener('message',e=>{if(e.data=='close-game')closeG()});
addEventListener('keydown',e=>{if(e.key=='Escape'){closeG();hideAll()}if(e.key=='/'&&document.activeElement.tagName!='INPUT'){e.preventDefault();$('#q').focus()}});
// ---- khởi động
resize();{const h=D.home,f=fitBox(h[0],h[1],h[2],h[3],40);Object.assign(V,f)}requestAnimationFrame(loop);
const hs0=decodeURIComponent((location.hash.match(/b=([^&]*)/)||[])[1]||'');if(hs0){const p=PL.find(p=>p.name==hs0);if(p)setTimeout(()=>choose(p),200)}
