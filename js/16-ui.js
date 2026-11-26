// ---------- giao diện: biểu tượng SVG, đồng hồ, chụp ảnh, bật/tắt shader ánh sáng, tìm địa điểm
const PIXEL_ICONS={
 compass:'<path fill-rule="evenodd" d="M7 0h2v3h3v2h2v3h2v2h-2v3h-2v2H9v2H7v-2H4v-2H2v-3H0V8h2V5h2V3h3zM8 4 4 12l8-4-3 1 1-3z"/>',
 building:'<path fill-rule="evenodd" d="M1 14h14v2H1zM2 7h3V4h6v3h3v7H2zM4 8h2v2H4zM8 8h2v2H8zM4 11h2v2H4zM8 11h2v2H8zM11 10h1v3h-1z"/>',
 day:'<path fill-rule="evenodd" d="M7 0h2v3h2v2h2v2h3v2h-3v2h-2v2H9v3H7v-3H5v-2H3V9H0V7h3V5h2V3h2zM7 5h2v2h2v2H9v2H7V9H5V7h2z"/>',
 sound:'<path fill-rule="evenodd" d="M1 6h3l4-4h2v16H8l-4-4H1zM12 6h2v2h1v4h-1v2h-2v-2h1V8h-1zM15 3h2v2h1v10h-1v2h-2v-2h1V5h-1z"/>',
 zoomIn:'<path fill-rule="evenodd" d="M6 1h5v1h2v2h1v5h-1v2h-1l4 4v2h-2v-1l-4-4v-1H6v-1H4V9H3V4h1V2h2zM6 3v1H5v5h1v1h5v-1h1V4h-1V3zM8 4h1v2h2v1H9v2H8V7H6V6h2z"/>',
 zoomOut:'<path fill-rule="evenodd" d="M6 1h5v1h2v2h1v5h-1v2h-1l4 4v2h-2v-1l-4-4v-1H6v-1H4V9H3V4h1V2h2zM6 3v1H5v5h1v1h5v-1h1V4h-1V3zM6 6h5v1H6z"/>',
 camera:'<path fill-rule="evenodd" d="M2 4h3l2-2h4l2 2h3v11H1V4zM7 6v1H6v4h1v1h4v-1h1V7h-1V6zM8 7h2v1h1v2h-1v1H8v-1H7V8h1zM5 1h2v1H5z"/>',
 light:'<path fill-rule="evenodd" d="M7 0h2v3h2v2h2v2h3v2h-3v2h-2v2H9v3H7v-3H5v-2H3V9H0V7h3V5h2V3h2zM7 5h2v2h2v2H9v2H7V9H5V7h2z"/>',
 depth:'<path d="M8 1 15 5 8 9 1 5zM2 8l6 3 6-3 1 2-7 4-7-4zM2 12l6 3 6-3 1 2-7 4-7-4z"/>',
 brush:'<path d="M10 1h4v2h-1v2h-2V4h-1zM9 4h2v2H9zM7 6h2v2H7zM5 8h2v2H5zM4 10h2v3H5v1H2v-2h1v-1h1zM1 15h4v1H1z"/>',
 map:'<path fill-rule="evenodd" d="M1 3h4v1h2V3h3v1h2V3h3v12h-4v-1H9v1H6v-1H4v1H1zM3 5v8h2V5zM7 5v8h1V5zM10 5v8h2V5z"/>',
 up:'<path d="M7 1h2v2h2v2h2v2H9v7H7V7H3V5h2V3h2z"/>',
 down:'<path d="M7 3h2v7h4v2h-2v2H9v2H7v-2H5v-2H3v-2h4z"/>',
 left:'<path d="M1 7h2V5h2V3h2v4h7v2H7v4H5v-2H3V9H1z"/>',
 right:'<path d="M15 7h-2V5h-2V3H9v4H2v2h7v4h2v-2h2V9h2z"/>'
};
const PI=k=>{const d=PIXEL_ICONS[k];if(!d)throw new Error('Thiếu biểu tượng game: '+k);return`<svg class="pxi" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${d}</svg>`};
async function loadRustPixelCore(){
 if(location.protocol=='file:'){console.info('Rust/WASM pixel core unavailable on file://; using JavaScript');return}
 if(typeof WebAssembly=='undefined'){console.warn('Rust/WASM pixel core unsupported; using JavaScript');return}
 try{
  const response=await fetch('wasm/pixel_core.wasm');if(!response.ok)throw new Error('HTTP '+response.status);
  const{instance}=await WebAssembly.instantiate(await response.arrayBuffer()),core=instance.exports;
  if(core.width()!==FS||core.chunk_size()!==CS||core.margin()!==MG)throw new Error('pixel core dimensions do not match the game');
  const memory=core.memory,terrain=new Uint8Array(memory.buffer,core.terrain_ptr(),FS*FS),height=new Uint8Array(memory.buffer,core.height_ptr(),FS*FS),output=new Uint8Array(memory.buffer,core.output_ptr(),FS*FS*4),textures=new Uint8Array(memory.buffer,core.texture_ptr(),9*32*32);
  ['grass','sand','water','moss','smooth','sbrick','gravel','brick','cobble'].forEach((name,i)=>{const pixels=TXM[name];if(!pixels||pixels.length!==1024)throw new Error('Missing terrain texture '+name);textures.set(pixels,i*1024)});
  window.hnuePixelColorize=(A,HM,cx,cy)=>{terrain.set(A);height.set(HM);core.colorize(cx,cy);return output};
  CK.clear();console.info('Rust/WASM pixel colorization enabled');
 }catch(error){console.warn('Rust/WASM pixel core unavailable; using JavaScript:',error)}
}
loadRustPixelCore();
document.querySelectorAll('[data-glyph]').forEach(b=>b.innerHTML=PI(b.dataset.glyph));
sb.innerHTML=PI('sound');
const bz=[...document.querySelectorAll('#bt .bt')].filter(b=>b.title=='Zoom');bz[0]&&(bz[0].innerHTML=PI('zoomIn'));bz[1]&&(bz[1].innerHTML=PI('zoomOut'));
const mkb=(id,t,glyph,fn)=>{const b=document.createElement('button');b.className='bt';b.id=id;b.title=t;b.innerHTML=PI(glyph);b.onclick=fn;$('#bt').appendChild(b);return b};
mkb('bc','Chụp ảnh','camera',()=>{cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='hnue-pixel-'+Date.now()+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Đã lưu ảnh')})});
const bq2=mkb('bq','Ánh sáng shader (bật/tắt)','light',()=>{if(!GLOK){toast('Thiết bị không hỗ trợ WebGL');return}GFX=!GFX;bq2.classList.toggle('on',GFX);toast(GFX?'Ánh sáng shader: bật':'Ánh sáng shader: tắt')});bq2.classList.toggle('on',GLOK&&GFX);
const clk=$('#clk');setInterval(()=>{const h=hour(),H=h|0,M=(h-H)*60|0;clk.textContent=`${H}:${String(M).padStart(2,'0')} · ${['Theo giờ máy','Ban ngày','Hoàng hôn','Ban đêm'][tm]}`},1000);
lm.addEventListener('input',e=>{const q=e.target.value.toLowerCase();lm.querySelectorAll('[data-i]').forEach(d=>d.style.display=d.textContent.toLowerCase().includes(q)?'':'none')});

// nút mở trình chỉnh sprite + bật/tắt chiều sâu 3D (làm mờ xa/gần, khói mờ chân trời)
{const a=document.createElement('a');a.className='bt';a.href='edit.html';a.target='_blank';a.title='Trình chỉnh sprite';a.innerHTML=PI('brush');$('#bt').appendChild(a)}
const bh=mkb('bh','Chiều sâu 3D (bật/tắt)','depth',()=>{TS=TS?0:1;bh.classList.toggle('on',!!TS);toast(TS?'Chiều sâu 3D: bật':'Chiều sâu 3D: tắt')});bh.classList.add('on');

// nút về bản đồ (game chạy trong cửa sổ phủ của trang bản đồ)
{const a=document.createElement('button');a.className='bt';a.title='Về bản đồ';a.innerHTML=PI('map');a.onclick=()=>{if(parent!==window)parent.postMessage('close-game','*');else location.href='index.html'};$('#bt').insertBefore(a,$('#bt').firstChild)}
