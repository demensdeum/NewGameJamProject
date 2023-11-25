import { State } from './state';
import { Context } from './context';

export class InGameState implements State {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }

  public initialize(
    context: Context
  ): void {
    context.sceneController.addCubeAt(0, 0, 0);
    context.sceneController.moveCameraTo(0, 0, 10);
    context.debugPrint("In Game State Initialized");
  }

  public step(): void {
  }
}