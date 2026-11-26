// ---------- zoom (cuộn chuột / chụm 2 ngón / nút ＋－ / phím + -), người nhỏ hơn, ánh sáng 3D: nắng theo giờ + bóng đổ động + bevel/AO nướng vào sprite
const zb=()=>Math.max(2,Math.round(Math.min(innerWidth,innerHeight)/300));let zu=0;
function setZoom(d){zu=Math.max(1-zb(),Math.min(5,zu+(d||0)));Z=zb()+zu;lo.width=Math.ceil(innerWidth/Z)+1;lo.height=Math.ceil(innerHeight/Z)+1;o.imageSmoothingEnabled=false;if(d)toast('Zoom ×'+Z)}
addEventListener('resize',()=>setZoom(0));
cv.addEventListener('wheel',e=>{e.preventDefault();setZoom(e.deltaY<0?1:-1)},{passive:false});
addEventListener('keydown',e=>{if(e.key=='+'||e.key=='=')setZoom(1);if(e.key=='-'||e.key=='_')setZoom(-1)});
['＋','－'].forEach((t,i)=>{const b=document.createElement('button');b.className='bt';b.textContent=t;b.title='Zoom';b.onclick=()=>setZoom(i?-1:1);$('#bt').appendChild(b)});
{const ps=new Map;let pd=0,pz=0;const dist=()=>{const a=[...ps.values()];return Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])};
 cv.addEventListener('pointerdown',e=>{ps.set(e.pointerId,[e.clientX,e.clientY]);if(ps.size==2){pd=dist();pz=1}},true);
 cv.addEventListener('pointermove',e=>{if(!ps.has(e.pointerId))return;ps.set(e.pointerId,[e.clientX,e.clientY]);if(ps.size==2){const d=dist();if(d>pd*1.3){setZoom(1);pd=d}else if(d<pd/1.3){setZoom(-1);pd=d}}});
 cv.addEventListener('pointerup',e=>{const s=pz;ps.delete(e.pointerId);if(!ps.size)pz=0;if(s)e.stopImmediatePropagation()},true);cv.addEventListener('pointercancel',e=>{ps.delete(e.pointerId);if(!ps.size)pz=0})}
// --- người nhỏ hơn: 12×22 -> 9×16 (lấy mẫu tâm, giữ pixel sắc)
const CSM=new WeakMap;function chSm(c){let s=CSM.get(c);if(s)return s;s=mk(9,16);const q=s.getContext('2d'),d=c.getContext('2d').getImageData(0,0,12,22).data,im=q.createImageData(9,16);
 for(let y=0;y<16;y++)for(let x=0;x<9;x++){const a=((Math.min(21,Math.floor((y+.5)*22/16)))*12+Math.min(11,Math.floor((x+.5)*12/9)))*4,i=(y*9+x)*4;im.data[i]=d[a];im.data[i+1]=d[a+1];im.data[i+2]=d[a+2];im.data[i+3]=d[a+3]}q.putImageData(im,0,0);CSM.set(c,s);return s}
// --- nướng ánh sáng 3D vào sprite: viền sáng phía trên/trái, tối phía phải, AO sát chân, tối dần xuống dưới (giữ nguyên pixel cửa sổ)
function bake(c){const w=c.width,h=c.height,q=c.getContext('2d');let im;try{im=q.getImageData(0,0,w,h)}catch(e){return c}const d=im.data,s=new Uint8ClampedArray(d),
 a=(x,y)=>x<0||y<0||x>=w||y>=h?0:s[(y*w+x)*4+3],lm=(x,y)=>{const i=(y*w+x)*4;return s[i]*.3+s[i+1]*.59+s[i+2]*.11},
 ed=(x,y,dx,dy)=>{const X=x+dx,Y=y+dy;return !a(X,Y)||lm(X,Y)<62};
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!a(x,y)||lm(x,y)<62)continue;const i=(y*w+x)*4,R=s[i],G=s[i+1],B=s[i+2];
  if((Math.abs(R-143)<13&&Math.abs(G-191)<13&&Math.abs(B-232)<13)||(Math.abs(R-111)<13&&Math.abs(G-164)<13&&Math.abs(B-216)<13))continue;
  let f=1-.14*y/h;if(ed(x,y,0,-1))f*=1.24;else if(ed(x,y,-1,0))f*=1.1;if(ed(x,y,1,0))f*=.8;if(ed(x,y,0,1))f*=.68;else if(ed(x,y,0,2))f*=.84;
  d[i]=Math.min(255,R*f);d[i+1]=Math.min(255,G*f);d[i+2]=Math.min(255,B*f)}
 q.putImageData(im,0,0);return c}
