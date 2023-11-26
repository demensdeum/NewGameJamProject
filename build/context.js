import { SceneController } from './sceneController.js';
import { IdleState } from './idleState.js';
import { InputController } from './inputController.js';
import { GameData } from './gameData.js';
import { LiveUpdateWebSocketClient } from './liveUpdateSocketClient.js';
import { Translator } from './translator.js';
export class Context {
    constructor(debugEnabled) {
        this.isRunning = false;
        this.canvas = document.querySelector("canvas");
        this.liveUpdateWebSocketClient = new LiveUpdateWebSocketClient("localhost:8766");
        this.debugEnabled = debugEnabled;
        this.gameData = new GameData();
        this.translator = new Translator("en");
        this.state = new IdleState(this);
        if (!this.canvas || this.canvas == undefined) {
            this.raiseCriticalError("1Canvas in NULL!!!!");
        }
        const canvas = this.canvas;
        this.inputController = new InputController(this, canvas, this);
        this.sceneController = new SceneController(this, canvas);
        this.debugPrint("Game Context Initialized...");
    }
    start(state) {
        this.state = state;
        this.isRunning = true;
        this.transitionTo(this.state);
    }
    raiseCriticalError(error) {
        if (this.debugEnabled) {
            console.error(error);
        }
        else {
            alert(error);
        }
        this.isRunning = false;
    }
    transitionTo(state) {
        this.debugPrint(`Transitioning to ${state.name}`);
        this.state = state;
        this.state.initialize(this);
    }
    step() {
        this.inputController.step();
        this.sceneController.step();
        this.state.step();
    }
    debugPrint(text) {
        if (!this.debugEnabled) {
            return;
        }
        console.log(text);
    }
    inputControllerDidReceive(inputController, inputEvent) {
        this.state.inputControllerDidReceive(inputController, inputEvent);
    }
}
