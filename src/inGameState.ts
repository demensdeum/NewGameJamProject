import { State } from './state';
import { Context } from './context';
import { Utils } from './utils.js'
import { SceneController } from './sceneController.js';
import { InputControllerDelegate } from './inputControllerDelegate';
import { GameInputEvent } from './gameInputEvent';
import { InputController } from './inputController';
import { GameInputMouseEvent } from './gameInputMouseEvent.js';
import { Identifiers } from './identifiers.js';
import { GameData } from './gameData.js';
import { ObjectsPool } from './objectsPool.js'
import { SceneObject } from './sceneObject';
import { ObjectsPoolItem } from './objectdsPoolItem.js';
import { SceneObjectIdentifier, SceneObjectIdentifier as SceneObjectName } from "./sceneObjectIdentifier.js"

export class InGameState implements State, InputControllerDelegate {
  
  private readonly roadSegmentsColumnsCount: number = 4;
  private readonly roadSegmentsRowsCount: number = 25;
  private readonly itemsCount: number = 10;
  private readonly floorY: number = -2;
  private readonly boxSize: number = 1;

  private speedLimit: number = 0.4;
  private objectsPool: ObjectsPool<SceneObjectName>;

  public static roadSegmentsXOffset: number = -(SceneController.roadSegmentSize + SceneController.roadSegmentSize / 2);
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

  public inputControllerDidReceive<T>(
    inputController: InputController, 
    inputEvent: GameInputEvent<T>): void {
      if (inputEvent instanceof GameInputMouseEvent) {
        const value = inputEvent.value;
        const inputX = value[0];
        const xDiff = inputX;
        this.context?.debugPrint("xDiff:"+xDiff+"; y: " + value[1]);
        this.moveObjectByDiffX("player car", xDiff);
        this.moveObjectByDiffX("camera", xDiff);
        this.moveObjectByDiffX(Identifiers.skyboxLeft, xDiff);
        this.moveObjectByDiffX(Identifiers.skyboxFront, xDiff);
        this.moveObjectByDiffX(Identifiers.skyboxRight, xDiff);
      }
  }

  public initialize(
    context: Context
  ): void {
    this.context = context;
    this.sceneController = context.sceneController;

    this.sceneController.addSkybox();

    this.sceneController.addCarAt(
      "player car",
      0, 
      this.floorY + this.boxSize*0.5, 
      -4
    );

    for (let x = 0; x < this.roadSegmentsColumnsCount; x++) {
      for (let z = 0; z < this.roadSegmentsRowsCount; z++) {
        const name = this.roadSegmentName(x, z);
        const roadSegmentX = x * SceneController.roadSegmentSize + InGameState.roadSegmentsXOffset;
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
        this.floorY + this.boxSize * 0.5,
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
    position.x = Utils.randomInt(4) * SceneController.roadSegmentSize + InGameState.roadSegmentsXOffset;
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