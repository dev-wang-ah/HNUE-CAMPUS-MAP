// ---------- ngày / đêm
function tod(){const dt=new Date(),h=tm?[0,12,18.2,22][tm]:dt.getHours()+dt.getMinutes()/60,n=h<5?1:h<6.8?1-(h-5)/1.8:h<17.4?0:h<19?(h-17.4)/1.6:1,d=h>16.5&&h<19.2?1-Math.abs(h-17.9)/1.3:h>5.5&&h<7?1-Math.abs(h-6.2)/.9:0;return[Math.max(0,Math.min(1,n)),Math.max(0,d)]}
