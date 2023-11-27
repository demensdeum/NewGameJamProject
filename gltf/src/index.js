import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
let renderer;
let camera;

init(); //our setup
render(); //the update loop

function init() {
  //setup the camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.25,
    20
  );
  camera.position.set(-1.8, 0.6, 2.7);

  //load and create the environment
  new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    .load(
      "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/equirectangular/royal_esplanade_1k.hdr",
      function (texture) {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;

        scene.background = envMap; //this loads the envMap for the background
        scene.environment = envMap; //this loads the envMap for reflections and lighting

        texture.dispose(); //we have envMap so we can erase the texture
        pmremGenerator.dispose(); //we processed the image into envMap so we can stop this
      }
    );

  // load the model
  const loader = new GLTFLoader();
  loader.load(
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf",
    function (gltf) {
      scene.add(gltf.scene);
      render(); //render the scene for the first time
    }
  );

  //setup the renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; //added contrast for filmic look
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding; //extended color space for the hdr

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render); // use if there is no animation loop to render after any changes
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, -0.2);
  controls.update();

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

//

function render() {
  renderer.render(scene, camera);
}
