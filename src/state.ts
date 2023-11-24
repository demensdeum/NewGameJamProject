import { GameContext } from './gameContext';

export interface State {
    name: string;
    step(context: GameContext, scene: any, camera: any): void;
}
  