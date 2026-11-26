// ---------- gameplay: thu thập "Sách tri thức" ở 24 công trình, combo, cấp bậc, âm thanh 8-bit, lưu tiến độ
const RK=['Tân sinh viên','Sinh viên năng động','Thủ lĩnh lớp','Thạc sĩ tương lai','Giảng viên trẻ','Giáo sư HNUE'],LS=window.localStorage||{};
let done=new Set,score=+LS.hnueScore||0,combo=0,lastT=-99,AC,mus=0;try{done=new Set(JSON.parse(LS.hnueDone||'[]'))}catch(e){}
const IT=PL.map((b,i)=>({b,h:hash(i,77)})).sort((a,b)=>a.h-b.h).slice(0,24).map(o=>{const s=spawn((o.b.x0+o.b.x1)/2,o.b.y1+3);return{x:s[0],y:s[1],n:o.b.bn,got:done.has(o.b.bn)}});
const bk=mk(8,9),bq=bk.getContext('2d');[[1,1,6,7,'#26141c'],[2,2,4,5,'#e8b83a'],[2,2,4,1,'#fff0a8'],[3,4,2,1,'#8a4a1a'],[3,6,2,1,'#8a4a1a']].forEach(([x,y,w,h,c])=>{bq.fillStyle=c;bq.fillRect(x,y,w,h)});
const hud=document.createElement('div');hud.id='gm';hud.className='pn';document.body.appendChild(hud);
const sb=document.createElement('button');sb.className='bt';sb.id='bs';sb.title='Âm thanh';$('#bt').appendChild(sb);
function beep(f,d,t,v,s){if(!mus&&v!=.07)return;try{AC=AC||new AudioContext;const a=AC.createOscillator(),n=AC.createGain(),T=AC.currentTime+(s||0);a.type=t||'square';a.frequency.value=f;n.gain.setValueAtTime(v||.05,T);n.gain.exponentialRampToValueAtTime(.0001,T+d);a.connect(n);n.connect(AC.destination);a.start(T);a.stop(T+d)}catch(e){}}
sb.onclick=()=>{mus=!mus;sb.classList.toggle('off',!mus);if(mus)AC=AC||new AudioContext};mus=1;
const PE=[261,294,330,392,440,523];setInterval(()=>{if(mus&&AC&&AC.state=='running'){const n=PE[Math.random()*6|0];beep(n,.5,'triangle',.025);if(Math.random()<.3)beep(n*1.5,.6,'sine',.015,.2)}},700);
addEventListener('pointerdown',()=>{AC=AC||new AudioContext;AC.resume&&AC.resume()},{once:true});
function rank(){return RK[Math.min(5,done.size/5|0)]}
function save(){LS.hnueDone=JSON.stringify([...done]);LS.hnueScore=score}
function collect(it){it.got=true;done.add(it.n);const now=performance.now()/1000;combo=now-lastT<25?combo+1:0;lastT=now;const pts=10+combo*5;score+=pts;save();
 [523,659,784,1047].forEach((f,i)=>beep(f,.12,'square',.07,i*.06));toast(`${it.n} · +${pts}${combo?' (combo ×'+(combo+1)+')':''}`);
 if(done.size==IT.length){toast('Bạn đã thu đủ 24 cuốn sách — danh hiệu Giáo sư HNUE!');[523,659,784,1047,1319].forEach((f,i)=>beep(f,.3,'triangle',.08,i*.12))}}
