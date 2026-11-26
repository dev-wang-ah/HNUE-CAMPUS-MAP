// ---------- PIXEL THẬT: mọi thứ về đúng lưới 1 pixel (3 px = 1 m), phóng bằng số nguyên Z, không làm mịn
// Lấy mẫu tâm mỗi khối 2.5×2.5 => khôi phục đúng pixel gốc (giữ nguyên cửa sổ, cửa, viền), bỏ hết răng cưa/nhoè.
function down(c0,k){const W=c0.width,H=c0.height,w=Math.max(1,Math.round(W/k)),h=Math.max(1,Math.round(H/k)),c=mk(w,h),q=c.getContext('2d');
 try{const s=c0.getContext('2d').getImageData(0,0,W,H).data,im=q.createImageData(w,h),d=im.data;
  for(let y=0;y<h;y++){const sy=Math.min(H-1,Math.floor((y+.5)*H/h));for(let x=0;x<w;x++){const sx=Math.min(W-1,Math.floor((x+.5)*W/w)),a=(sy*W+sx)*4,i=(y*w+x)*4;if(s[a+3]>=110){d[i]=s[a];d[i+1]=s[a+1];d[i+2]=s[a+2];d[i+3]=255}}}
  q.putImageData(im,0,0)}catch(e){q.imageSmoothingEnabled=false;q.drawImage(c0,0,0,w,h)}
 return c}
const ED=(()=>{try{return JSON.parse(localStorage.hnueEdits||'{}')}catch(e){return{}}})();
function ovr(b){const m=SPR.b[b.i];if(!m)return;const eu=ED[b.i];loadImg(eu||(PACKED&&PACKED['b'+b.i])||m.f,c0=>{const c=down(c0,eu?1:(m.s||1));let fa=null,f=[];try{fa=faBuf(c,1);f=scan(c,1)}catch(e){}
 b.sp=c;b.fa=fa;b.wn=f;b.sw=c.width;b.sh=c.height;b.px=0;b.ox=m.ox;b.oy=m.oy})}
function treeFit(T){T.c=down(T.c5,T.k5||1)}
