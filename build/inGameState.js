import { Utils } from './utils.js';
import { SceneController } from './sceneController.js';
import { GameInputMouseEvent } from './gameInputMouseEvent.js';
import { Names } from './names.js';
import { ObjectsPool } from './objectsPool.js';
export class InGameState {
    constructor(name, context, sceneController) {
        this.roadSegmentsColumnsCount = 3;
        this.roadSegmentsRowsCount = 27;
        this.itemsCount = this.roadSegmentsRowsCount / 4;
        this.floorY = -2;
        this.birdView = false;
        this.itemRareChance = 20;
        this.hidingPlaceZ = SceneController.roadSegmentSize;
        this.speedLimitMax = 0.2;
        this.isRunning = false;
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
        const state = this;
        this.sceneController.addPlayerCarAt(Names.playerCar, 0, this.floorY + SceneController.carSize * 0.5, -4, () => {
            state.start();
        });
        for (let x = 0; x < this.roadSegmentsColumnsCount; x++) {
            for (let z = 0; z < this.roadSegmentsRowsCount; z++) {
                const name = this.roadSegmentName(x, z);
                const roadSegmentX = x * SceneController.roadSegmentSize;
                const roadSegmentZ = -z * SceneController.roadSegmentSize;
                this.sceneController.addRoadSegmentAt(name, roadSegmentX, this.floorY, roadSegmentZ);
            }
        }
        this.sceneController.moveObjectTo(Names.camera, 0, this.birdView ? 8 : 0, this.birdView ? -4 : 0);
        this.sceneController.rotateObject(Names.camera, this.birdView ? Utils.angleToRadians(-80) : 0, 0, 0);
        this.sceneController.addUI(context.gameData);
        for (var i = 0; i < this.itemsCount; i++) {
            const name = this.itemName(i);
            this.sceneController.addItemAt(name, 0, this.floorY + SceneController.itemSize * 0.5, 0, () => {
                context.debugPrint("item loaded");
            });
            this.objectsPool.push(name);
        }
        this.sceneController.addLight();
        context.debugPrint("In Game State Initialized");
        alert("Добро пожаловать в AudioStorm: Melodic Wave!");
    }
    start() {
        this.gameData.endDate = new Date(new Date().getTime() + 120000);
        this.gameData.speedLimit = 0.1;
        this.gameData.speed = 0;
        this.gameData.message = this.context.translator.translatedStringForKey("Game Started!");
        this.isRunning = true;
    }
    updateUI() {
        this.sceneController.updateUI();
    }
    hideItem(name) {
        this.sceneController.moveObjectTo(name, 0, 0, this.hidingPlaceZ);
    }
    collide() {
        for (var i = 0; i < this.itemsCount; i++) {
            const itemName = this.itemName(i);
            if (this.sceneController.objectCollidesWithObject(Names.playerCar, itemName)) {
                this.gameData.score += 100;
                this.hideItem(itemName);
                this.context.soundPlayer.play("./assets/beep.ogg");
                this.gameData.message = this.context.translator.translatedStringForKey("Music cube!");
                const speedUpCratesCount = 4;
                const speedUpScoreStep = speedUpCratesCount * 100;
                if (this.gameData.score % speedUpScoreStep == 0) {
                    this.gameData.speedLimit = Math.min(this.gameData.speedLimit + 0.005, this.speedLimitMax);
                    this.context.soundPlayer.play("./assets/boost.ogg");
                    this.gameData.message = this.context.translator.translatedStringForKey("Speed boost!");
                }
            }
            else {
                continue;
            }
        }
    }
    gameEnd() {
        alert("Игра завершилась! Вы набрали: " + this.gameData.score + " очков!");
        location.reload();
    }
    step() {
        if (this.isRunning) {
            // @ts-ignore
            const timeDiff = this.gameData.endDate.getTime() - new Date().getTime();
            if (timeDiff < 1) {
                this.start();
                this.gameEnd();
            }
            const diffSeconds = Math.floor((timeDiff / 1000));
            this.gameData.time = diffSeconds;
            this.sceneController.animationsStep();
            this.increaseSpeed();
            this.moveRoad();
            this.moveItems();
            this.collide();
            this.updateUI();
        }
    }
    increaseSpeed() {
        if (this.gameData.speed < this.gameData.speedLimit) {
            this.gameData.speed += 0.001;
            this.gameData.speedOutput += 1;
        }
    }
    itemName(i) {
        return "item-" + i;
    }
    horizonDotZ() {
        return -SceneController.roadSegmentSize * this.roadSegmentsRowsCount;
    }
    moveItems() {
        for (var i = 0; i < this.itemsCount; i++) {
            const itemName = this.itemName(i);
            const itemPosition = this.sceneController.sceneObjectPosition(itemName);
            itemPosition.z += this.gameData.speed;
            if (itemPosition.z > SceneController.roadSegmentSize) {
                this.objectsPool.push(itemName);
            }
        }
    }
    roadSegmentName(x, z) {
        const output = "roadSegment-" + x + ":" + z;
        return output;
    }
    tryToaddItemAtLastRow() {
        const item = this.objectsPool.tryPop();
        if (!item) {
            this.context.debugPrint("NO FREE ITEMS!!! WAIT!!!");
            return;
        }
        const itemName = item;
        for (var i = 0; i < this.itemsCount; i++) {
            const maybeRowOccupantItemName = this.itemName(i);
            const maybeRowOccupantItemPosition = this.sceneController.sceneObjectPosition(maybeRowOccupantItemName);
            if (maybeRowOccupantItemPosition.z == this.horizonDotZ()) {
                //this.context.debugPrint("SPAWN ROW OCCUPIED!!! WAIT PLS!!!");        
                return;
            }
        }
        this.sceneController.moveObjectTo(itemName, Utils.randomInt(this.roadSegmentsColumnsCount) * SceneController.roadSegmentSize, this.floorY + SceneController.carSize * 0.5, this.horizonDotZ());
    }
    moveRoad() {
        for (let x = 0; x < this.roadSegmentsColumnsCount; x++) {
            for (let z = 0; z < this.roadSegmentsRowsCount; z++) {
                const roadSegmentName = this.roadSegmentName(x, z);
                const roadSegmentPosition = this.sceneController.sceneObjectPosition(roadSegmentName);
                roadSegmentPosition.z += this.context.gameData.speed;
                if (roadSegmentPosition.z > this.hidingPlaceZ) {
                    roadSegmentPosition.z += this.horizonDotZ();
                    if (Utils.randomInt(this.itemRareChance) == 0) {
                        this.tryToaddItemAtLastRow();
                    }
                }
                this.sceneController.moveObjectTo(roadSegmentName, roadSegmentPosition.x, roadSegmentPosition.y, roadSegmentPosition.z);
            }
        }
    }
}