function gameDraw(){g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=false;let nr=null,nd=1e9;const W=cv.width,H=cv.height;
 for(const it of IT){if(it.got)continue;const d=Math.hypot(it.x-pl.x,it.y-pl.y);if(d<nd){nd=d;nr=it}if(d<1.6)collect(it);
  const X=(it.x*P-camX)*Z,Y=(it.y*P-camY-8-Math.sin(performance.now()/260+it.x)*2)*Z;if(X>-40&&X<W+40&&Y>-40&&Y<H+40){const r=g.createRadialGradient(X,Y,0,X,Y,Z*16);r.addColorStop(0,'rgba(255,220,120,.55)');r.addColorStop(1,'rgba(255,220,120,0)');g.globalCompositeOperation='lighter';g.fillStyle=r;g.fillRect(X-Z*16,Y-Z*16,Z*32,Z*32);g.globalCompositeOperation='source-over';g.drawImage(bk,X-4*Z,Y-4.5*Z,8*Z,9*Z)}}
 if(nr&&nd>6){const a=Math.atan2(nr.y-pl.y,nr.x-pl.x),cx=W/2,cy=H/2,R=Math.min(W,H)*.36,X=cx+Math.cos(a)*R,Y=cy+Math.sin(a)*R;g.save();g.translate(X,Y);g.rotate(a);g.fillStyle='#ffe27a';g.strokeStyle='#26141c';g.lineWidth=3;g.beginPath();g.moveTo(12,0);g.lineTo(-8,-9);g.lineTo(-4,0);g.lineTo(-8,9);g.closePath();g.stroke();g.fill();g.restore()}
 hud.innerHTML=`<div class=k>Sách tri thức</div><div class=v>${done.size}<span>/${IT.length}</span></div><div class=bar><i style="width:${done.size/IT.length*100}%"></i></div><div class=m>${rank()} · ${score} điểm${combo?' · combo ×'+(combo+1):''}</div><div class=s>${nr?'Gần nhất: '+esc(nr.n)+' · '+Math.round(nd)+' m':'Hoàn thành tất cả!'}</div>`}
// ---------- ánh sáng kiểu shader 3D (lớp phủ pixel-art): nắng xiên mềm, vignette, đèn lồng, bloom cửa sổ
function lightPass(){const[nt,dk]=tod(),W=cv.width,H=cv.height;g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=true;
 if(nt<1){g.globalCompositeOperation='soft-light';const s=g.createLinearGradient(0,0,W,H);s.addColorStop(0,`rgba(255,232,170,${.75*(1-nt)})`);s.addColorStop(.5,'rgba(128,128,128,0)');s.addColorStop(1,`rgba(30,40,110,${.7*(1-nt)})`);g.fillStyle=s;g.fillRect(0,0,W,H);
  g.globalCompositeOperation='lighter';const rg=g.createRadialGradient(W*.15,-H*.1,0,W*.15,-H*.1,Math.max(W,H)*.8);rg.addColorStop(0,`rgba(255,226,150,${.22*(1-nt)})`);rg.addColorStop(1,'rgba(255,226,150,0)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
 g.globalCompositeOperation='source-over';const px=(pl.x*P-camX)*Z,py=(pl.y*P-camY-10)*Z,v=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);v.addColorStop(0,'rgba(8,10,30,0)');v.addColorStop(1,`rgba(8,10,30,${.35+.25*nt})`);g.fillStyle=v;g.fillRect(0,0,W,H);
 g.globalCompositeOperation='lighter';
 if(nt>.05){const R=Z*P*14,l=g.createRadialGradient(px,py,0,px,py,R);l.addColorStop(0,`rgba(255,196,110,${.6*nt})`);l.addColorStop(.5,`rgba(255,150,60,${.22*nt})`);l.addColorStop(1,'rgba(255,150,60,0)');g.fillStyle=l;g.fillRect(px-R,py-R,R*2,R*2);
  let n=0;for(const b of bl){if(!b.wn||b.al<.6||b.ox*1>camX+lo.width||b.ox+b.sw<camX||b.oy>camY+lo.height||b.oy+b.sh<camY)continue;for(let i=0;i<b.wn.length&&n<420;i+=11,n++){const k=b.wn[i],X=(b.ox-camX+k[0])*Z,Y=(b.oy-camY+k[1])*Z,r=Z*6,q=g.createRadialGradient(X,Y,0,X,Y,r);q.addColorStop(0,`rgba(255,214,120,${.35*nt})`);q.addColorStop(1,'rgba(255,214,120,0)');g.fillStyle=q;g.fillRect(X-r,Y-r,r*2,r*2)}}}
 g.globalCompositeOperation='source-over'}
const render0=render;render=function(){render0();lightPass();gameDraw()};
