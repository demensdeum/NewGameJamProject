import { Utils } from './utils.js';
import { SceneObject } from "./sceneObject.js";
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
    SceneController.prototype.addBackground = function () {
        this.addPlaneAt("background", 0, 0, -0.5, 1, 1, "data/background.png", 0x0000FF, true);
    };
    SceneController.prototype.addBoxAt = function (name, x, y, z, color) {
        this.context.debugPrint("addCubeAt");
        // @ts-ignore
        var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        // @ts-ignore
        var boxMaterial = new THREE.MeshBasicMaterial({ color: color });
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
        this.addBoxAt(name, x, y, z, 0x00FF00);
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
    SceneController.prototype.sceneObject = function (name) {
        // @ts-ignore
        var object = this.objects.find(function (obj) { return obj.name === name; });
        if (!object || object == undefined) {
            this.context.debugPrint("Can't find object with name: {" + name + "}!!!!!");
            this.addBoxAt(name, 0, 0, 0, 0x0000FF);
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
    SceneController.roadSegmentSize = 4;
    return SceneController;
}());
export { SceneController };
