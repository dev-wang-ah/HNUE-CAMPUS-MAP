// ---------- GPS
function onGps(p){const x=(p.coords.longitude-D.c[1])*D.ml[1],y=(D.c[0]-p.coords.latitude)*D.ml[0];
 if(Math.abs(x)>D.ext[2]+150||Math.abs(y)>D.ext[3]+150){gps=null;if(!warned){warned=1;toast('Bạn đang cách khuôn viên HNUE ~'+(Math.hypot(x,y)/1000).toFixed(1)+' km — chơi ở chế độ tự đi (WASD / chạm để đi)')}return}
 const first=!gps;gps={x,y};if(first){mode='gps';pl.x=x;pl.y=y;setMode();toast('Đã định vị — bạn đang đứng trong game đúng vị trí thật!')}}
const NOGPS=new URLSearchParams(location.search).has('b');
NOGPS?0:navigator.geolocation?navigator.geolocation.watchPosition(onGps,()=>toast('Không lấy được GPS — dùng chế độ tự đi (WASD / chạm để đi)'),{enableHighAccuracy:true,maximumAge:2000,timeout:25000}):toast('Thiết bị không hỗ trợ GPS — dùng chế độ tự đi');
