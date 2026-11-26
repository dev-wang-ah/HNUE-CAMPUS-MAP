// ---------- sprite: viền pixel + toà nhà đùn khối
function pix(c){const w=c.width,h=c.height,q=c.getContext('2d'),im=q.getImageData(0,0,w,h),d=im.data,f=new Uint8Array(w*h);
 for(let i=0;i<w*h;i++){if(d[i*4+3]>=110){f[i]=1;d[i*4+3]=255}else d[i*4+3]=0}
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(!f[i]&&(f[i-1]||f[i+1]||f[i-w]||f[i+w])){const k=i*4;d[k]=38;d[k+1]=26;d[k+2]=32;d[k+3]=255}}
 q.putImageData(im,0,0);return f}
// --- sprite tuỳ chỉnh: nạp PNG trong sprites/ đè lên sprite tự sinh
const WINC=new Set(['143,191,232','111,164,216']);let warned2=0;
function scan(c,k){k=k||1;const w=c.width,d=c.getContext('2d').getImageData(0,0,w,c.height).data,r=[];for(let i=0;i<d.length;i+=4)if(d[i+3]>=110){const R=d[i],G=d[i+1],B=d[i+2];if((Math.abs(R-143)<13&&Math.abs(G-191)<13&&Math.abs(B-232)<13)||(Math.abs(R-111)<13&&Math.abs(G-164)<13&&Math.abs(B-216)<13))r.push([((i>>2)%w)/k,((i>>2)/w|0)/k])}return r}
function flags(c){const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data,f=new Uint8Array(c.width*c.height);for(let i=0;i<f.length;i++)f[i]=d[i*4+3]>=110?1:0;return f}
// flags thu về kích thước sprite gốc (gộp khối k×k: khối có pixel đục => 1)
function faBuf(c,k){const w=c.width,h=c.height,d=c.getContext('2d').getImageData(0,0,w,h).data,W=Math.ceil(w/k),f=new Uint8Array(W*Math.ceil(h/k));for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>=110)f[((y/k)|0)*W+((x/k)|0)]=1;return f}
function loadImg(src,fn){const im=new Image();im.onload=()=>{const c=mk(im.width,im.height);c.getContext('2d').drawImage(im,0,0);fn(c)};im.src=src}
function ovr(b){const m=SPR.b[b.i];if(!m)return;loadImg((PACKED&&PACKED['b'+b.i])||m.f,c=>{const k=m.s||1;let f=[];
 let fa=null;try{fa=faBuf(c,k);f=scan(c,k)}catch(e){if(!warned2){warned2=1;toast('Mở bằng tools/serve.py (localhost) để sprite tuỳ chỉnh có hiệu ứng mờ & đèn đêm')}}
 if(k>1){const W=Math.max(1,Math.round(c.width*Z/k)),H=Math.max(1,Math.round(c.height*Z/k)),s=mk(W,H),q2=s.getContext('2d');q2.imageSmoothingEnabled=true;q2.imageSmoothingQuality='high';q2.drawImage(c,0,0,W,H);b.sp=s}
 else b.sp=c;
 b.fa=fa;b.wn=f;b.sw=c.width/k;b.sh=c.height/k;b.px=k>1?1:0;b.ox=m.ox;b.oy=m.oy})}
