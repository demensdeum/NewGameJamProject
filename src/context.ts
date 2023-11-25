import { State } from './state.js';
import { SceneController } from './sceneController.js';

export class Context {
  public isRunning: boolean;
  public sceneController: SceneController;
  private state: State;
  private debugEnabled: boolean;

  constructor(
    state: State,
    debugEnabled: boolean
  ) {
      this.state = state;
      this.sceneController = new SceneController(this);
      this.debugEnabled = debugEnabled;
      this.debugPrint("Game Context Initialized...");
      this.isRunning = true;
      this.transitionTo(this.state);
  }

  public transitionTo(state: State): void {
    console.log(`Transitioning to ${state.name}`);
    this.state = state;
    this.state.initialize(this);
  }

  public step() {
    this.sceneController.step();
    this.state.step();
  }

  public debugPrint(text: string): void {
    if (!this.debugEnabled) {
      return;
    }
    console.log(text)
  }  
}
