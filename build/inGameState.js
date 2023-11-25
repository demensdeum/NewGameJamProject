import { SceneController } from './sceneController.js';
var InGameState = /** @class */ (function () {
    function InGameState(name) {
        this.name = name;
    }
    InGameState.prototype.initialize = function (context) {
        context.sceneController.addCarAt("playerCar", 0, -2, -4);
        var columnsCount = 3;
        var rowsCount = 20;
        for (var x = 0; x < columnsCount; x++) {
            for (var y = 0; y < rowsCount; y++) {
                var name_1 = "roadSegment-" + x + ":" + y;
                var roadSegmentX = x * SceneController.roadSegmentSize - InGameState.roadSegmentsXOffset;
                var roadSegmentZ = -y * SceneController.roadSegmentSize;
                context.sceneController.addRoadSegmentAt(name_1, roadSegmentX, -3, roadSegmentZ);
            }
        }
        context.sceneController.moveObjectTo("camera", 0, 0, 0);
        context.debugPrint("In Game State Initialized");
    };
    InGameState.prototype.step = function () {
    };
    InGameState.roadSegmentsXOffset = SceneController.roadSegmentSize;
    return InGameState;
}());
export { InGameState };
