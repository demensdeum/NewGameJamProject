var InGameState = /** @class */ (function () {
    function InGameState(name) {
        this.name = name;
    }
    InGameState.prototype.initialize = function (context) {
        context.sceneController.addCubeAt(0, 0, 0);
        context.sceneController.moveCameraTo(0, 0, 10);
        context.debugPrint("In Game State Initialized");
    };
    InGameState.prototype.step = function () {
    };
    return InGameState;
}());
export { InGameState };
