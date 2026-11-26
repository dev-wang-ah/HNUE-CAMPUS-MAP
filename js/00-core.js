const D=window.HNUE,SPR=window.SPRITES||{b:{},t:{}},PACKED=location.protocol=='file:'&&window.SPRITE_PACK;
const $=q=>document.querySelector(q),cv=$('#c'),g=cv.getContext('2d'),mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c},lo=mk(2,2),o=lo.getContext('2d');
const P=3,CS=256,cs=50,m=(a,n)=>(a%n+n)%n;
const hash=(x,y)=>{let h=Math.imul(x|0,374761393)+Math.imul(y|0,668265263)|0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296};
const line=(pa,p,c)=>{for(let j=0;j<p.length;j+=2)j?pa.lineTo(p[j],p[j+1]):pa.moveTo(p[j],p[j+1]);c&&pa.closePath()};
function inPoly(p,x,y){let c=0;for(let i=0,j=p.length-2;i<p.length;j=i,i+=2)if((p[i+1]>y)!=(p[j+1]>y)&&x<(p[j]-p[i])*(y-p[i+1])/(p[j+1]-p[i+1])+p[i])c=!c;return c}
const TYN=['Nhà dân','Giảng đường · khối học','Thư viện','Căn tin','Khán đài','Chùa · đình','Ký túc xá','Ga metro','Thương mại · chung cư','Công trình khác'];
const WC=['#d8c8a8','#f1dca2','#cfe0f5','#f4b8a8','#c9bde8','#e8b89a','#a8dccb','#b8c4d8','#aab8d8','#d8cdb5'],RC=['#b5513c','#b8392e','#3f6fb5','#c8553d','#6a5aa8','#7a3b2a','#3f8f7a','#5a6b8c','#475072','#8a7a63'];
const HW=['#d8c8a8','#e8d0c0','#c8d8e0','#e6dba8'],HR=['#b5513c','#8a5a44','#4f6a8a','#a04a3a'],DH=[0,15,18,6,6,8,18,9,30,4];
const C=s=>{const n=parseInt(s.slice(1),16);return[n>>16,n>>8&255,n&255]},shade=(s,f)=>{const n=parseInt(s.slice(1),16),c=v=>Math.max(0,Math.min(255,Math.round(v*f)));return`rgb(${c(n>>16)},${c(n>>8&255)},${c(n&255)})`};
