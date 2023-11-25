import { Context } from './context';
import { InputControllerDelegate } from './inputControllerDelegate';

export interface State extends InputControllerDelegate {
    name: string;
    initialize(context: Context): void;
    step(): void;
}
  