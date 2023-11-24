import { State } from './state';
import { GameContext } from './gameContext';

export class InGameState implements State {
  public name: string;
  private initialized: boolean;
  constructor(name: string) {
    this.name = name;
    this.initialized = false;
  }

  private initialize(
    context: GameContext,
    scene: any,
    camera: any
  ) {
    // @ts-ignore
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    // @ts-ignore
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // @ts-ignore
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    camera.position.z = 10;
    scene.add(box);
    this.initialized = true;
    context.debugPrint("In Game State Initialized");
  }

  step(
    context: GameContext,
    scene: any,
    camera: any
  ): void {
    if (!this.initialized) {
      this.initialize(
        context,
        scene,
        camera
      );
    }
  }
}