import { Utils } from './utils.js';
var SceneController = /** @class */ (function () {
    function SceneController(context) {
        this.context = context;
        // @ts-ignore
        this.textureLoader = new THREE.TextureLoader();
        // @ts-ignore
        this.scene = new THREE.Scene();
        // @ts-ignore      
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.name = "camera";
        this.objects = [this.camera];
        // @ts-ignore      
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
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
    SceneController.prototype.addBoxAt = function (name, x, y, z, color) {
        this.context.debugPrint("addCubeAt");
        // @ts-ignore
        var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        // @ts-ignore
        var boxMaterial = new THREE.MeshBasicMaterial({ color: color });
        // @ts-ignore
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.name = name;
        box.position.x = x;
        box.position.y = y;
        box.position.z = z;
        this.scene.add(box);
        this.objects.push(box);
    };
    SceneController.prototype.addPlaneAt = function (name, x, y, z, width, height) {
        this.context.debugPrint("addPlaneAt");
        // @ts-ignore
        var planeGeometry = new THREE.PlaneGeometry(width, height);
        var texture = this.loadTexture("./data/roadSegmentTexture.png");
        // @ts-ignore
        var planeMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            // @ts-ignore
            side: THREE.DoubleSide
        });
        // @ts-ignore
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.name = name;
        plane.position.x = x;
        plane.position.y = y;
        plane.position.z = z;
        this.scene.add(plane);
        this.objects.push(plane);
    };
    SceneController.prototype.addCarAt = function (name, x, y, z) {
        this.context.debugPrint("addCarAt");
        this.addBoxAt(name, x, y, z, 0x00FF00);
    };
    SceneController.prototype.addRoadSegmentAt = function (name, x, y, z) {
        this.context.debugPrint("addRoadSegmentAt");
        this.addPlaneAt(name, x, y, z, 4, 4);
        this.rotateObject(name, Utils.angleToRadians(-90), 0, 0);
    };
    SceneController.prototype.objectWithName = function (name) {
        // @ts-ignore
        var object = this.objects.find(function (obj) { return obj.name === name; });
        if (!object || object == undefined) {
            this.context.debugPrint("Can't find object with name: {" + name + "}!!!!!");
            this.addBoxAt(name, 0, 0, 0, 0x0000FF);
            return this.objectWithName(name);
        }
        return object;
    };
    SceneController.prototype.moveObjectTo = function (name, x, y, z) {
        var object = this.objectWithName(name);
        object.position.x = x;
        object.position.y = y;
        object.position.z = z;
    };
    SceneController.prototype.rotateObject = function (name, x, y, z) {
        var object = this.objectWithName(name);
        object.rotation.x = x;
        object.rotation.y = y;
        object.rotation.z = z;
    };
    return SceneController;
}());
export { SceneController };
