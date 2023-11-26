import { Utils } from './utils.js';
import { SceneObject } from "./sceneObject.js";
import { Identifiers } from "./identifiers.js";
// @ts-ignore
import * as dat from '/libs/dat.gui.module.js';
var gui = new dat.GUI();
var SceneController = /** @class */ (function () {
    function SceneController(context, canvas) {
        this.context = context;
        this.canvas = canvas;
        // @ts-ignore
        this.textureLoader = new THREE.TextureLoader();
        // @ts-ignore
        this.scene = new THREE.Scene();
        // @ts-ignore      
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        var cameraSceneObject = new SceneObject("camera", this.camera);
        this.objects = [cameraSceneObject];
        // @ts-ignore      
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        var camera = this.camera;
        var renderer = this.renderer;
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
    SceneController.prototype.step = function () {
        this.renderer.render(this.scene, this.camera);
    };
    SceneController.prototype.loadTexture = function (path) {
        var texture = this.textureLoader.load(path);
        if (texture == null || texture == undefined) {
            this.context.debugPrint("Can't load texture: {path}!!!!!!!");
        }
        return this.textureLoader.load("./data/failbackTexture.png");
    };
    SceneController.prototype.addSceneObject = function (object) {
        // @ts-ignore
        var alreadyAddedObject = this.objects.find(function (obj) { return obj.name === object.name; });
        if (alreadyAddedObject) {
            this.context.raiseCriticalError("Duplicate name for object!!!:" + object.name);
            return;
        }
        this.objects.push(object);
        this.scene.add(object.threeObject);
    };
    SceneController.prototype.addUI = function (gameData) {
        var scoreView = gui
            .add(gameData, 'score')
            .name("Score");
        gui.add(gameData, 'speed')
            .name("Speed")
            .step(0.01);
        scoreView.domElement.style.pointerEvents = "none";
    };
    SceneController.prototype.updateUI = function () {
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
    };
    SceneController.prototype.addSkybox = function () {
        this.addPlaneAt(Identifiers.skyboxFront, 0, 0, -SceneController.skyboxPositionDiffX, 1, 1, "data/background.png", 0x0000FF, true);
        this.addPlaneAt(Identifiers.skyboxLeft, 0, 0, -SceneController.skyboxPositionDiffX, 1, 1, "data/background.png", 0x00FFFF, true);
        this.rotateObject(Identifiers.skyboxLeft, 0, Utils.angleToRadians(90), 0);
        this.moveObjectTo(Identifiers.skyboxLeft, -SceneController.skyboxPositionDiffX, 0, 0);
        this.addPlaneAt(Identifiers.skyboxRight, 0, 0, SceneController.skyboxPositionDiffX, 1, 1, "data/background.png", 0xFF00FF, true);
        this.rotateObject(Identifiers.skyboxRight, 0, Utils.angleToRadians(90), 0);
        this.moveObjectTo(Identifiers.skyboxRight, SceneController.skyboxPositionDiffX, 0, 0);
    };
    SceneController.prototype.addBoxAt = function (name, x, y, z, texturePath, color) {
        if (color === void 0) { color = 0x00FFFF; }
        this.context.debugPrint("addCubeAt");
        var texture = this.loadTexture(texturePath);
        var carSize = SceneController.carSize;
        // @ts-ignore
        var boxGeometry = new THREE.BoxGeometry(carSize, carSize, carSize);
        // @ts-ignore
        var boxMaterial = new THREE.MeshBasicMaterial({
            color: color,
            map: texture
        });
        // @ts-ignore
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.x = x;
        box.position.y = y;
        box.position.z = z;
        var sceneObject = new SceneObject(name, box);
        this.addSceneObject(sceneObject);
    };
    SceneController.prototype.addPlaneAt = function (name, x, y, z, width, height, texturePath, color, resetDepthBuffer) {
        if (color === void 0) { color = 0xFFFFFF; }
        if (resetDepthBuffer === void 0) { resetDepthBuffer = false; }
        this.context.debugPrint("addPlaneAt");
        // @ts-ignore
        var planeGeometry = new THREE.PlaneGeometry(width, height);
        var texture = this.loadTexture(texturePath);
        // @ts-ignore
        var planeMaterial = new THREE.MeshBasicMaterial({
            // @ts-ignore
            color: color,
            depthWrite: !resetDepthBuffer,
            map: texture,
            // @ts-ignore
            side: THREE.DoubleSide,
        });
        // @ts-ignore
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.x = x;
        plane.position.y = y;
        plane.position.z = z;
        var sceneObject = new SceneObject(name, plane);
        this.addSceneObject(sceneObject);
    };
    SceneController.prototype.addCarAt = function (name, x, y, z) {
        this.context.debugPrint("addCarAt");
        this.addBoxAt(name, x, y, z, "./data/carTexture.png");
    };
    SceneController.prototype.addRoadSegmentAt = function (name, x, y, z) {
        this.context.debugPrint("addRoadSegmentAt");
        this.addPlaneAt(name, x, y, z, SceneController.roadSegmentSize, SceneController.roadSegmentSize, "data/roadSegmentTexture.png");
        this.rotateObject(name, Utils.angleToRadians(-90), 0, 0);
    };
    SceneController.prototype.sceneObjectPosition = function (name) {
        var outputObject = this.sceneObject(name);
        var outputPosition = outputObject.threeObject.position;
        return outputPosition;
    };
    SceneController.prototype.addItemAt = function (name, x, y, z) {
        var item = this.addBoxAt(name, x, y, z, "./data/itemTexture.png", 0x00FFFF);
    };
    SceneController.prototype.sceneObject = function (name) {
        // @ts-ignore
        var object = this.objects.find(function (obj) { return obj.name === name; });
        if (!object || object == undefined) {
            this.context.debugPrint("Can't find object with name: {" + name + "}!!!!!");
            this.addBoxAt(name, 0, 0, 0, "./data/failbackTexture.png");
            return this.sceneObject(name);
        }
        return object;
    };
    SceneController.prototype.moveObjectTo = function (name, x, y, z) {
        var sceneObject = this.sceneObject(name);
        sceneObject.threeObject.position.x = x;
        sceneObject.threeObject.position.y = y;
        sceneObject.threeObject.position.z = z;
    };
    SceneController.prototype.rotateObject = function (name, x, y, z) {
        var sceneObject = this.sceneObject(name);
        sceneObject.threeObject.rotation.x = x;
        sceneObject.threeObject.rotation.y = y;
        sceneObject.threeObject.rotation.z = z;
    };
    SceneController.carSize = 1;
    SceneController.roadSegmentSize = 2;
    SceneController.skyboxPositionDiffX = 0.5;
    return SceneController;
}());
export { SceneController };