function ovrT(k,T){const m=SPR.t[k];if(!m)return;loadImg((PACKED&&PACKED['t'+k])||m.f,c=>{const k5=m.s||1;let f=null;try{f=k5>1?faBuf(c,k5):flags(c)}catch(e){}T.c5=c;T.k5=k5;T.f=f;T.w=c.width/k5;T.h=c.height/k5;treeFit(T)})}
// cây đã có bản x2.5 (T.c5): dựng bản pre-scale đúng cỡ màn hình Z* (mượt như công trình), T.w/h giữ toạ độ 1x cho fade & vẽ
function treeFit(T){const s=T.k5||1,W=Math.max(1,Math.round(T.c5.width*Z/s)),H=Math.max(1,Math.round(T.c5.height*Z/s)),c=mk(W,H),q=c.getContext('2d');q.imageSmoothingEnabled=true;q.imageSmoothingQuality='high';q.drawImage(T.c5,0,0,W,H);T.c=c}
function bsp(b){if(b.sp)return b.sp;const Hp=Math.round(b.H*1.5),w=Math.ceil((b.x1-b.x0)*P)+6,h=Math.ceil((b.y1-b.y0)*P)+Hp+6,c=mk(w,h),q=c.getContext('2d'),n=b.p.length/2,pt=[],wn=[];
 for(let j=0;j<n;j++)pt.push([Math.round((b.p[j*2]-b.x0)*P)+3,Math.round((b.p[j*2+1]-b.y0)*P)+Hp+3]);
 let A=0;for(let j=0;j<n;j++){const a=pt[j],e=pt[(j+1)%n];A+=a[0]*e[1]-e[0]*a[1]}
 const sg=A>0?1:-1,wc=b.t?WC[b.t]:HW[b.hs*4|0],rc=b.t?RC[b.t]:HR[(b.hs*4+1|0)%4],tile=b.t==0||b.t==5||b.t==3;
 const poly=dy=>{q.beginPath();pt.forEach((a,j)=>j?q.lineTo(a[0],a[1]+dy):q.moveTo(a[0],a[1]+dy));q.closePath()};
 const ed=[];for(let j=0;j<n;j++){const a=pt[j],e=pt[(j+1)%n],dx=e[0]-a[0],dy=e[1]-a[1],L=Math.hypot(dx,dy)||1,nx=sg*dy/L,ny=-sg*dx/L;if(ny>.08)ed.push({a,e,nx,L})}
 ed.sort((u,v)=>u.a[1]+u.e[1]-v.a[1]-v.e[1]);
 const nf=Math.max(1,Math.round(b.H/3.3)),bd=Hp/nf;let big=null;
 for(const E of ed){q.fillStyle=shade(wc,E.nx<-.35?1.06:E.nx>.35?.76:.9);q.beginPath();q.moveTo(E.a[0],E.a[1]);q.lineTo(E.e[0],E.e[1]);q.lineTo(E.e[0],E.e[1]-Hp);q.lineTo(E.a[0],E.a[1]-Hp);q.closePath();q.fill();
  q.strokeStyle='rgba(50,30,24,.55)';q.lineWidth=1;q.beginPath();q.moveTo(E.a[0],E.a[1]);q.lineTo(E.e[0],E.e[1]);q.stroke();
  if(bd>=4&&E.L>=6)for(let f=0;f<nf;f++)for(let s=4;s<E.L-3;s+=5){const t=s/E.L,x=Math.round(E.a[0]+(E.e[0]-E.a[0])*t),y=Math.round(E.a[1]+(E.e[1]-E.a[1])*t-(f+.62)*bd);q.fillStyle=f&1?'#6fa4d8':'#8fbfe8';q.fillRect(x-1,y-1,2,2);q.fillStyle='rgba(255,255,255,.55)';q.fillRect(x-1,y-1,1,1);wn.push([x,y])}
  if(!big||E.L>big.L)big=E}
 if(big&&big.L>5){const x=Math.round((big.a[0]+big.e[0])/2),y=Math.round((big.a[1]+big.e[1])/2);q.fillStyle='#e8d8a0';q.fillRect(x-3,y-5,6,1);q.fillStyle='#5a3a24';q.fillRect(x-2,y-4,4,4);q.fillStyle='#b88a52';q.fillRect(x-2,y-4,1,4);if(b.t==1||b.t==2){q.fillStyle='#d8d0c0';q.fillRect(x-4,y-1,8,1)}}
 q.fillStyle=rc;poly(-Hp);q.fill();q.save();poly(-Hp);q.clip();
 if(tile){q.fillStyle='rgba(0,0,0,.16)';for(let y=0;y<h;y+=3)q.fillRect(0,y,w,1);q.fillStyle='rgba(255,255,255,.1)';for(let y=1;y<h;y+=3)q.fillRect(0,y,w,1)}
 else{q.fillStyle='rgba(255,255,255,.1)';q.fillRect(0,0,w,h);const fp=pt.flat(),na=b.ar>200?3:b.ar>80?1:0;for(let k=0;k<na;k++){const x=Math.round(b.x0*0+3+hash(b.i,k)*(w-6)),y=Math.round(3+hash(k,b.i)*(h-6));if(inPoly(fp,x,y+Hp)&&inPoly(fp,x+5,y+Hp+4)){q.fillStyle='#8d949e';q.fillRect(x,y+1,5,4);q.fillStyle='#d3d8de';q.fillRect(x,y,5,2)}}}
 q.restore();q.strokeStyle=shade(rc,1.3);q.lineWidth=1;poly(-Hp);q.stroke();
 b.fa=pix(c);b.wn=scan(c);b.sw=w;b.sh=h;b.px=0;b.sp=c;ovr(b);return c}
