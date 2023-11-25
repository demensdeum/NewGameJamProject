import { State } from './state';
import { Context } from './context';
import { Utils } from './utils.js'
import { SceneController } from './sceneController.js';

export class InGameState implements State {
  
  private readonly roadSegmentsColumnsCount: number = 4;
  private readonly roadSegmentsRowsCount: number = 20;

  public static roadSegmentsXOffset: number = -(SceneController.roadSegmentSize + SceneController.roadSegmentSize / 2);
  public name: string;

  private sceneController?: SceneController;

  constructor(
    name: string
  ) {
    this.name = name;
  }

  public initialize(
    context: Context
  ): void {
    this.sceneController = context.sceneController;

    this.sceneController.addBackground();

    this.sceneController.addCarAt(
      "playerCar",
      0, 
      -2, 
      -4
    );

    for (let x = 0; x < this.roadSegmentsColumnsCount; x++) {
      for (let z = 0; z < this.roadSegmentsRowsCount; z++) {
        const name = "roadSegment-"+x+":"+z;
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
  }
}