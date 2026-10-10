import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
export {THREE, RoundedBoxGeometry};
export function makeStage(canvasId, {fov=32, camPos=[0,9,11], target=[0,0,0], bg=null}={}){
  const canvas=document.getElementById(canvasId);
  const W=canvas.clientWidth,H=canvas.clientHeight;
  const r=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true});
  r.setPixelRatio(2);r.setSize(W,H,false);
  r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
  r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=0.85;r.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();
  const pm=new THREE.PMREMGenerator(r);scene.environment=pm.fromScene(new RoomEnvironment(),0.04).texture;scene.environmentIntensity=0.55;
  const cam=new THREE.PerspectiveCamera(fov,W/H,0.1,200);cam.position.set(...camPos);cam.lookAt(...target);
  const key=new THREE.DirectionalLight(0xffffff,2.2);key.position.set(-6,14,8);key.castShadow=true;
  key.shadow.mapSize.set(4096,4096);Object.assign(key.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:1,far:60});key.shadow.radius=6;key.shadow.bias=-0.0004;
  scene.add(key);scene.add(new THREE.HemisphereLight(0xffffff,0xbfeee0,0.6));
  const shadowFloor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.ShadowMaterial({opacity:0.18}));
  shadowFloor.rotation.x=-Math.PI/2;shadowFloor.position.y=-0.01;shadowFloor.receiveShadow=true;shadowFloor.userData.skip=true;scene.add(shadowFloor);
  return {r,scene,cam,W,H};
}
export const M={
  glossy:(c,o={})=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,roughness:0.22,metalness:0.0,clearcoat:1,clearcoatRoughness:0.08},o)),
  matte:(c,o={})=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,roughness:0.55,metalness:0,clearcoat:0.3},o)),
  glass:(c,o={})=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,roughness:0.08,transmission:0.92,thickness:0.6,ior:1.4,clearcoat:1,transparent:true},o)),
  emissive:(c,i=1.5)=>new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:i}),
};
export function rbox(w,h,d,rad,mat){const m=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,6,rad),mat);m.castShadow=true;m.receiveShadow=true;return m;}
// Revnity brand pin: teardrop (lathe) with a ring hole look
export function pin(scale=1,color=0x5cf2a0){
  const g=new THREE.Group();const pts=[];
  for(let i=0;i<=40;i++){const t=i/40;const a=Math.PI*t; // top sphere part
    pts.push(new THREE.Vector2(Math.sin(a)*1.0*(t<0.5?1:1),Math.cos(a)*1.0+1.6));}
  // replace lower half with taper to point
  const prof=[];for(let i=0;i<=24;i++){const a=Math.PI*0.5*i/24;prof.push(new THREE.Vector2(Math.sin(a),1.6+Math.cos(a)));}
  for(let i=1;i<=24;i++){const t=i/24;const y=1.6-t*1.6;const x=Math.cos(t*Math.PI/2)*1.0*(1-t*0.15);prof.push(new THREE.Vector2(Math.max(x,0.001),y));}
  prof.push(new THREE.Vector2(0,0));prof.reverse();
  const body=new THREE.Mesh(new THREE.LatheGeometry(prof,64),M.glossy(color,{clearcoat:1,roughness:0.15}));
  body.castShadow=true;g.add(body);
  const hole=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,2.1,48),M.glossy(0xffffff,{roughness:0.3}));
  hole.rotation.x=Math.PI/2;hole.position.y=1.6;g.add(hole);
  g.scale.setScalar(scale);return g;}
export function project(obj,cam,W,H){const v=new THREE.Vector3();obj.getWorldPosition(v);v.project(cam);return [(v.x+1)/2*W,(1-v.y)/2*H];}
export function tag(text,x,y,cls=''){const d=document.createElement('div');d.className='tag '+cls;d.textContent=text;d.style.left=x+'px';d.style.top=y+'px';document.body.appendChild(d);return d;}

// auto-frame: move camera so the scene's bounding box fills [left,right]x[top,bottom] in px
export function fit(scene,cam,W,H,{top,bottom,left=70,right=1010,target=[0,0,0]}){
  const box=new THREE.Box3();scene.children.forEach(o=>{if(!o.userData.skip&&!o.isLight)box.expandByObject(o);});
  const pts=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])pts.push(new THREE.Vector3(x,y,z));
  const tgt=new THREE.Vector3(...target);
  for(let k=0;k<60;k++){
    cam.lookAt(tgt);cam.updateMatrixWorld();
    let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
    pts.forEach(p=>{const v=p.clone().project(cam);const sx=(v.x+1)/2*W,sy=(1-v.y)/2*H;x0=Math.min(x0,sx);x1=Math.max(x1,sx);y0=Math.min(y0,sy);y1=Math.max(y1,sy);});
    const ratio=Math.max((y1-y0)/(bottom-top),(x1-x0)/(right-left));
    const dir=cam.position.clone().sub(tgt);cam.position.copy(tgt).add(dir.multiplyScalar(1+(ratio-1)*0.5));
    const wpp=2*cam.position.distanceTo(tgt)*Math.tan(cam.fov*Math.PI/360)/H;
    const dy=((y0+y1)/2-(top+bottom)/2)*wpp, dx=((x0+x1)/2-(left+right)/2)*wpp;
    const up=new THREE.Vector3(0,1,0).applyQuaternion(cam.quaternion), rt=new THREE.Vector3(1,0,0).applyQuaternion(cam.quaternion);
    const shift=up.multiplyScalar(-dy).add(rt.multiplyScalar(dx));
    cam.position.add(shift);tgt.add(shift);
  }
  cam.lookAt(tgt);cam.updateMatrixWorld();
}
