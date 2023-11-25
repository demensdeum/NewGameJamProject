import { SceneController } from './sceneController.js';
import { GameInputMouseEvent } from './gameInputMouseEvent.js';
var InGameState = /** @class */ (function () {
    function InGameState(name, sceneController) {
        this.roadSegmentsColumnsCount = 4;
        this.roadSegmentsRowsCount = 25;
        this.roadZdiff = 0.2;
        this.name = name;
        this.sceneController = sceneController;
    }
    InGameState.prototype.moveObjectByDiffX = function (name, diffX) {
        var position = this.sceneController.sceneObjectPosition(name);
        position.x += diffX;
        this.sceneController.moveObjectTo(name, position.x, position.y, position.z);
    };
    ;
    InGameState.prototype.inputControllerDidReceive = function (inputController, inputEvent) {
        var _a;
        if (inputEvent instanceof GameInputMouseEvent) {
            var value = inputEvent.value;
            var inputX = value[0];
            var xDiff = inputX;
            (_a = this.context) === null || _a === void 0 ? void 0 : _a.debugPrint("xDiff:" + xDiff + "; y: " + value[1]);
            this.moveObjectByDiffX("player car", xDiff);
            this.moveObjectByDiffX("camera", xDiff);
            this.moveObjectByDiffX("background", xDiff);
        }
    };
    InGameState.prototype.initialize = function (context) {
        this.context = context;
        this.sceneController = context.sceneController;
        this.sceneController.addBackground();
        this.sceneController.addCarAt("player car", 0, -2, -4);
        for (var x = 0; x < this.roadSegmentsColumnsCount; x++) {
            for (var z = 0; z < this.roadSegmentsRowsCount; z++) {
                var name_1 = this.roadSegmentName(x, z);
                var roadSegmentX = x * SceneController.roadSegmentSize + InGameState.roadSegmentsXOffset;
                var roadSegmentZ = -z * SceneController.roadSegmentSize;
                this.sceneController.addRoadSegmentAt(name_1, roadSegmentX, -3, roadSegmentZ);
            }
        }
        this.sceneController.moveObjectTo("camera", 0, 0, 0);
        context.debugPrint("In Game State Initialized");
    };
    InGameState.prototype.step = function () {
        this.moveRoad();
    };
    InGameState.prototype.roadSegmentName = function (x, z) {
        var output = "roadSegment-" + x + ":" + z;
        return output;
    };
    InGameState.prototype.moveRoad = function () {
        for (var x = 0; x < this.roadSegmentsColumnsCount; x++) {
            for (var z = 0; z < this.roadSegmentsRowsCount; z++) {
                var roadSegmentName = this.roadSegmentName(x, z);
                var roadSegmentPosition = this.sceneController.sceneObjectPosition(roadSegmentName);
                roadSegmentPosition.z += this.roadZdiff;
                if (roadSegmentPosition.z > SceneController.roadSegmentSize) {
                    roadSegmentPosition.z -= SceneController.roadSegmentSize * this.roadSegmentsRowsCount;
                }
                this.sceneController.moveObjectTo(roadSegmentName, roadSegmentPosition.x, roadSegmentPosition.y, roadSegmentPosition.z);
            }
        }
    };
    InGameState.roadSegmentsXOffset = -(SceneController.roadSegmentSize + SceneController.roadSegmentSize / 2);
    return InGameState;
}());
export { InGameState };
