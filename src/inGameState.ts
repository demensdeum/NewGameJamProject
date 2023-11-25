import { State } from './state';
import { Context } from './context';
import { Utils } from './utils.js'

export class InGameState implements State {
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
    context.sceneController.addRoadSegmentAt(
      "roadSegment1",
      0, 
      -3, 
      -4
      );
    context.sceneController.addRoadSegmentAt(
      "roadSegment2",
      0, 
      -3, 
      -20
      );
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