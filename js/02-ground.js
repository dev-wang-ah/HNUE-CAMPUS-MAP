// ---------- mặt đất pixel (chia khối, tô bảng màu cố định + hoạ tiết)
const Kg=['#7fb35a','#8cc063','#6fa24e','#9bcc6c'].map(C),KG=['#5fae4a','#6dbb55','#4e9a3f','#82c964'].map(C);
function col0(t,x,y,H){const h=hash(x,y),b=hash(x>>2,y>>2);
 switch(t){
 case 0:{const q=H?KG:Kg;if(h<.005)return b<.5?[255,255,255]:[255,214,90];return b<.2?q[3]:h<.1?q[2]:h<.55?q[0]:q[1]}
 case 1:return h<.14?[205,189,152]:[216,201,166];
 case 2:{const s=m(x/21|0,2);return h<.05?[78,150,58]:s?[109,187,79]:[98,173,70]}
 case 3:return h<.035||(b<.1&&h<.3)?[127,192,236]:h<.07?[47,111,174]:[61,134,198];
 case 4:{const u=hash(x>>2,y>>2);return(x&3)==0&&(y&3)==0?[110,170,84]:u<.3?[39,98,48]:u<.7?[52,122,58]:[72,144,66]}
 case 5:return(m(x,14)==0&&m(y,26)<16)?[232,232,238]:h<.1?[118,122,134]:[124,128,140];
 case 6:return(m(x,6)==0||m(y,6)==0)?[186,178,160]:h<.1?[214,206,190]:[207,199,181];
 case 7:return h<.08?[104,109,117]:h>.95?[78,82,90]:[91,96,104];
 case 8:{const r=y/3|0,f=(y%3==0)||m(x+m(r,2)*3,6)==0;return f?[168,112,78]:h<.15?[203,146,102]:[212,155,110]}
 case 9:return m(y,2)?[191,184,168]:[156,150,134];
 case 10:return[246,241,210];
 case 11:return m(x,6)==0?[84,34,24]:m(y,6)<2?[198,110,78]:[148,66,48];
 default:return m(x+y,9)==0?[141,149,163]:h<.1?[170,176,188]:[179,185,196]}}
// --- chi tiết bề mặt kiểu Faithful: điều biến độ sáng theo ô 32×32 (xoay/lật theo ô để không lặp lộ liễu)
const TXK={0:['grass',.6],2:['grass',.6],1:['sand',.5],3:['water',.35],4:['moss',.5],5:['smooth',.4],6:['sbrick',.55],7:['gravel',.55],8:['brick',.5],9:['cobble',.55]},TXM={};
for(const k in TEXD)TXM[k]=Uint8Array.from(atob(TEXD[k]),c=>c.charCodeAt(0));
function col(t,x,y,H){const k=col0(t,x,y,H),z=TXK[t];if(!z)return k;const T=TXM[z[0]],cx=x>>5,cy=y>>5,r=hash(cx,cy),u=x&31,v=y&31,a=r<.5?u:31-u,b=r*7%1<.5?v:31-v,n=(r>.25&&r<.75?T[a*32+b]:T[b*32+a])/255+.5,f=1+(n-1)*z[1];return[Math.min(255,k[0]*f),Math.min(255,k[1]*f),Math.min(255,k[2]*f)]}
const CK=new Map,X5=2.5,MG=8,FS=CS+2*MG;
function chunk(cx,cy){const ox=cx*CS/P-MG,oy=cy*CS/P-MG,c=mk(FS,FS),q=c.getContext('2d'),A=new Uint8Array(FS*FS),HM=new Uint8Array(FS*FS),t=mk(FS,FS),tc=t.getContext('2d');
 const lay=(idx,fn,T=A)=>{tc.setTransform(1,0,0,1,0,0);tc.clearRect(0,0,FS,FS);tc.setTransform(P,0,0,P,-ox*P,-oy*P);tc.lineCap=tc.lineJoin='round';fn(tc);const d=tc.getImageData(0,0,FS,FS).data;for(let i=0;i<FS*FS;i++)if(d[i*4+3]>=110)T[i]=idx};
 const F=pa=>z=>{z.fillStyle='#000';z.fill(pa)},S=(pa,w)=>z=>{z.strokeStyle='#000';z.lineWidth=w;z.stroke(pa)};
 lay(1,F(HN),HM);[1,7,10].forEach(k=>lay(1,F(AP[k])));lay(4,F(AP[4]));lay(5,F(AP[5]));lay(2,F(AP[2]));lay(3,F(AP[3]));
 lay(11,S(HN,1.4));
 for(const r of RG)if(r.c<=4)lay(6,S(r.pa,r.w+3));
 for(const r of RG)if(r.c<=4)lay(7,S(r.pa,r.w));
 for(const r of RG)if(r.c==5)lay(8,S(r.pa,Math.max(r.w,2)));else if(r.c>5)lay(r.c==7?9:8,S(r.pa,Math.max(r.w*.9,1.3)));
 lay(10,z=>{z.setLineDash([2.5,3]);z.strokeStyle='#000';z.lineWidth=.35;for(const r of RG)if(r.c<=1)z.stroke(r.pa);z.setLineDash([])});
 lay(10,z=>{z.strokeStyle='#000';z.lineWidth=.3;z.stroke(MK)});lay(12,S(RLP,4.4));
 const im=q.createImageData(FS,FS),d=im.data;
 if(window.hnuePixelColorize)d.set(window.hnuePixelColorize(A,HM,cx,cy));
 else for(let y=0;y<FS;y++)for(let x=0;x<FS;x++){const i=y*FS+x,k=col(A[i],cx*CS+x-MG,cy*CS+y-MG,HM[i]);d[i*4]=k[0];d[i*4+1]=k[1];d[i*4+2]=k[2];d[i*4+3]=255}
 q.putImageData(im,0,0);
 const tm=c; // mặt đất giữ đúng lưới pixel, không phóng/nhoè
 CK.set(cx+','+cy,tm);
 if(CK.size>22){const far=[];CK.forEach((v,k2)=>{const p=k2.split(','),dd=Math.max(Math.abs(p[0]*CS-camX),Math.abs(p[1]*CS-camY))/CS;if(dd>3)far.push([dd,k2])});far.sort((u,v2)=>v2[0]-u[0]);for(let i=0;i<far.length-16;i++)CK.delete(far[i][1])}
 return tm}
