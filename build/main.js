import { Context } from './context.js';
import { InGameState } from './inGameState.js';
function main(argv) {
    var debugEnabled = argv["debugEnabled"] === "true";
    var context = new Context(debugEnabled);
    var initialState = new InGameState("In Game", context.sceneController);
    context.start(initialState);
    function step() {
        if (!context.isRunning) {
            return;
        }
        context.step();
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
main({ "debugEnabled": "true" });
