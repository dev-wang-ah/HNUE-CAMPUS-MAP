// ---------- SHADER ÁNH SÁNG (WebGL, kiểu shader Minecraft): pixel art giữ nguyên, ánh sáng là 3D mượt
// Cảnh pixel vẽ ở canvas 2D -> qua fragment shader: ánh nắng + tia sáng thể tích (god rays), bloom, đèn lồng, tông màu theo giờ,
// ánh lấp lánh mặt nước, tone mapping ACES, vignette. Cửa sổ ban đêm (màu 255,226,130) được coi là nguồn phát sáng.
const lightPass2D=lightPass;let TS=1,GFX=1,GLOK=0,gl,glc,tex,U={};
const GVS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}',GFS=`precision highp float;uniform sampler2D T;uniform vec2 R,sun,lp;uniform float tm,Zp,nt,dk,lr,lint,rint,fy,tsk,fx;uniform vec3 amb,sunc;
float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float em(vec3 c){return step(abs(c.r-1.),.02)*step(abs(c.g-.886),.02)*step(abs(c.b-.51),.02);}
vec2 perspectiveUV(vec2 uv){float y=1.-uv.y,sourceY=y*1.32/(1.+.32*y),scale=mix(.92,1.08,sourceY);return vec2(.5+(uv.x-.5)/scale,1.-sourceY);}
void main(){vec2 uv=gl_FragCoord.xy/R;vec2 puv=perspectiveUV(uv);vec3 s0=texture2D(T,puv).rgb;if(fx<.5){gl_FragColor=vec4(s0,1.);return;}float e=em(s0);float tk=smoothstep(.2,.62,abs(uv.y-fy))*tsk;if(tk>.02){vec3 ba=vec3(0.);for(int i=0;i<8;i++){float f=float(i),an=f*2.39996,r=sqrt((f+.5)/8.)*tk*Zp*2.6;ba+=texture2D(T,perspectiveUV(uv+vec2(cos(an),sin(an))*r/R)).rgb;}s0=mix(s0,ba/8.,min(tk*1.5,1.));}vec3 c=pow(s0,vec3(2.2));
 vec3 bl=vec3(0.);float rad=Zp*11.;for(int i=0;i<20;i++){float f=float(i),a=f*2.39996,r=sqrt((f+.5)/20.)*rad;vec3 s=texture2D(T,perspectiveUV(uv+vec2(cos(a),sin(a))*r/R)).rgb;float eb=em(s);float br=max(lum(s)-.84,0.)*1.1+eb*1.5;bl+=mix(s,vec3(1.,.72,.36),eb)*br*(1.-r/rad*.6);}bl=pow(bl/20.,vec3(1.6));
 vec2 d=sun-uv;float acc=0.;for(int i=0;i<24;i++){float t=float(i)/24.;vec3 s=texture2D(T,perspectiveUV(uv+d*t*.6)).rgb;acc+=smoothstep(.42,.78,lum(s))*(1.-t);}acc/=24.;
 float ang=atan(d.y,d.x),beam=.6+.4*sin(ang*41.+tm*.12)*sin(ang*17.-tm*.08);
 float v=clamp(1.-length(d*vec2(R.x/R.y,1.))/1.8,0.,1.),fo=.08/(1.-.92*v)-.08;fo=clamp(fo*1.015/.92-.015,0.,1.);
 vec3 ray=sunc*acc*beam*rint*(.35+1.6*fo);
 float dl=length(gl_FragCoord.xy-lp)/lr;float q=max(1.-dl,0.);vec3 lamp=vec3(1.,.69,.39)*q*q*lint;
 vec3 lit=c*(amb+lamp*1.7);lit=mix(lit,c*1.25,e);
 float wat=step(.62,s0.b)*step(s0.r,.52)*step(.3,s0.b-s0.r)*(1.-e);vec2 wp=gl_FragCoord.xy/Zp;
 lit*=1.+wat*.14*sin(wp.x*.35+tm*1.4)*sin(wp.y*.3-tm*1.1);lit=mix(lit,lit*vec3(.8,.97,1.15),wat*.5);
 float sp=step(.986,hs(floor(wp)+floor(tm*1.6)));lit+=wat*sp*sunc*.9;
 vec3 col=lit+bl*(.35+1.1*nt)+ray+lamp*bl*.4;col*=1.18;
 col=col/pow(pow(col,vec3(2.))+1.,vec3(.5));col=pow(col,vec3(1./2.2));col=clamp(col,0.,1.);
 vec3 hz=mix(vec3(.6,.72,.92),vec3(1.,.7,.45),dk*(1.-nt))*(1.-.78*nt);col=mix(col,hz,.16*tsk*smoothstep(.4,1.,uv.y));col=mix(vec3(lum(col)),col,1.14-.3*nt);
 float vg=smoothstep(.98,.3,length((uv-.5)*vec2(R.x/R.y,1.)));col*=mix(.66,1.,vg);gl_FragColor=vec4(col,1.);}`;
try{glc=document.createElement('canvas');gl=glc.getContext('webgl',{alpha:false,antialias:false});
 if(gl){const sh=(t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(x);return x},pg=gl.createProgram();
  gl.attachShader(pg,sh(gl.VERTEX_SHADER,GVS));gl.attachShader(pg,sh(gl.FRAGMENT_SHADER,GFS));gl.linkProgram(pg);if(!gl.getProgramParameter(pg,gl.LINK_STATUS))throw gl.getProgramInfoLog(pg);gl.useProgram(pg);
  const bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const lc=gl.getAttribLocation(pg,'p');gl.enableVertexAttribArray(lc);gl.vertexAttribPointer(lc,2,gl.FLOAT,false,0,0);
  ['T','R','sun','lp','tm','Zp','nt','dk','lr','lint','rint','fy','tsk','fx','amb','sunc'].forEach(k=>U[k]=gl.getUniformLocation(pg,k));
  tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);[gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR));[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE));gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);GLOK=1}}catch(e){GLOK=0;console.warn('Shader lỗi, dùng ánh sáng 2D:',e)}
// Hằng số màu sáng/ambient theo giờ lấy từ cấu hình mặc định BSL (sáng-chiều, ban ngày, ban đêm), bình phương như BSL
const bc=a=>[0,1,2].map(i=>Math.pow(a[i]*a[3]/255,2)),BS={Lm:bc([255,160,80,1.2]),Ld:bc([196,220,255,1.4]),Ln:bc([96,192,255,1]),Am:bc([255,204,144,.35]),Ad:bc([120,172,255,.6]),An:bc([96,192,255,.6])};
const mixv=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
window.POST=function(){if(!GLOK)return;const W=cv.width,H=cv.height,[nt,dk]=tod(),h=hour(),T=performance.now()/1000,a=Math.max(0,Math.min(1,(h-6)/12))*Math.PI,s=Math.sin(a),k=1-nt;
 if(glc.width!=W||glc.height!=H){glc.width=W;glc.height=H}gl.viewport(0,0,W,H);gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,cv);
 const w=Math.max(0,Math.min(1,(s-.12)/.45)),L=mixv(mixv(BS.Lm,BS.Ld,w),BS.Ln,nt*nt),A=mixv(mixv(BS.Am,BS.Ad,w),BS.An,nt*nt),F=mixv(A,L,.7),lf=F[0]*.299+F[1]*.587+F[2]*.114,br=mixv([1],[.08],Math.pow(nt,.8))[0]*(1-.08*(1-w)*(1-nt)),amb=F.map(v=>1+(v/lf-1)*(.5+.3*nt)).map(v=>v*br),mx=Math.max(...L),sc=mixv(mixv([1,.93,.78],[1,.62,.32],1-w),L.map(v=>v/mx),.5+.4*nt),sunI=k*(.55+.45*s)+nt*.3;
 const sx=nt>.5?.3:.5-Math.cos(a)*.55,sy=1.15;gl.uniform1i(U.T,0);gl.uniform2f(U.R,W,H);gl.uniform2f(U.sun,sx,sy);gl.uniform2f(U.lp,(pl.x*P-camX)*Z,H-(pl.y*P-camY-6)*Z);gl.uniform1f(U.tm,T);gl.uniform1f(U.Zp,Z);gl.uniform1f(U.nt,nt);gl.uniform1f(U.dk,dk);gl.uniform1f(U.fx,GFX?1:0);
 gl.uniform1f(U.lr,Z*P*17*(1+.03*Math.sin(T*9)));gl.uniform1f(U.lint,nt*1.05);gl.uniform1f(U.fy,1-((pl.y*P-camY)*Z)/H);gl.uniform1f(U.tsk,TS);gl.uniform1f(U.rint,.32*(1-nt)*(1-nt));gl.uniform3fv(U.amb,amb);gl.uniform3fv(U.sunc,sc.map(v=>v*sunI*.5));
 gl.drawArrays(gl.TRIANGLES,0,3);g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.imageSmoothingEnabled=false;g.drawImage(glc,0,0)};
// khi không có WebGL: dùng lớp ánh sáng 2D cũ + phủ tối ban đêm
lightPass=function(){if(GLOK&&GFX)return;const[nt,dk]=tod();if(dk>0){g.fillStyle=`rgba(255,120,50,${.2*dk})`;g.fillRect(0,0,cv.width,cv.height)}if(nt>0){g.fillStyle=`rgba(14,22,62,${.58*nt})`;g.fillRect(0,0,cv.width,cv.height)}lightPass2D()};
