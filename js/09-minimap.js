// ---------- minimap
const mc=$('#mc').getContext('2d'),mb=mk(128,128),ms=128/Math.max(D.ext[2]-D.ext[0],D.ext[3]-D.ext[1]);
{const q=mb.getContext('2d');q.fillStyle='#7fb35a';q.fillRect(0,0,128,128);q.setTransform(ms,0,0,ms,-D.ext[0]*ms,-D.ext[1]*ms);q.fillStyle='#5fae4a';q.fill(HN);q.fillStyle='#3d86c6';q.fill(AP[3]);q.strokeStyle='#e8e0cc';q.lineCap='round';for(const r of RG)if(r.c<6){q.lineWidth=Math.max(r.w*1.2,1.6/ms*.5);q.stroke(r.pa)}
 const cl=['#cfc0a0','#f1b45a','#6fa4e0','#f4a090','#b8a0e8','#e0a0a0','#70c8b0','#a0b0c8','#a8a8d0','#cfc0a0'];for(const b of bl){q.fillStyle=cl[b.t];q.fillRect(b.x0,b.y0,Math.max(b.x1-b.x0,2.5/ms*.5),Math.max(b.y1-b.y0,2.5/ms*.5))}
 q.setLineDash([4/ms,3/ms]);q.strokeStyle='#e07a1f';q.lineWidth=2/ms;q.stroke(HN)}
function mini(){mc.drawImage(mb,0,0);const x=(pl.x-D.ext[0])*ms,y=(pl.y-D.ext[1])*ms;mc.fillStyle='#fff';mc.fillRect(x-3,y-3,6,6);mc.fillStyle='#e03030';mc.fillRect(x-2,y-2,4,4);mc.strokeStyle='#fff';mc.strokeRect(x-lo.width/P/2*ms,y-lo.height/P/2*ms,lo.width/P*ms,lo.height/P*ms)}
