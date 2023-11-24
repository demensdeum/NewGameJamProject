import { State } from './state';



export class GameContext {
  public isRunning: boolean;
  private state: State;
  private debugEnabled: boolean;

  private renderer: any;
  private scene: any;
  private camera: any;

  constructor(
    state: State,
    debugEnabled: boolean
  ) {
      this.state = state;
      this.debugEnabled = debugEnabled;
      this.debugPrint("Game Context Initialized...");

// @ts-ignore
      this.scene = new THREE.Scene();
// @ts-ignore      
      this.camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
      );
// @ts-ignore      
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      this.isRunning = true;
  }

  public transitionTo(state: State): void {
    console.log(`Transitioning to ${state.name}`);
    this.state = state;
  }

  public step() {
    this.renderer.render(this.scene, this.camera);
    this.state.step(this, this.scene, this.camera);
  }

  public debugPrint(text: string) {
    if (!this.debugEnabled) {
      return;
    }
    console.log(text)
  }  
}
