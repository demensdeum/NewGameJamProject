import { SceneController } from './sceneController.js';
var Context = /** @class */ (function () {
    function Context(state, debugEnabled) {
        this.state = state;
        this.sceneController = new SceneController(this);
        this.debugEnabled = debugEnabled;
        this.debugPrint("Game Context Initialized...");
        this.isRunning = true;
        this.transitionTo(this.state);
    }
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
        this.sceneController.step();
        this.state.step();
    };
    Context.prototype.debugPrint = function (text) {
        if (!this.debugEnabled) {
            return;
        }
        console.log(text);
    };
    return Context;
}());
export { Context };
