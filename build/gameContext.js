var GameContext = /** @class */ (function () {
    function GameContext(state, debugEnabled) {
        this.state = state;
        this.debugEnabled = debugEnabled;
        this.debugPrint("Game Context Initialized...");
        // @ts-ignore
        this.scene = new THREE.Scene();
        // @ts-ignore      
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // @ts-ignore      
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.isRunning = true;
    }
    GameContext.prototype.transitionTo = function (state) {
        console.log("Transitioning to ".concat(state.name));
        this.state = state;
    };
    GameContext.prototype.step = function () {
        this.renderer.render(this.scene, this.camera);
        this.state.step(this, this.scene, this.camera);
    };
    GameContext.prototype.debugPrint = function (text) {
        if (!this.debugEnabled) {
            return;
        }
        console.log(text);
    };
    return GameContext;
}());
export { GameContext };
