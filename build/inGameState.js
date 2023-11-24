var InGameState = /** @class */ (function () {
    function InGameState(name) {
        this.name = name;
        this.initialized = false;
    }
    InGameState.prototype.initialize = function (context, scene, camera) {
        // @ts-ignore
        var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        // @ts-ignore
        var boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        // @ts-ignore
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        camera.position.z = 10;
        scene.add(box);
        this.initialized = true;
        context.debugPrint("In Game State Initialized");
    };
    InGameState.prototype.step = function (context, scene, camera) {
        if (!this.initialized) {
            this.initialize(context, scene, camera);
        }
    };
    return InGameState;
}());
export { InGameState };
