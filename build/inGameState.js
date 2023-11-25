import { Utils } from './utils.js';
import { SceneController } from './sceneController.js';
import { GameInputMouseEvent } from './gameInputMouseEvent.js';
import { Identifiers } from './identifiers.js';
import { ObjectsPool } from './objectsPool.js';
import { ObjectsPoolItem } from './objectdsPoolItem.js';
var InGameState = /** @class */ (function () {
    function InGameState(name, context, sceneController) {
        this.roadSegmentsColumnsCount = 4;
        this.roadSegmentsRowsCount = 25;
        this.itemsCount = 10;
        this.floorY = -2;
        this.boxSize = 1;
        this.speedLimit = 0.4;
        this.name = name;
        this.objectsPool = new ObjectsPool();
        this.context = context;
        this.gameData = this.context.gameData;
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
            this.moveObjectByDiffX(Identifiers.skyboxLeft, xDiff);
            this.moveObjectByDiffX(Identifiers.skyboxFront, xDiff);
            this.moveObjectByDiffX(Identifiers.skyboxRight, xDiff);
        }
    };
    InGameState.prototype.initialize = function (context) {
        this.context = context;
        this.sceneController = context.sceneController;
        this.sceneController.addSkybox();
        this.sceneController.addCarAt("player car", 0, this.floorY + this.boxSize * 0.5, -4);
        for (var x = 0; x < this.roadSegmentsColumnsCount; x++) {
            for (var z = 0; z < this.roadSegmentsRowsCount; z++) {
                var name_1 = this.roadSegmentName(x, z);
                var roadSegmentX = x * SceneController.roadSegmentSize + InGameState.roadSegmentsXOffset;
                var roadSegmentZ = -z * SceneController.roadSegmentSize;
                this.sceneController.addRoadSegmentAt(name_1, roadSegmentX, this.floorY, roadSegmentZ);
            }
        }
        this.sceneController.moveObjectTo("camera", 0, 0, 0);
        this.sceneController.addUI(context.gameData);
        for (var i = 0; i < this.itemsCount; i++) {
            var name_2 = this.itemName(i);
            this.sceneController.addItemAt(name_2, 0, this.floorY + this.boxSize * 0.5, 0);
            this.randomizeItemStartPosition(this.itemName(i));
            var objectsPoolItem = new ObjectsPoolItem(name_2);
            this.objectsPool.push(objectsPoolItem);
        }
        context.debugPrint("In Game State Initialized");
    };
    InGameState.prototype.randomizeItemStartPosition = function (name) {
        var position = this.sceneController.sceneObjectPosition(name);
        position.x = Utils.randomInt(4) * SceneController.roadSegmentSize + InGameState.roadSegmentsXOffset;
        position.z = this.horizonDotZ() + Utils.randomInt(this.roadSegmentsRowsCount) * SceneController.roadSegmentSize;
    };
    InGameState.prototype.updateUI = function () {
        this.sceneController.updateUI();
    };
    InGameState.prototype.collide = function () {
        this.gameData.score += 1;
    };
    InGameState.prototype.step = function () {
        this.increaseSpeed();
        this.moveRoad();
        this.moveItems();
        this.spawnObjects();
        this.collide();
        this.updateUI();
    };
    InGameState.prototype.increaseSpeed = function () {
        if (this.gameData.speed < this.speedLimit) {
            this.gameData.speed += 0.001;
        }
    };
    InGameState.prototype.itemName = function (i) {
        return "item-" + i;
    };
    InGameState.prototype.horizonDotZ = function () {
        return SceneController.roadSegmentSize * this.roadSegmentsRowsCount;
    };
    InGameState.prototype.moveItems = function () {
        for (var i = 0; i < this.itemsCount; i++) {
            var itemPosition = this.sceneController.sceneObjectPosition(this.itemName(i));
            itemPosition.z += this.gameData.speed;
            if (itemPosition.z > SceneController.roadSegmentSize) {
                itemPosition.z -= this.horizonDotZ();
            }
        }
    };
    InGameState.prototype.spawnObjects = function () {
        // this.objectsPool.tr
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
                roadSegmentPosition.z += this.context.gameData.speed;
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
