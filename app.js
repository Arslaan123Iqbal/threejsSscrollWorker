import * as THREE from 'three';
import chain from './chain.jpeg'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//shaders
const vVertex  = `
      varying vec2 vUv; 
      uniform float time;
      void main() {
          vUv = uv;
          vec3 pos = position;
          pos.y += sin(time)*0.02; 
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);; 
      }
  `;
const vFragment =`
      uniform sampler2D texture1; 
      uniform sampler2D texture2; 
      varying vec2 vUv;

      void main() {
          vec4 color1 = texture2D(texture1, vUv);
          //vec4 fColor = mix(color1, color2, vUv.y);
          //fColor.a = 1.0;
          gl_FragColor = color1;
      }
  `;

//thre js code
const cont  = document.getElementById("cont")
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff,1)
cont.appendChild( renderer.domElement );


// Create a camera
var camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  );
camera.position.set( 0, 0, 5 );

// Create a scene
var scene = new THREE.Scene();

// Create a plane geometry
var geometry = new THREE.PlaneGeometry( 1, 1, 1 );

// Create a material for the plane
var material =  new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: { value: 0 },
    //   progress: { type: "f", value: 0 },
    //   angle: { type: "f", value: 0 },
      time:{type:"f", value:0},
      texture1: { type: "sampler2D", value: null },
    //   texture2: { type: "t", value: null },
      resolution: { type: "v4", value: new THREE.Vector4() },
      uvRate1: {
        value: new THREE.Vector2(1, 1)
      }
    },
    // wireframe: true,
    // transparent: true,
    vertexShader: vVertex,
    fragmentShader: vFragment
  });


let images = [...document.querySelectorAll("img")];
let materials =[];
let meshes =[];
let imageData = [chain, chain,chain,chain]
let texture = new THREE.TextureLoader().load(chain)
imageData.forEach((im,i)=>{
    let mat = material.clone();
    materials.push(mat);
    mat.uniforms.texture1.value = new THREE.TextureLoader().load(im);
    mat.uniforms.texture1.value.needsUpdate = true;
    let geo = new THREE.PlaneGeometry(1.5,1, 20, 20);
    let mesh =  new THREE.Mesh(geo, mat);
    scene.add(mesh);
    meshes.push(mesh);
    mesh.position.y = i * 1.2;
}) 
// Create a mesh and add it to the scene
var plane = new THREE.Mesh( geometry, material );
scene.add( plane );

// Render the scene
// renderer.render( scene, camera );
function animate() {
  if(materials){
    materials.forEach((m)=>{
      m.uniforms.time.value +=0.05;
    })
  }
 
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();

// javscript code
let speed = 0;
let position = 0;
let rounded = 0;
let block = document.getElementById("block")
let wrap = document.getElementById("wrap")
let elems = [...document.querySelectorAll('.n')]
window.addEventListener("wheel",(e)=>{
      speed += e.deltaY*0.0003

});
let objs = Array(5).fill({dist:0});



function raf(){
    position += speed;
    speed *= 0.8;
    objs.forEach((o,i)=>{
        o.dist = Math.min(Math.abs(position -i),1) ;
        o.dist = 1 - o.dist ** 2;
        elems[i].style.transform = `scale(${1 + 0.4 * o.dist})`
    })
    rounded = Math.round(position);
    let diff  = (rounded -  position);
    position += Math.sign(diff)* Math.pow(Math.abs(diff),0.7) *0.015;
    wrap.style.transform = `translate(0,${- position * 100 + 50}px)`
    window.requestAnimationFrame(raf);
}

raf()