import { State } from './build/state';
import { StateMachine } from './build/stateMachine';

export class InGameState implements State {
  handle(context: StateMachine): void {
    console.log('InGameState handle context');
  }
}