import { State } from './state.js';
import { SceneController } from './sceneController.js';
import { IdleState } from './idleState.js';
import { InputController } from './inputController.js';
import { InputControllerDelegate } from './inputControllerDelegate.js';
import { GameInputEvent } from './gameInputEvent.js';
import { GameInputKeyboardEvent } from './gameInputKeyboardEvent.js';

export class Context implements InputControllerDelegate {
  public isRunning: boolean = false;
  public sceneController: SceneController;

  private readonly canvas?: HTMLCanvasElement | null = document.querySelector("canvas");
  private inputController: InputController;
  private state: State;
  private debugEnabled: boolean;

  constructor(
    debugEnabled: boolean
  ) {
      this.debugEnabled = debugEnabled;    
      this.state = new IdleState();

      if (!this.canvas || this.canvas == undefined) {
        this.raiseCriticalError("1Canvas in NULL!!!!");
      }
      const canvas = this.canvas!;

      this.inputController = new InputController(
        this,
        canvas,
        this
      );
      this.sceneController = new SceneController(
        this,
        canvas
      );
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
    this.inputController.step();
    this.sceneController.step();
    this.state.step();
  }

  public debugPrint(text: string): void {
    if (!this.debugEnabled) {
      return;
    }
    console.log(text)
  }  

  public inputControllerDidReceive<T>(
    inputController: InputController,
    inputEvent: GameInputEvent<T>
  ): void {
    this.state.inputControllerDidReceive(inputController, inputEvent);
  }
}
