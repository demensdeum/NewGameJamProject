import { State } from './state';

export class GameContext {
  private currentState: State;

  constructor(initialState: State) {
    this.currentState = initialState;
  }

  public transitionTo(state: State): void {
    console.log(`Transitioning to ${state.constructor.name}`);
    state.handle(this);
  }
}
