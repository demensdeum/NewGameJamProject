var SceneController = /** @class */ (function () {
    function SceneController(context) {
        this.context = context;
        // @ts-ignore
        this.scene = new THREE.Scene();
        // @ts-ignore      
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // @ts-ignore      
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }
    SceneController.prototype.step = function () {
        this.renderer.render(this.scene, this.camera);
    };
    SceneController.prototype.addCubeAt = function (x, y, z) {
        this.context.debugPrint("addCubeAt");
        // @ts-ignore
        var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        // @ts-ignore
        var boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        // @ts-ignore
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(box);
    };
    SceneController.prototype.moveCameraTo = function (x, y, z) {
        this.camera.position.x = x;
        this.camera.position.y = y;
        this.camera.position.z = z;
    };
    return SceneController;
}());
export { SceneController };
