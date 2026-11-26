// ---------- UI
const tt=$('#tt'),ic=$('#ic'),lm=$('#lm');let tto=0;
const toast=s=>{tt.textContent=s;tt.style.display='block';clearTimeout(tto);tto=setTimeout(()=>tt.style.display='none',4200)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function card(b){if(!b){ic.style.display='none';return}ic.innerHTML=`<button class=bt id=xx style="position:absolute;right:6px;top:6px;padding:2px 8px">×</button><h2>${esc(b.bn||TYN[b.t])}</h2><p>${TYN[b.t]}${b.lv?' · '+b.lv+' tầng':''}${b.ht?' · cao '+b.ht+' m':''} · ≈ ${b.ar.toLocaleString('vi')} m²</p>${mode=='gps'?'':'<button class=bt id=go>Đi tới đây</button>'}`;ic.style.display='block';$('#xx').onclick=()=>card(null);const go=$('#go');if(go)go.onclick=()=>{tgt={x:(b.x0+b.x1)/2,y:b.y1+2};card(null)}}
function tap(sx,sy){const wx=(sx/Z+camX)/P,wy=(sy/Z+camY)/P;let hb=null;for(let s=0;s<=21&&!hb;s+=1.5){const b=hitB(wx,wy+s);if(b&&b.H*.5>=s-.01)hb=b}
 if(hb){card(hb);return}card(null);if(mode=='gps')toast('Đang theo GPS thật — bấm để tự đi');else tgt={x:wx,y:wy}}
let d0=[0,0];cv.onpointerdown=e=>d0=[e.clientX,e.clientY];cv.onpointerup=e=>{if(Math.abs(e.clientX-d0[0])+Math.abs(e.clientY-d0[1])<10)tap(e.clientX,e.clientY)};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=1;if(k=='shift')keys.shift=1;if(k=='e'){const b=hitB(pl.x,pl.y)||hitB(pl.x,pl.y+4);card(b)}if(k.startsWith('arrow')||k==' ')e.preventDefault()});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=0});
document.querySelectorAll('#dp .bt').forEach(b=>{b.onpointerdown=e=>{keys[b.dataset.k]=1;e.preventDefault()};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>keys[b.dataset.k]=0});
function setMode(){$('#bm').classList.toggle('on',mode=='gps');$('#bm').title=mode=='gps'?'Đang theo GPS (bấm để tự đi)':'Tự đi (bấm để theo GPS)'}
$('#bm').onclick=()=>{if(mode=='gps')mode='man';else if(gps){mode='gps';pl.x=gps.x;pl.y=gps.y}else{toast('Chưa có GPS trong khuôn viên HNUE — đang ở chế độ tự đi');return}tgt=null;setMode()};
$('#bd').onclick=()=>{tm=(tm+1)%4;toast(['Giờ thật của máy','Ban ngày','Hoàng hôn','Ban đêm'][tm])};
const PL=[],seen=new Set;bl.filter(b=>b.bn&&b.t>0&&b.t<9).sort((a,b)=>b.ar-a.ar).forEach(b=>{if(!seen.has(b.bn)){seen.add(b.bn);PL.push(b)}});PL.sort((a,b)=>a.t-b.t||a.bn.localeCompare(b.bn,'vi'));
$('#bl').onclick=()=>{if(lm.style.display=='block'){lm.style.display='none';return}lm.innerHTML='<h3>Địa điểm</h3><input id=qs placeholder="Tìm công trình…" autocomplete=off><p class=hint>Chọn để dịch chuyển (chuyển sang chế độ tự đi)</p>'+PL.map((b,i)=>`<div data-i=${i}>${esc(b.bn)}<small>${TYN[b.t]}</small></div>`).join('');lm.style.display='block'};
lm.onclick=e=>{const d=e.target.closest('[data-i]');if(!d)return;const b=PL[d.dataset.i],s=spawn((b.x0+b.x1)/2,b.y1+3);pl.x=s[0];pl.y=s[1];mode='man';tgt=null;setMode();lm.style.display='none';card(b)};
