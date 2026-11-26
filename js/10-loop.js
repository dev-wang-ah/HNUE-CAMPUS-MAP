// ---------- vòng lặp
function resize(){Z=Math.max(2,Math.round(Math.min(innerWidth,innerHeight)/300));cv.width=innerWidth;cv.height=innerHeight;lo.width=Math.ceil(innerWidth/Z)+1;lo.height=Math.ceil(innerHeight/Z)+1;o.imageSmoothingEnabled=false;
 for(const b of bl)if(b.sp){b.sp=null;b.px=0;b.fa=null;b.wn=null}
 for(const k in TSP)delete TSP[k]} // đổi cỡ màn hình => dựng lại sprite công trình & cây ở cỡ Z mới
addEventListener('resize',resize);addEventListener('error',e=>toast('Lỗi: '+e.message));resize();setMode();
{const q=new URLSearchParams(location.search),i=+q.get('b');if(q.has('b')&&bl[i]){const s=spawn((bl[i].x0+bl[i].x1)/2,bl[i].y1+4);pl.x=s[0];pl.y=s[1];mode='man';setMode()}if(q.get('night'))tm=3}
toast('WASD / mũi tên để đi, Shift để chạy, E xem toà nhà · chạm/nhấp để đi tới đó');
let last=performance.now();
(function loop(t){dtF=Math.min(.05,(t-last)/1000||.016);last=t;update(dtF);render();mini();
 if(t-pt0>400){pt0=t;const b=hitB(pl.x,pl.y);$('#pl').textContent=b?''+(b.bn||TYN[b.t]):inPoly(D.hn[0],pl.x,pl.y)?'Trong khuôn viên Trường ĐH Sư phạm Hà Nội':'Bên ngoài khuôn viên · '+(mode=='gps'?'GPS':'tự đi')}
 requestAnimationFrame(loop)})(last);
