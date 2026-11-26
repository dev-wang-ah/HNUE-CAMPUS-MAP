// ---------- nhân vật
const pl={x:0,y:0,d:'d',f:0,sh:'#2f6fe0',hr:'#2a1a12'},keys={},NP=[];let mode='man',gps=null,warned=0,tgt=null,anim=0,tm=0,camX=0,camY=0,Z=3,place='',pt0=0;
function spawn(x,y){for(let r=0;r<200;r+=3)for(let a=0;a<6.28;a+=.5){const X=x+Math.cos(a)*r,Y=y+Math.sin(a)*r;if(free(X,Y))return[X,Y]}return[x,y]}
{let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;const p=D.hn[0];for(let j=0;j<p.length;j+=2){x0=Math.min(x0,p[j]);x1=Math.max(x1,p[j]);y0=Math.min(y0,p[j+1]);y1=Math.max(y1,p[j+1])}
 const s=spawn((x0+x1)/2,(y0+y1)/2);pl.x=s[0];pl.y=s[1];
 const SH=['#e04a4a','#f2a93b','#4aa86b','#8a5ad6','#e86aa8','#3f7fd8','#f4f4f4'],HR2=['#1a1210','#3a2418','#6a4a2a','#c8a050'];
 for(let i=0;i<26&&NP.length<22;i++){const x=x0+hash(i,1)*(x1-x0),y=y0+hash(1,i)*(y1-y0);if(inPoly(p,x,y)&&free(x,y))NP.push({x,y,d:'d',f:0,sh:SH[i%7],hr:HR2[i%4],t:0,vx:0,vy:0})}}
function step(e,dx,dy,col=1){if(!col){e.x+=dx;e.y+=dy;return}const nx=e.x+dx;if(free(nx,e.y))e.x=nx;const ny=e.y+dy;if(free(e.x,ny))e.y=ny}
const face=(e,dx,dy)=>{e.d=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d')};
function update(dt){let mv=0;anim+=dt*8;
 if(mode=='gps'&&gps){const dx=gps.x-pl.x,dy=gps.y-pl.y,L=Math.hypot(dx,dy);if(L>.3){const s=Math.min(L,14*dt);step(pl,dx/L*s,dy/L*s,0);face(pl,dx,dy);mv=L>.8}}
 else{let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);
  if(dx||dy)tgt=null;else if(tgt){const ex=tgt.x-pl.x,ey=tgt.y-pl.y,L=Math.hypot(ex,ey);if(L<.6)tgt=null;else{dx=ex/L;dy=ey/L}}
  if(dx||dy){const L=Math.hypot(dx,dy),sp=(keys.shift?9:5)*dt,ox=pl.x,oy=pl.y;step(pl,dx/L*sp,dy/L*sp);face(pl,dx,dy);mv=1;if(tgt&&Math.hypot(pl.x-ox,pl.y-oy)<sp*.2)tgt=null}}
 pl.f=mv?1+((anim|0)%2):0;
 for(const n of NP){if(Math.abs(n.x-pl.x)>150||Math.abs(n.y-pl.y)>150)continue;n.t-=dt;if(n.t<=0){n.t=1+Math.random()*3;const a=Math.random()*6.28,s=Math.random()<.3?0:1;n.vx=Math.cos(a)*s;n.vy=Math.sin(a)*s}
  if(n.vx||n.vy){const ox=n.x,oy=n.y;step(n,n.vx*1.5*dt,n.vy*1.5*dt);face(n,n.vx,n.vy);n.f=1+((anim|0)%2);if(n.x==ox&&n.y==oy)n.t=0}else n.f=0}
 pl.x=Math.max(D.ext[0],Math.min(D.ext[2],pl.x));pl.y=Math.max(D.ext[1],Math.min(D.ext[3],pl.y))}
