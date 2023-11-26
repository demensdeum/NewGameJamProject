import { State } from './state';
import { Context } from './context';
import { Utils } from './utils.js'
import { SceneController } from './sceneController.js';
import { InputControllerDelegate } from './inputControllerDelegate';
import { GameInputEvent } from './gameInputEvent';
import { InputController } from './inputController';
import { GameInputMouseEvent } from './gameInputMouseEvent.js';
import { Identifiers as Names } from './names.js';
import { GameData } from './gameData.js';
import { ObjectsPool } from './objectsPool.js'
import { SceneObject } from './sceneObject';
import { ObjectsPoolItem } from './objectdsPoolItem.js';
import { SceneObjectIdentifier, SceneObjectIdentifier as SceneObjectName } from "./sceneObjectIdentifier.js"

export class InGameState implements State, InputControllerDelegate {
  
  private readonly roadSegmentsColumnsCount: number = 3;
  private readonly roadSegmentsRowsCount: number = 25;
  private readonly itemsCount: number = 20;
  private readonly floorY: number = -2;

  private speedLimit: number = 0.4;
  private objectsPool: ObjectsPool<SceneObjectName>;

  public name: string;

  private sceneController: SceneController;
  private context: Context;
  private gameData: GameData;

  constructor(
    name: string,
    context: Context,
    sceneController: SceneController
  ) {
    this.name = name;
    this.objectsPool = new ObjectsPool<SceneObjectName>();    
    this.context = context;
    this.gameData = this.context.gameData;
    this.sceneController = sceneController;
  }

  private moveObjectByDiffX(
    name: string,
    diffX: number
  ) {
    const position = this.sceneController.sceneObjectPosition(
      name
    );
    position.x += diffX;
    this.sceneController.moveObjectTo(
      name,
      position.x,
      position.y,
      position.z
    );
  };

  private leftBorderX() {
    return -SceneController.roadSegmentSize.half();
  }

  private rightBorderX() {
    return this.roadSegmentsColumnsCount * SceneController.roadSegmentSize - SceneController.carSize;
  }

  private minimalCarX() {
    return -SceneController.roadSegmentSize / 4;
  }

  private maximalCarX() {
    return this.roadSegmentsColumnsCount * SceneController.roadSegmentSize - (SceneController.carSize + SceneController.carSize.half());
  }

  public inputControllerDidReceive<T>(
    inputController: InputController, 
    inputEvent: GameInputEvent<T>): void {
      if (inputEvent instanceof GameInputMouseEvent) {
        const value = inputEvent.value;
        const inputX = value.x;
        const xDiff = inputX;
        const position = this.sceneController.sceneObjectPosition(Names.playerCar);
        var newX = position.x + xDiff;
        const carLeftPointX = (position.x + xDiff) - SceneController.carSize.half();
        const carRightPointX = (position.x + xDiff) + SceneController.carSize.half();
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

  private changeObjectX(name: SceneObjectIdentifier, x: number) {
    const position = this.sceneController.sceneObjectPosition(
      name
    );
    position.x = x;
    this.sceneController.moveObjectTo(
      name,
      position.x,
      position.y,
      position.z
    )
  }

  public initialize(
    context: Context
  ): void {
    this.context = context;
    this.sceneController = context.sceneController;

    this.sceneController.addSkybox();

    this.sceneController.addCarAt(
      Names.playerCar,
      0, 
      this.floorY + SceneController.carSize.half(), 
      -4
    );

    for (let x = 0; x < this.roadSegmentsColumnsCount; x++) {
      for (let z = 0; z < this.roadSegmentsRowsCount; z++) {
        const name = this.roadSegmentName(x, z);
        const roadSegmentX = x * SceneController.roadSegmentSize;
        const roadSegmentZ = -z * SceneController.roadSegmentSize;
        this.sceneController.addRoadSegmentAt(
          name,
          roadSegmentX, 
          this.floorY, 
          roadSegmentZ
          );
      }
    }
    this.sceneController.moveObjectTo(
      "camera", 
      0, 
      0, 
      0
    );
    this.sceneController.addUI(context.gameData);

    for (var i = 0; i < this.itemsCount; i++) {
      const name = this.itemName(i);
      this.sceneController.addItemAt(
        name,
        0,
        this.floorY + SceneController.carSize.half(),
        0
      );

      this.randomizeItemStartPosition(this.itemName(i));

      const objectsPoolItem = new ObjectsPoolItem<SceneObjectName>(
        name
      );
      this.objectsPool.push(objectsPoolItem);
    }

    context.debugPrint("In Game State Initialized");
  }

  private randomizeItemStartPosition(name: SceneObjectIdentifier) {
    const position = this.sceneController.sceneObjectPosition(name);
    position.x = Utils.randomInt(this.roadSegmentsColumnsCount) * SceneController.roadSegmentSize;
    position.z = this.horizonDotZ() + Utils.randomInt(this.roadSegmentsRowsCount) * SceneController.roadSegmentSize;
  }

  private updateUI(): void {
    this.sceneController.updateUI();
  }

  private collide(): void {
    this.gameData.score += 1;
  }

  public step(): void {
    this.increaseSpeed();
    this.moveRoad();
    this.moveItems();
    this.spawnObjects();
    this.collide();
    this.updateUI();
  }

  private increaseSpeed() {
    if (this.gameData.speed < this.speedLimit) {
      this.gameData.speed += 0.001;
    }
  }

  private itemName(i: number) {
    return "item-"+i
  }

  private horizonDotZ() {
    return SceneController.roadSegmentSize * this.roadSegmentsRowsCount
  }

  private moveItems() {
    for (var i=0; i < this.itemsCount ; i++) {
      const itemPosition = this.sceneController.sceneObjectPosition(this.itemName(i));
      itemPosition.z += this.gameData.speed;

      if (itemPosition.z > SceneController.roadSegmentSize) {
        itemPosition.z -=  this.horizonDotZ();
      }
    }
  }

  private spawnObjects() {
    // this.objectsPool.tr
  }

  private roadSegmentName(
    x: number,
    z: number
  ) {
    const output = "roadSegment-"+x+":"+z;
    return output;
  }

  private moveRoad() {
    for (let x = 0; x < this.roadSegmentsColumnsCount; x++) {
      for (let z = 0; z < this.roadSegmentsRowsCount; z++) {
        const roadSegmentName = this.roadSegmentName(x, z);
        const roadSegmentPosition = this.sceneController.sceneObjectPosition(
          roadSegmentName
        );
        roadSegmentPosition.z += this.context.gameData.speed;

        if (roadSegmentPosition.z > SceneController.roadSegmentSize) {
          roadSegmentPosition.z -= SceneController.roadSegmentSize * this.roadSegmentsRowsCount;
        }

        this.sceneController.moveObjectTo(
          roadSegmentName,
          roadSegmentPosition.x,
          roadSegmentPosition.y,
          roadSegmentPosition.z
        )
      }
    }
  }
}