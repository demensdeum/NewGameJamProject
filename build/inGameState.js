var InGameState = /** @class */ (function () {
    function InGameState(name) {
        this.name = name;
    }
    InGameState.prototype.initialize = function (context) {
        context.sceneController.addCarAt("playerCar", 0, -2, -4);
        context.sceneController.addRoadSegmentAt("roadSegment1", 0, -3, -4);
        context.sceneController.addRoadSegmentAt("roadSegment2", 0, -3, -20);
        context.sceneController.moveObjectTo("camera", 0, 0, 0);
        context.debugPrint("In Game State Initialized");
    };
    InGameState.prototype.step = function () {
    };
    return InGameState;
}());
export { InGameState };