const TSP={};
function tsp(r,v){const k=r+'_'+v;if(TSP[k])return TSP[k];const w=r*2+6,h=r*3+6,c=mk(w,h),q=c.getContext('2d'),cx=w/2,cy=r+3,G=['#2b6a35','#3b8a40','#58a84c','#82c860'],R=['#8a2a1e','#c8402c','#e8643a','#f58a4a'];
 q.fillStyle='#5a3a22';const tr=Math.floor(cy+r*.5);q.fillRect(Math.floor(cx)-1,tr,3,h-3-tr);q.fillStyle='#7a5232';q.fillRect(Math.floor(cx)-1,tr,1,h-3-tr);
 for(let y=0;y<=r*2+3;y++)for(let x=0;x<w;x++){const dx=x+.5-cx,dy=(y+.5-cy)*1.05,d=Math.hypot(dx,dy);if(d<=r+hash(x,y)*1.3){const l=-(dx*.5+dy*.8)/r+(hash(x*3,y*5)-.5)*.5,i=l>.45?3:l>.1?2:l>-.35?1:0;q.fillStyle=(v&&hash(x*7,y*3)<.5?R:G)[i];q.fillRect(x,y,1,1)}}
 const f=pix(c),c5=mk(Math.round(w*2.5),Math.round(h*2.5)),q5=c5.getContext('2d');q5.imageSmoothingEnabled=false;q5.drawImage(c,0,0,Math.round(w*2.5),Math.round(h*2.5));
 const T={c5:c5,k5:2.5,f:f,w:w,h:h};treeFit(T);ovrT(k,T);return TSP[k]=T}
const CHS={};
function chSp(d,f,sh,hr){const k=d+f+sh+hr;if(CHS[k])return CHS[k];const c=mk(12,22),q=c.getContext('2d'),R=(x,y,w,h,s)=>{q.fillStyle=s;q.fillRect(x,y,w,h)},sk='#f0c298',pn='#34456e',sb='#3b2a20',bp='#8a5a2a',fr=d=='d'||d=='u',l1=f==1?1:0,l2=f==2?1:0,sd=d=='l'?-1:1;
 if(fr){R(3,15,2,5-l1,pn);R(7,15,2,5-l2,pn);R(3,20-l1,2,1,sb);R(7,20-l2,2,1,sb);R(3,9,6,6,sh);R(2,10,1,4,sh);R(9,10,1,4,sh);R(2,14,1,1,sk);R(9,14,1,1,sk);if(d=='u'){R(3,9,6,5,bp);R(3,9,6,1,'#5a3a1a')}else R(5,9,2,3,shade(sh,1.25))}
 else{const s=f==1?1:f==2?-1:0;R(5+s,15,2,5,pn);R(5-s,15,2,5,'#2a3860');R(5+s,20,2,1,sb);R(5-s,20,2,1,sb);R(4,9,4,6,sh);R(d=='l'?8:2,10,2,4,bp);R(5,10,2,4,shade(sh,.85));R(5,14,2,1,sk)}
 R(3,2,6,6,sk);if(d=='d'){R(3,1,6,2,hr);R(3,3,1,2,hr);R(8,3,1,2,hr);R(4,5,1,1,'#222');R(7,5,1,1,'#222')}else if(d=='u')R(3,1,6,7,hr);else{R(3,1,6,2,hr);R(d=='l'?6:3,3,3,4,hr);R(d=='l'?3:8,5,1,1,'#222')}
 pix(c);return CHS[k]=c}
