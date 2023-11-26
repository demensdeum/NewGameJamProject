import { Utils } from './utils.js';
import { SceneController } from './sceneController.js';
import { GameInputMouseEvent } from './gameInputMouseEvent.js';
import { Identifiers as Names } from './names.js';
import { ObjectsPool } from './objectsPool.js';
export class InGameState {
    constructor(name, context, sceneController) {
        this.roadSegmentsColumnsCount = 3;
        this.roadSegmentsRowsCount = 10;
        this.itemsCount = this.roadSegmentsRowsCount * 2;
        this.floorY = -2;
        this.isItemOnRespawnRow = "";
        this.speedLimit = 0.2;
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
        this.sceneController.moveObjectTo(Names.camera, 0, 12, -10);
        this.sceneController.rotateObject(Names.camera, Utils.angleToRadians(-80), 0, 0);
        this.sceneController.addUI(context.gameData);
        for (var i = 0; i < this.itemsCount; i++) {
            const name = this.itemName(i);
            this.sceneController.addItemAt(name, 0, this.floorY + SceneController.carSize * 0.5, 0);
            this.randomizeItemStartPosition(this.itemName(i));
        }
        context.debugPrint("In Game State Initialized");
    }
    randomizeItemStartPosition(name) {
        // const position = this.sceneController.sceneObjectPosition(name);
        // position.x = Utils.randomInt(this.roadSegmentsColumnsCount) * SceneController.roadSegmentSize;
        // var maybeSlotZ: number | null = this.freeSlotsZ.pop() ?? null;
        // if (maybeSlotZ == null) {
        //   this.context.debugPrint("No FREE SLOTS!! WAIT PLEASE!!!");
        //   return;
        // }
        // const zSlot = maybeSlotZ!;
        // this.itemToSlotZ[name] = zSlot;
        // position.z = Math.floor(this.horizonDotZ() - zSlot * SceneController.roadSegmentSize);
        const position = this.sceneController.sceneObjectPosition(name);
        if (this.isItemOnRespawnRow == "") {
            position.x = Utils.randomInt(this.roadSegmentsColumnsCount) * SceneController.roadSegmentSize;
            position.z = Math.floor(this.horizonDotZ());
            this.context.debugPrint("SET ITEM AS COOLEST GUY ON THE BLOCK!!!");
            this.isItemOnRespawnRow = name;
        }
        else {
            this.context.debugPrint("CUBE IS ON RESPAWN ROW!! WAIT!!!");
        }
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
        this.context.debugPrint("eh: " + this.isItemOnRespawnRow);
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
        return -SceneController.roadSegmentSize * this.roadSegmentsRowsCount;
    }
    moveItems() {
        this.isItemOnRespawnRow = "";
        for (var i = 0; i < this.itemsCount; i++) {
            const itemName = this.itemName(i);
            const itemPosition = this.sceneController.sceneObjectPosition(itemName);
            itemPosition.z += this.gameData.speed;
            if (itemPosition.z > SceneController.roadSegmentSize) {
                this.randomizeItemStartPosition(itemName);
            }
            else if (itemPosition.z < this.horizonDotZ() + SceneController.roadSegmentSize) {
                this.isItemOnRespawnRow = itemName;
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
                    roadSegmentPosition.z += this.horizonDotZ();
                }
                this.sceneController.moveObjectTo(roadSegmentName, roadSegmentPosition.x, roadSegmentPosition.y, roadSegmentPosition.z);
            }
        }
    }
}
