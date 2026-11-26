// ---------- vẽ
let dtF=.016,SX=.4,SY=.28,SK=0,SAL=72;
function render(){const w=lo.width,h=lo.height,W=cv.width,H=cv.height;camX=Math.round(pl.x*P-w/2);camY=Math.round(pl.y*P-h*.62);
 // mat dat ve thang man hinh: chunk x2.5 thu ve xZ (muot dung bang cong trinh x2.5), khong qua buffer 1x
 g.setTransform(1,0,0,1,0,0);g.fillStyle='#7fb35a';g.fillRect(0,0,cv.width,cv.height);
 const c0=Math.floor(camX/CS),c1=Math.floor((camX+w)/CS),r0=Math.floor(camY/CS),r1=Math.floor((camY+h)/CS);let nb=0;
 g.imageSmoothingEnabled=false;
 for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++){let ch=CK.get(c+','+r);if(!ch&&nb<2&&(c+1)*CS/P>D.ext[0]-60&&c*CS/P<D.ext[2]+60&&(r+1)*CS/P>D.ext[1]-60&&r*CS/P<D.ext[3]+60){ch=chunk(c,r);nb++}if(ch)g.drawImage(ch,(c*CS-MG-camX)*Z,(r*CS-MG-camY)*Z,FS*Z,FS*Z)}
 g.imageSmoothingEnabled=false;
 const vx0=(camX-40)/P,vx1=(camX+w+40)/P,vy0=(camY-40)/P,vy1=(camY+h+60)/P,R=[],vb=[];
 // bong do to vector truc tiep o do phan giai man hinh (bien muot, khong qua buffer 1x)
 o.setTransform(1,0,0,1,0,0);o.clearRect(0,0,lo.width,lo.height);o.setTransform(P,0,0,P,-camX,-camY);o.fillStyle='#000';
 for(const b of bl){if(b.x1<vx0||b.x0>vx1||b.y1<vy0-b.H*.7||b.y0>vy1)continue;vb.push(b);
  if(!b.shp||b.shk!==SK){const s=Math.min(b.H,30),pa=new Path2D;for(const k of[.25,.5,.75,1]){const dx=s*SX*k,dy=s*SY*k;for(let j=0;j<b.p.length;j+=2)j?pa.lineTo(b.p[j]+dx,b.p[j+1]+dy):pa.moveTo(b.p[j]+dx,b.p[j+1]+dy);pa.closePath()}b.shp=pa;b.shk=SK}
  o.fill(b.shp);R.push({y:b.y1,b})}
 o.setTransform(1,0,0,1,0,0);{const im=o.getImageData(0,0,lo.width,lo.height),d=im.data;for(let i=3;i<d.length;i+=4)d[i]=d[i]>=100?SAL:0;o.putImageData(im,0,0)}
 g.setTransform(1,0,0,1,0,0);g.filter='blur('+Z*1.4+'px)';g.imageSmoothingEnabled=true;g.drawImage(lo,0,0,lo.width*Z,lo.height*Z);g.filter='none';g.imageSmoothingEnabled=false;
 for(const t of TR){if(t.x<vx0||t.x>vx1||t.y<vy0||t.y>vy1+8)continue;g.fillStyle='rgba(20,34,24,.3)';g.fillRect((Math.round(t.x*P-camX)-t.r+1)*Z,(Math.round(t.y*P-camY)-2)*Z,t.r*2*Z,3*Z);R.push({y:t.y,t})}
 for(const n of NP)if(n.x>vx0&&n.x<vx1&&n.y>vy0&&n.y<vy1)R.push({y:n.y,e:n});R.push({y:pl.y,e:pl});
 R.sort((a,b)=>a.y-b.y);
 for(const it of R){if(it.b){const b=it.b,s=bsp(b);let tg=1;if(pl.y<b.y1+.01){const lx=Math.round(pl.x*P-b.ox),ly=Math.round(pl.y*P-b.oy);for(const dy of[-1,-7,-14]){const X=lx,Y=ly+dy;if(X>=0&&X<b.sw&&Y>=0&&Y<b.sh&&(b.fa?b.fa[Y*b.sw+X]:1)){tg=.28;break}}}
   b.al+=(tg-b.al)*Math.min(1,dtF*10);const sc=b.px?1:Z;g.globalAlpha=b.al;g.drawImage(s,(b.ox-camX)*Z,(b.oy-camY)*Z,s.width*sc,s.height*sc);g.globalAlpha=1}
  else if(it.t){const t=it.t,s=tsp(t.r,t.v),X=Math.round(t.x*P-s.w/2)-camX,Y=Math.round(t.y*P)-(s.h-3)-camY;let tg=1;if(pl.y<t.y){const lx=Math.round(t.x*P-camX)-X,ly=Math.round(t.y*P-camY)-Y;for(const dy of[-1,-7,-14]){const xx=lx,yy=ly+dy;if(xx>=0&&xx<s.w&&yy>=0&&yy<s.h&&(s.f?s.f[yy*s.w+xx]:1)){tg=.3;break}}}
   t.al+=(tg-t.al)*Math.min(1,dtF*10);g.globalAlpha=t.al;g.drawImage(s.c,X*Z,Y*Z,s.w*Z,s.h*Z);g.globalAlpha=1}
  else{const e=it.e,X=Math.round(e.x*P-camX),Y=Math.round(e.y*P-camY);g.fillStyle='rgba(0,0,0,.28)';g.fillRect((X-3)*Z,(Y-1)*Z,6*Z,2*Z);g.drawImage(chSm(chSp(e.d,e.f,e.sh,e.hr)),(X-4)*Z,(Y-14)*Z,9*Z,16*Z);
   if(e===pl){const bb=anim%2<1?1:0;g.fillStyle='#ffe27a';g.fillRect((X-1)*Z,(Y-21-bb)*Z,3*Z,Z);g.fillRect(X*Z,(Y-20-bb)*Z,Z,Z)}}
  g.imageSmoothingEnabled=false}
 // ngày / đêm + đèn cửa sổ (phủ trên cả lớp công trình)
 const[nt,dk]=tod();
 if(nt>.3){
  for(const b of vb)if(b.wn&&b.al>.6){g.fillStyle='rgb(255,226,130)';for(const k of b.wn)if(hash(k[0],k[1]+b.i)<.7)g.fillRect((b.ox-camX+k[0])*Z,(b.oy-camY+k[1])*Z,Z,Z)}}
 if(window.POST)POST();
 // nhãn tên (độ phân giải đầy đủ)
 g.font='700 12px ui-monospace,Menlo,Consolas,monospace';g.textAlign='center';g.textBaseline='middle';
 const lb=(s,x,y,col)=>{const py=y/H,sc=.92+.16*py;x=W*(.5+(x/W-.5)*sc);y=H*py/(1+.32*(1-py));g.lineWidth=4;g.strokeStyle='#1c1210';g.strokeText(s,x,y);g.fillStyle=col;g.fillText(s,x,y)};
 for(const b of vb)if(b.bn&&b.t&&Math.hypot((b.x0+b.x1)/2-pl.x,(b.y0+b.y1)/2-pl.y)<55)lb(b.bn.length>26?b.bn.slice(0,25)+'…':b.bn,((b.x0+b.x1)/2*P-camX)*Z,(b.oy+3-4-camY)*Z,'#ffe9a8');
 for(const p of D.p){const d=Math.hypot(p[2]-pl.x,p[3]-pl.y);if(d>45)continue;const X=(p[2]*P-camX)*Z,Y=(p[3]*P-camY)*Z;g.font='18px system-ui,"Apple Color Emoji","Segoe UI Emoji",sans-serif';lb(p[4],X,Y-6,'#fff');g.font='700 12px ui-monospace,Menlo,Consolas,monospace';if(d<16)lb(p[1].length>24?p[1].slice(0,23)+'…':p[1],X,Y+12,'#bfe3ff')}
 lb('BẠN',(pl.x*P-camX)*Z,(pl.y*P-camY-27)*Z,'#ffe27a')}
