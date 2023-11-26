import { Utils } from './utils.js';
import { SceneController } from './sceneController.js';
import { GameInputMouseEvent } from './gameInputMouseEvent.js';
import { Identifiers as Names } from './names.js';
import { ObjectsPool } from './objectsPool.js';
import { ObjectsPoolItem } from './objectdsPoolItem.js';
export class InGameState {
    constructor(name, context, sceneController) {
        this.roadSegmentsColumnsCount = 3;
        this.roadSegmentsRowsCount = 25;
        this.itemsCount = 20;
        this.floorY = -2;
        this.speedLimit = 0.4;
        this.name = name;
        this.objectsPool = new ObjectsPool();
        this.context = context;
        this.gameData = this.context.gameData;
        this.sceneController = sceneController;
    }
    moveObjectByDiffX(name, diffX) {
        const position = this.sceneController.sceneObjectPosition(name);
        position.x += diffX;
        this.sceneController.moveObjectTo(name, position.x, position.y, position.z);
    }
    ;
    leftBorderX() {
        return -SceneController.roadSegmentSize * 0.5;
    }
    rightBorderX() {
        return this.roadSegmentsColumnsCount * SceneController.roadSegmentSize - SceneController.carSize;
    }
    minimalCarX() {
        return -SceneController.roadSegmentSize / 4;
    }
    maximalCarX() {
        return this.roadSegmentsColumnsCount * SceneController.roadSegmentSize - (SceneController.carSize + SceneController.carSize * 0.5);
    }
    inputControllerDidReceive(inputController, inputEvent) {
        if (inputEvent instanceof GameInputMouseEvent) {
            const value = inputEvent.value;
            const inputX = value.x;
            const xDiff = inputX;
            const position = this.sceneController.sceneObjectPosition(Names.playerCar);
            var newX = position.x + xDiff;
            const carLeftPointX = (position.x + xDiff) - SceneController.carSize * 0.5;
            const carRightPointX = (position.x + xDiff) + SceneController.carSize * 0.5;
            if (xDiff < 0 && carLeftPointX < this.leftBorderX()) {
                this.context.debugPrint("blocked L");
                newX = this.minimalCarX();
            }
            if (xDiff > 0 && carRightPointX > this.rightBorderX()) {
                this.context.debugPrint("blocked R");
                newX = this.maximalCarX();
            }
            const leftSkyBoxX = newX - SceneController.skyboxPositionDiffX;
            const rightSkyBoxX = newX + SceneController.skyboxPositionDiffX;
            this.changeObjectX(Names.playerCar, newX);
            this.changeObjectX(Names.camera, newX);
            this.changeObjectX(Names.skyboxLeft, leftSkyBoxX);
            this.changeObjectX(Names.skyboxFront, newX);
            this.changeObjectX(Names.skyboxRight, rightSkyBoxX);
        }
    }
    changeObjectX(name, x) {
        const position = this.sceneController.sceneObjectPosition(name);
        position.x = x;
        this.sceneController.moveObjectTo(name, position.x, position.y, position.z);
    }
    initialize(context) {
        this.context = context;
        this.sceneController = context.sceneController;
        this.sceneController.addSkybox();
        this.sceneController.addCarAt(Names.playerCar, 0, this.floorY + SceneController.carSize * 0.5, -4);
        for (let x = 0; x < this.roadSegmentsColumnsCount; x++) {
            for (let z = 0; z < this.roadSegmentsRowsCount; z++) {
                const name = this.roadSegmentName(x, z);
                const roadSegmentX = x * SceneController.roadSegmentSize;
                const roadSegmentZ = -z * SceneController.roadSegmentSize;
                this.sceneController.addRoadSegmentAt(name, roadSegmentX, this.floorY, roadSegmentZ);
            }
        }
        this.sceneController.moveObjectTo("camera", 0, 0, 0);
        this.sceneController.addUI(context.gameData);
        for (var i = 0; i < this.itemsCount; i++) {
            const name = this.itemName(i);
            this.sceneController.addItemAt(name, 0, this.floorY + SceneController.carSize * 0.5, 0);
            this.randomizeItemStartPosition(this.itemName(i));
            const objectsPoolItem = new ObjectsPoolItem(name);
            this.objectsPool.push(objectsPoolItem);
        }
        context.debugPrint("In Game State Initialized");
    }
    randomizeItemStartPosition(name) {
        const position = this.sceneController.sceneObjectPosition(name);
        position.x = Utils.randomInt(this.roadSegmentsColumnsCount) * SceneController.roadSegmentSize;
        position.z = this.horizonDotZ() + Utils.randomInt(this.roadSegmentsRowsCount) * SceneController.roadSegmentSize;
    }
    updateUI() {
        this.sceneController.updateUI();
    }
    collide() {
        this.gameData.score += 1;
    }
    step() {
        this.increaseSpeed();
        this.moveRoad();
        this.moveItems();
        this.spawnObjects();
        this.collide();
        this.updateUI();
    }
    increaseSpeed() {
        if (this.gameData.speed < this.speedLimit) {
            this.gameData.speed += 0.001;
        }
    }
    itemName(i) {
        return "item-" + i;
    }
    horizonDotZ() {
        return SceneController.roadSegmentSize * this.roadSegmentsRowsCount;
    }
    moveItems() {
        for (var i = 0; i < this.itemsCount; i++) {
            const itemPosition = this.sceneController.sceneObjectPosition(this.itemName(i));
            itemPosition.z += this.gameData.speed;
            if (itemPosition.z > SceneController.roadSegmentSize) {
                itemPosition.z -= this.horizonDotZ();
            }
        }
    }
    spawnObjects() {
        // this.objectsPool.tr
    }
    roadSegmentName(x, z) {
        const output = "roadSegment-" + x + ":" + z;
        return output;
    }
    moveRoad() {
        for (let x = 0; x < this.roadSegmentsColumnsCount; x++) {
            for (let z = 0; z < this.roadSegmentsRowsCount; z++) {
                const roadSegmentName = this.roadSegmentName(x, z);
                const roadSegmentPosition = this.sceneController.sceneObjectPosition(roadSegmentName);
                roadSegmentPosition.z += this.context.gameData.speed;
                if (roadSegmentPosition.z > SceneController.roadSegmentSize) {
                    roadSegmentPosition.z -= SceneController.roadSegmentSize * this.roadSegmentsRowsCount;
                }
                this.sceneController.moveObjectTo(roadSegmentName, roadSegmentPosition.x, roadSegmentPosition.y, roadSegmentPosition.z);
            }
        }
    }
}
