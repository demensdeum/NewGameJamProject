import { Utils } from './utils.js';
import { SceneObject } from "./sceneObject.js";
// @ts-ignore
import * as dat from '/libs/dat.gui.module.js';
import { Names } from "./names.js";
const gui = new dat.GUI();
export class SceneController {
    constructor(context, canvas) {
        this.texturesToLoad = [];
        // @ts-ignore
        this.textureLoader = new THREE.TextureLoader();
        this.context = context;
        this.canvas = canvas;
        // @ts-ignore
        this.failbackTexture = this.textureLoader.load("./assets/failbackTexture.png", () => {
            console.log("UHHHHHHHHH");
        });
        this.loadingTexture = this.textureLoader.load("./assets/loadingTexture.png");
        // @ts-ignore
        this.scene = new THREE.Scene();
        // @ts-ignore      
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // @ts-ignore
        const colliderBox = new THREE.Box3().setFromObject(this.camera);
        const cameraSceneObject = new SceneObject(Names.camera, this.camera);
        this.objects = [cameraSceneObject];
        // @ts-ignore      
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        const camera = this.camera;
        const renderer = this.renderer;
        function onWindowResize() {
            // @ts-ignore
            camera.aspect = window.innerWidth / window.innerHeight;
            // @ts-ignore
            camera.updateProjectionMatrix();
            // @ts-ignore
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', onWindowResize, false);
    }
    step() {
        this.renderer.render(this.scene, this.camera);
    }
    loadTexture(path, material) {
        const context = this.context;
        this.textureLoader.load(path, 
        // @ts-ignore
        function (texture) {
            console.log("aaaa");
            material.texture = texture;
            material.needsUpdate = true;
        }, 
        // @ts-ignore
        function (error) {
            console.log("error");
            context.debugPrint("CANNOT LOAD TEXTURE: " + path);
        });
    }
    addSceneObject(object) {
        // @ts-ignore
        const alreadyAddedObject = this.objects.find(obj => obj.name === object.name);
        if (alreadyAddedObject) {
            this.context.raiseCriticalError("Duplicate name for object!!!:" + object.name);
            return;
        }
        this.objects.push(object);
        this.scene.add(object.threeObject);
    }
    addUI(gameData) {
        const scoreView = gui
            .add(gameData, 'score')
            .name(this.context.translator.translatedStringForKey("Score"));
        gui.add(gameData, 'speed')
            .name(this.context.translator.translatedStringForKey("Speed"))
            .step(0.01);
        scoreView.domElement.style.pointerEvents = "none";
    }
    updateUI() {
        for (const i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
    }
    addSkybox() {
        this.addPlaneAt(Names.skyboxFront, 0, 0, -SceneController.skyboxPositionDiffX, 1, 1, "./assets/skyboxFrontTexture.png", 0x0000FF, true);
        this.addPlaneAt(Names.skyboxLeft, 0, 0, -SceneController.skyboxPositionDiffX, 1, 1, "./assets/skyboxLeftTexture.png", 0x00FFFF, true);
        this.rotateObject(Names.skyboxLeft, 0, Utils.angleToRadians(90), 0);
        this.moveObjectTo(Names.skyboxLeft, -SceneController.skyboxPositionDiffX, 0, 0);
        this.addPlaneAt(Names.skyboxRight, 0, 0, SceneController.skyboxPositionDiffX, 1, 1, "./assets/skyboxRightTexture.png", 0xFF00FF, true);
        this.rotateObject(Names.skyboxRight, 0, Utils.angleToRadians(90), 0);
        this.moveObjectTo(Names.skyboxRight, SceneController.skyboxPositionDiffX, 0, 0);
    }
    addBoxAt(name, x, y, z, texturePath, size, color = 0x00FFFF) {
        this.context.debugPrint("addCubeAt");
        // @ts-ignore
        const boxGeometry = new THREE.BoxGeometry(size, size, size);
        // @ts-ignore
        const material = new THREE.MeshBasicMaterial({
            color: color,
            map: this.loadingTexture
        });
        const newMaterial = new THREE.MeshBasicMaterial({
            color: color,
            map: this.textureLoader.load(texturePath, (texture) => {
                material.map = texture;
                material.needsUpdate;
            }, (error) => {
                console.log("WUT!!!!");
            })
        });
        this.texturesToLoad.push(newMaterial);
        // @ts-ignore
        const box = new THREE.Mesh(boxGeometry, material);
        box.position.x = x;
        box.position.y = y;
        box.position.z = z;
        const sceneObject = new SceneObject(name, box);
        this.addSceneObject(sceneObject);
    }
    addPlaneAt(name, x, y, z, width, height, texturePath, color = 0xFFFFFF, resetDepthBuffer = false) {
        this.context.debugPrint("addPlaneAt");
        // @ts-ignore
        const planeGeometry = new THREE.PlaneGeometry(width, height);
        // @ts-ignore
        const material = new THREE.MeshBasicMaterial({
            color: color,
            map: this.loadingTexture,
            // @ts-ignore
            depthWrite: !resetDepthBuffer,
            // @ts-ignore
            side: THREE.DoubleSide,
        });
        // @ts-ignore
        const newMaterial = new THREE.MeshBasicMaterial({
            color: color,
            map: this.textureLoader.load(texturePath, 
            // @ts-ignore
            (texture) => {
                material.map = texture;
                material.needsUpdate = true;
            }, 
            // @ts-ignore
            (error) => {
                console.log("WUT!");
            }),
            // @ts-ignore
            depthWrite: !resetDepthBuffer,
            // @ts-ignore
            side: THREE.DoubleSide,
        });
        this.texturesToLoad.push(newMaterial);
        // @ts-ignore
        const plane = new THREE.Mesh(planeGeometry, material);
        plane.position.x = x;
        plane.position.y = y;
        plane.position.z = z;
        // this.loadTexture(
        //     texturePath, 
        //     material
        // );        
        // @ts-ignore
        const box = new THREE.Box3().setFromObject(plane);
        const sceneObject = new SceneObject(name, plane);
        this.addSceneObject(sceneObject);
    }
    addCarAt(name, x, y, z) {
        this.context.debugPrint("addCarAt");
        this.addBoxAt(name, x, y, z, "./assets/skyboxLeftTexture.png", SceneController.carSize);
    }
    addRoadSegmentAt(name, x, y, z) {
        this.context.debugPrint("addRoadSegmentAt");
        this.addPlaneAt(name, x, y, z, SceneController.roadSegmentSize, SceneController.roadSegmentSize, "./assets/roadSegmentTexture.png");
        this.rotateObject(name, Utils.angleToRadians(-90), 0, 0);
    }
    sceneObjectPosition(name) {
        const outputObject = this.sceneObject(name);
        const outputPosition = outputObject.threeObject.position;
        return outputPosition;
    }
    objectCollidesWithObject(alisaName, bobName) {
        const alisa = this.sceneObject(alisaName);
        const bob = this.sceneObject(bobName);
        // @ts-ignore
        const alisaColliderBox = new THREE.Box3().setFromObject(alisa.threeObject);
        // @ts-ignore
        const bobCollider = new THREE.Box3().setFromObject(bob.threeObject);
        const output = alisaColliderBox.intersectsBox(bobCollider);
        //this.context.debugPrint("alisa object:" + alisa.name + "; bob: "+ bob.name +"; collide result: " + output);
        return output;
    }
    addItemAt(name, x, y, z) {
        const item = this.addBoxAt(name, x, y, z, "./assets/itemTexture.png", SceneController.itemSize, 0x00FFFF);
    }
    sceneObject(name) {
        // @ts-ignore
        var object = this.objects.find(obj => obj.name === name);
        if (!object || object == undefined) {
            this.context.debugPrint("Can't find object with name: {" + name + "}!!!!!");
            this.addBoxAt(name, 0, 0, 0, "./assets/failbackTexture.png", SceneController.itemSize);
            return this.sceneObject(name);
        }
        return object;
    }
    moveObjectTo(name, x, y, z) {
        const sceneObject = this.sceneObject(name);
        sceneObject.threeObject.position.x = x;
        sceneObject.threeObject.position.y = y;
        sceneObject.threeObject.position.z = z;
    }
    rotateObject(name, x, y, z) {
        const sceneObject = this.sceneObject(name);
        sceneObject.threeObject.rotation.x = x;
        sceneObject.threeObject.rotation.y = y;
        sceneObject.threeObject.rotation.z = z;
    }
}
SceneController.itemSize = 1;
SceneController.carSize = 1;
SceneController.roadSegmentSize = 2;
SceneController.skyboxPositionDiffX = 0.5;
