import { State } from './state';
import { Context } from './context';
import { Utils } from './utils.js'
import { SceneController } from './sceneController.js';

export class InGameState implements State {
  
  public static roadSegmentsXOffset: number = SceneController.roadSegmentSize;
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public initialize(
    context: Context
  ): void {
    context.sceneController.addCarAt(
      "playerCar",
      0, 
      -2, 
      -4
    );

    const columnsCount = 3;
    const rowsCount = 20;


    for (let x = 0; x < columnsCount; x++) {
      for (let y = 0; y < rowsCount; y++) {
        const name = "roadSegment-"+x+":"+y;
        const roadSegmentX = x * SceneController.roadSegmentSize - InGameState.roadSegmentsXOffset;
        const roadSegmentZ = -y * SceneController.roadSegmentSize;
        context.sceneController.addRoadSegmentAt(
          name,
          roadSegmentX, 
          -3, 
          roadSegmentZ
          );
      }
    }
    context.sceneController.moveObjectTo(
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