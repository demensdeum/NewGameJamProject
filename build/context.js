import { SceneController } from './sceneController.js';
import { IdleState } from './idleState.js';
import { InputController } from './inputController.js';
import { GameData } from './gameData.js';
var Context = /** @class */ (function () {
    function Context(debugEnabled) {
        this.isRunning = false;
        this.canvas = document.querySelector("canvas");
        this.debugEnabled = debugEnabled;
        this.gameData = new GameData();
        this.state = new IdleState(this);
        if (!this.canvas || this.canvas == undefined) {
            this.raiseCriticalError("1Canvas in NULL!!!!");
        }
        var canvas = this.canvas;
        this.inputController = new InputController(this, canvas, this);
        this.sceneController = new SceneController(this, canvas);
        this.debugPrint("Game Context Initialized...");
    }
    Context.prototype.start = function (state) {
        this.state = state;
        this.isRunning = true;
        this.transitionTo(this.state);
    };
    Context.prototype.raiseCriticalError = function (error) {
        if (this.debugEnabled) {
            console.error(error);
        }
        else {
            alert(error);
        }
        this.isRunning = false;
    };
    Context.prototype.transitionTo = function (state) {
        this.debugPrint("Transitioning to ".concat(state.name));
        this.state = state;
        this.state.initialize(this);
    };
    Context.prototype.step = function () {
        this.inputController.step();
        this.sceneController.step();
        this.state.step();
    };
    Context.prototype.debugPrint = function (text) {
        if (!this.debugEnabled) {
            return;
        }
        console.log(text);
    };
    Context.prototype.inputControllerDidReceive = function (inputController, inputEvent) {
        this.state.inputControllerDidReceive(inputController, inputEvent);
    };
    return Context;
}());
export { Context };
