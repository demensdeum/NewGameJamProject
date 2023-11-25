var GameContext = /** @class */ (function () {
    function GameContext(state, debugEnabled) {
        this.state = state;
        this.debugEnabled = debugEnabled;
        this.debugPrint("Game Context Initialized...");
        this.isRunning = true;
    }
    GameContext.prototype.transitionTo = function (state) {
        console.log("Transitioning to ".concat(state.name));
        this.state = state;
    };
    GameContext.prototype.step = function () {
        this.state.step(this);
    };
    GameContext.prototype.debugPrint = function (text) {
        if (!this.debugEnabled) {
            return;
        }
        console.log(text);
    };
    return GameContext;
}());
export { GameContext };
