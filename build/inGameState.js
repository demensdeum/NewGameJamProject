import { SceneController } from './sceneController.js';
var InGameState = /** @class */ (function () {
    function InGameState(name) {
        this.roadSegmentsColumnsCount = 4;
        this.roadSegmentsRowsCount = 20;
        this.name = name;
    }
    InGameState.prototype.initialize = function (context) {
        this.sceneController = context.sceneController;
        this.sceneController.addBackground();
        this.sceneController.addCarAt("playerCar", 0, -2, -4);
        for (var x = 0; x < this.roadSegmentsColumnsCount; x++) {
            for (var z = 0; z < this.roadSegmentsRowsCount; z++) {
                var name_1 = "roadSegment-" + x + ":" + z;
                var roadSegmentX = x * SceneController.roadSegmentSize + InGameState.roadSegmentsXOffset;
                var roadSegmentZ = -z * SceneController.roadSegmentSize;
                this.sceneController.addRoadSegmentAt(name_1, roadSegmentX, -3, roadSegmentZ);
            }
        }
        this.sceneController.moveObjectTo("camera", 0, 0, 0);
        context.debugPrint("In Game State Initialized");
    };
    InGameState.prototype.step = function () {
    };
    InGameState.roadSegmentsXOffset = -(SceneController.roadSegmentSize + SceneController.roadSegmentSize / 2);
    return InGameState;
}());
export { InGameState };
