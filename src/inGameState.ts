import { State } from './state';
import { Context } from './context';
import { Utils } from './utils.js'
import { SceneController } from './sceneController.js';
import { InputControllerDelegate } from './inputControllerDelegate';
import { GameInputEvent } from './gameInputEvent';
import { InputController } from './inputController';
import { GameInputMouseEvent } from './gameInputMouseEvent.js';

export class InGameState implements State, InputControllerDelegate {
  
  private readonly roadSegmentsColumnsCount: number = 4;
  private readonly roadSegmentsRowsCount: number = 25;

  public static roadSegmentsXOffset: number = -(SceneController.roadSegmentSize + SceneController.roadSegmentSize / 2);
  public name: string;

  private roadZdiff: number = 0.2;

  private sceneController: SceneController;
  private context?: Context;

  constructor(
    name: string,
    sceneController: SceneController
  ) {
    this.name = name;
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
        this.moveObjectByDiffX("background", xDiff);
      }
  }

  public initialize(
    context: Context
  ): void {
    this.context = context;
    this.sceneController = context.sceneController;

    this.sceneController.addBackground();

    this.sceneController.addCarAt(
      "player car",
      0, 
      -2, 
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
          -3, 
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
    context.debugPrint("In Game State Initialized");
  }

  public step(): void {
    this.moveRoad();
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
        roadSegmentPosition.z += this.roadZdiff;

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