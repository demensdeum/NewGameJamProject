import { State } from './state.js';
import { SceneController } from './sceneController.js';
import { IdleState } from './IdleState.js';

export class Context {
  public isRunning: boolean = false;
  public sceneController: SceneController;
  private state: State;
  private debugEnabled: boolean;

  constructor(
    debugEnabled: boolean
  ) {
      this.state = new IdleState();
      this.sceneController = new SceneController(this);
      this.debugEnabled = debugEnabled;
      this.debugPrint("Game Context Initialized...");
  }

  public start(
    state: State
  )
  {   
    this.state = state;
    this.isRunning = true;     
    this.transitionTo(this.state);    
  }

  public raiseCriticalError(error: string) {
    if (this.debugEnabled) {
      console.error(error);
    }
    else {
      alert(error);
    }
    this.isRunning = false;
  }

  public transitionTo(state: State): void {
    this.debugPrint(`Transitioning to ${state.name}`);
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
