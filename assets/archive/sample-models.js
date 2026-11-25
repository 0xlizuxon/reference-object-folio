import * as T from 'three';
const mat=(color,metalness=0,roughness=.45)=>new T.MeshStandardMaterial({color,metalness,roughness});
function mesh(p,g,m,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o}
function rect(w,h,r){const s=new T.Shape(),x=w/2,y=h/2;s.moveTo(-x+r,-y);s.lineTo(x-r,-y);s.quadraticCurveTo(x,-y,x,-y+r);s.lineTo(x,y-r);s.quadraticCurveTo(x,y,x-r,y);s.lineTo(-x+r,y);s.quadraticCurveTo(-x,y,-x,y-r);s.lineTo(-x,-y+r);s.quadraticCurveTo(-x,-y,-x+r,-y);return s}
function slab(p,w,h,d,r,m,x,y,z,hole){const s=rect(w,h,r);if(hole)s.holes.push(new T.Path(rect(...hole).getPoints(20).reverse()));const g=new T.ExtrudeGeometry(s,{depth:d,bevelSize:.009,bevelThickness:.009,bevelSegments:3,curveSegments:18});g.translate(0,0,-d/2);return mesh(p,g,m,x,y,z)}
function tex(draw,w=512,h=512){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t}
export function letters(p,str,w,h,x,y,z,color='#332f32'){const map=tex((g,W,H)=>{g.fillStyle=color;g.font='500 86px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(str,W/2,H/2,W*.94)},512,100);return mesh(p,new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,transparent:true,depthWrite:false}),x,y,z)}
function cylinder(p,r,d,m,x,y,z){const o=mesh(p,new T.CylinderGeometry(r,r,d,48),m,x,y,z);o.rotation.x=Math.PI/2;return o}
export function calculator(layered){const p=new T.Group(), silver=mat(0xbebdb8,.65,.32), dark=mat(0x484641,.32,.41), lcd=mat(0xa6a79b,0,.65);
 slab(p,1.28,2.03,.105,.13,silver,0,0,0);
 if(layered){slab(p,1.27,2.02,.018,.13,dark,0,0,.042);slab(p,1.25,2,.028,.13,silver,0,0,.066);slab(p,1.04,.35,.032,.033,dark,0,.68,.095,[.98,.29,.028])}
 slab(p,1.00,.31,.012,.032,lcd,0,.68,layered?.089:.068);
 for(const [i,s] of ['128 + 256 =','384'].entries())letters(p,s,.89,.074,0,.738-i*.102,.113);
 const keys=['AC','+/−','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','='];
 keys.forEach((k,i)=>{let x=-.445+i%4*.297,y=.255-Math.floor(i/4)*.278;if(i>=17)x+=.297;if(i===16)x+=.148;
 const m=mat(i%4===3||i<4?0xb7b6b1:0x93938e,.22,.4);
 if(i===16)slab(p,.54,.238,.05,.117,m,x,y,.113);
 else {if(layered)cylinder(p,.128,.023,dark,x,y,.096);cylinder(p,.119,.048,m,x,y,.12)}
 letters(p,k,i===16?.14:.16,.108,x,y,.154,i<4||i%4===3?'#535350':'#fffdf6')});return p}
function ellipse(p,sx,sy,sz,m,x,y,z){const o=mesh(p,new T.SphereGeometry(1,40,32),m,x,y,z);o.scale.set(sx,sy,sz);return o}
export function blister(layered){const p=new T.Group(),foil=mat(0xcecfcf,.85,.29);
 const relief=tex((g,w,h)=>{g.fillStyle='#888';g.fillRect(0,0,w,h);g.lineWidth=3;for(let i=-w;i<w*2;i+=18){for(const slope of [-1,1]){g.strokeStyle='#444';g.beginPath();g.moveTo(i,0);g.lineTo(i+h*slope,h);g.stroke()}}});foil.bumpMap=relief;foil.bumpScale=layered?.022:.009;
 slab(p,1.68,1.57,.022,.15,foil,0,0,0);
 const flesh=mat(0xe79588,.02,.47);
 for(const side of [-1,1]){ellipse(p,.221,.374,.165,flesh,side*.155,0,.167);
 for(let k=0;k<6;k++){const pts=[];for(let j=0;j<=20;j++){const t=j/20,y=(k-2.5)*.09+.043*Math.sin(t*6+k*.8),u=(t-.5)*1.5,v=y/.374;pts.push(new T.Vector3(side*(.155+u*.221),y,.167+.166*Math.sqrt(Math.max(.02,1-u*u-v*v))))}mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(pts),28,.020,8,false),flesh)}}
 const domeMat=new T.MeshPhysicalMaterial({color:0xfffaf8,transmission:.97,roughness:layered?.052:.095,ior:1.49,thickness:layered?.028:.06,clearcoat:.45});const dome=mesh(p,new T.SphereGeometry(1,64,36,0,2*Math.PI,0,Math.PI/2),domeMat,0,0,.048);dome.rotation.x=Math.PI/2;dome.scale.set(.49,.397,.49);
 const flange=mesh(p,new T.TorusGeometry(.494,.019,12,80),domeMat,0,0,.048);if(layered){mesh(p,new T.TorusGeometry(.515,.014,12,80),foil,0,0,.031);mesh(p,new T.TorusGeometry(.477,.011,12,80),domeMat,0,0,.071)}
 return p}
