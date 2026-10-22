import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
export {THREE};
export const clay=(c,o={})=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,roughness:0.6,metalness:0,clearcoat:0.3,clearcoatRoughness:0.45,sheen:1,sheenColor:new THREE.Color(0xffffff),sheenRoughness:0.6},o));
export const glass=(c,o={})=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,roughness:0.08,transmission:0.9,thickness:0.5,ior:1.4,clearcoat:1,transparent:true},o));
export const mesh=(g,m)=>{const x=new THREE.Mesh(g,m);x.castShadow=true;x.receiveShadow=true;return x;};
export const rb=(w,h,d,rad,m)=>mesh(new RoundedBoxGeometry(w,h,d,8,rad),m);
export function stage(id,{dark=false,exposure=0.92,shadow=4096}={}){
 const cv=document.getElementById(id);const W=cv.clientWidth,H=cv.clientHeight;
 const r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});
 r.setPixelRatio(2);r.setSize(W,H,false);r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
 r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=exposure;r.outputColorSpace=THREE.SRGBColorSpace;
 const s=new THREE.Scene();const pm=new THREE.PMREMGenerator(r);s.environment=pm.fromScene(new RoomEnvironment(),0.04).texture;s.environmentIntensity=dark?0.55:0.7;
 const cam=new THREE.PerspectiveCamera(28,W/H,0.1,200);
 const k=new THREE.DirectionalLight(0xffffff,dark?2.2:1.8);k.position.set(-5,10,7);k.castShadow=true;k.shadow.mapSize.set(shadow,shadow);k.shadow.radius=12;
 Object.assign(k.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:1,far:50});s.add(k);
 s.add(new THREE.HemisphereLight(0xffffff,dark?0x0b2a33:0xd8f0ea,dark?0.5:0.9));
 const f=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.ShadowMaterial({opacity:dark?0.35:0.15}));f.rotation.x=-Math.PI/2;f.receiveShadow=true;f.userData.skip=true;s.add(f);
 return {r,s,cam,W,H};}
export function frame(s,cam,W,H,{dir=[0,0.55,1],pad=0.08}={}){
 const box=new THREE.Box3();s.children.forEach(o=>{if(!o.userData.skip&&!o.isLight)box.expandByObject(o);});
 const c=box.getCenter(new THREE.Vector3());const pts=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])pts.push(new THREE.Vector3(x,y,z));
 const d=new THREE.Vector3(...dir).normalize();let dist=10,tgt=c.clone();
 for(let k=0;k<80;k++){cam.position.copy(tgt).add(d.clone().multiplyScalar(dist));cam.lookAt(tgt);cam.updateMatrixWorld();
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;pts.forEach(p=>{const v=p.clone().project(cam);x0=Math.min(x0,v.x);x1=Math.max(x1,v.x);y0=Math.min(y0,v.y);y1=Math.max(y1,v.y);});
  const ratio=Math.max((x1-x0)/(2-2*pad),(y1-y0)/(2-2*pad));dist*=1+(ratio-1)*0.5;
  const wpp=dist*Math.tan(cam.fov*Math.PI/360);const up=new THREE.Vector3(0,1,0).applyQuaternion(cam.quaternion),rt=new THREE.Vector3(1,0,0).applyQuaternion(cam.quaternion);
  tgt.add(up.multiplyScalar((y0+y1)/2*wpp)).add(rt.multiplyScalar((x0+x1)/2*wpp*cam.aspect));}
 cam.position.copy(tgt).add(d.clone().multiplyScalar(dist));cam.lookAt(tgt);cam.updateMatrixWorld();}
export function pin(color=0x1fc27a,scale=1){const prof=[];for(let i=0;i<=24;i++){const a=Math.PI*0.5*i/24;prof.push(new THREE.Vector2(Math.sin(a),1.6+Math.cos(a)));}
 for(let i=1;i<=24;i++){const t=i/24;prof.push(new THREE.Vector2(Math.max(Math.cos(t*Math.PI/2)*(1-t*0.15),0.001),1.6-t*1.6));}prof.push(new THREE.Vector2(0,0));prof.reverse();
 const g=new THREE.Group();g.add(mesh(new THREE.LatheGeometry(prof,64),clay(color,{roughness:0.35,clearcoat:0.8})));
 const h=mesh(new THREE.CylinderGeometry(0.4,0.4,2.05,48),clay(0xffffff));h.rotation.x=Math.PI/2;h.position.y=1.6;g.add(h);g.scale.setScalar(scale);return g;}
export function project(obj,cam,W,H){const v=new THREE.Vector3();obj.getWorldPosition(v);v.project(cam);return [(v.x+1)/2*W,(1-v.y)/2*H];}
export function check(color=0xffffff,s=1){const g=new THREE.Group();const a=mesh(new THREE.CapsuleGeometry(0.11,0.35,8,16),clay(color));a.rotation.z=0.8;a.position.set(-0.18,-0.05,0);
 const b=mesh(new THREE.CapsuleGeometry(0.11,0.7,8,16),clay(color));b.rotation.z=-0.65;b.position.set(0.17,0.12,0);g.add(a,b);g.scale.setScalar(s);return g;}