const down0=down;down=function(c,k){return bake(down0(c,k))};
// --- mặt trời theo giờ: bóng đổ dài/ngắn, đổi hướng
function hour(){const dt=new Date();return tm?[0,12,18.2,22][tm]:dt.getHours()+dt.getMinutes()/60}
function sunCalc(){const h=hour(),nt=tod()[0];if(h<5.8||h>18.2){SX=-.25;SY=.3;SAL=26;SK=-1;return}const a=Math.max(0,Math.min(1,(h-6)/12))*Math.PI,s=Math.sin(a),L=.18+.62*Math.pow(1-s,1.5);
 SX=-Math.cos(a)*L*1.15;SY=.2+.14*(1-s);SAL=Math.round((46+34*s)*(1-nt*.7));SK=Math.round(h*4)}
const render1=render;render=function(){sunCalc();render1()};
// --- lớp ánh sáng mới: tông màu theo giờ, vignette nhẹ, tia nắng, đèn lồng + bloom cửa sổ ban đêm
function lightPass(){const[nt,dk]=tod(),W=cv.width,H=cv.height,h=hour(),T=performance.now()/1000;g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=true;
 if(dk>0){g.globalCompositeOperation='multiply';g.fillStyle=`rgb(255,${255-34*dk|0},${255-95*dk|0})`;g.fillRect(0,0,W,H)}
 g.globalCompositeOperation='lighter';
 if(nt<.95){const k=1-nt,a=Math.max(0,Math.min(1,(h-6)/12))*Math.PI,sx=W*(.5-Math.cos(a)*.55),R=Math.max(W,H)*.7,r=g.createRadialGradient(sx,-H*.15,0,sx,-H*.15,R);r.addColorStop(0,`rgba(255,${210+30*(1-dk)|0},${150+80*(1-dk)|0},${.2*k})`);r.addColorStop(1,'rgba(255,220,160,0)');g.fillStyle=r;g.fillRect(0,0,W,H);
  g.save();g.translate(W*(.5-Math.cos(a)*.6),-H*.1);g.rotate(-Math.cos(a)*.5+.25);for(let i=-3;i<=3;i++){const x=i*W*.14+Math.sin(T*.2+i)*W*.02,s2=g.createLinearGradient(x,0,x+W*.1,0);s2.addColorStop(0,'rgba(255,235,180,0)');s2.addColorStop(.5,`rgba(255,235,180,${.05*k*(.6+.4*Math.sin(T*.5+i*2))})`);s2.addColorStop(1,'rgba(255,235,180,0)');g.fillStyle=s2;g.fillRect(x,0,W*.1,H*1.6)}g.restore()}
 g.globalCompositeOperation='source-over';const v=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.42,W/2,H/2,Math.max(W,H)*.78);v.addColorStop(0,'rgba(8,10,30,0)');v.addColorStop(1,`rgba(8,10,30,${.16+.22*nt})`);g.fillStyle=v;g.fillRect(0,0,W,H);
 if(nt>.05){g.globalCompositeOperation='lighter';const px=(pl.x*P-camX)*Z,py=(pl.y*P-camY-6)*Z,R=Z*P*15*(1+.03*Math.sin(T*9)),l=g.createRadialGradient(px,py,0,px,py,R);l.addColorStop(0,`rgba(255,200,120,${.55*nt})`);l.addColorStop(.45,`rgba(255,150,70,${.2*nt})`);l.addColorStop(1,'rgba(255,150,70,0)');g.fillStyle=l;g.fillRect(px-R,py-R,R*2,R*2);
  let n=0;for(const b of bl){if(!b.wn||b.al<.6||b.ox>camX+lo.width||b.ox+b.sw<camX||b.oy>camY+lo.height||b.oy+b.sh<camY)continue;for(let i=0;i<b.wn.length&&n<420;i+=9,n++){const k=b.wn[i],X=(b.ox-camX+k[0])*Z,Y=(b.oy-camY+k[1])*Z,r=Z*7,q=g.createRadialGradient(X,Y,0,X,Y,r);q.addColorStop(0,`rgba(255,214,120,${.4*nt})`);q.addColorStop(1,'rgba(255,214,120,0)');g.fillStyle=q;g.fillRect(X-r,Y-r,r*2,r*2)}}}
 g.globalCompositeOperation='source-over'}
setZoom(0);
