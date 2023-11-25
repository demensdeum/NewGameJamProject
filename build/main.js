import { Context } from './context.js';
import { InGameState } from './inGameState.js';
function main(argv) {
    var debugEnabled = argv["debugEnabled"] === "true";
    var initialState = new InGameState("In Game");
    var gameContext = new Context(initialState, debugEnabled);
    function step() {
        gameContext.step();
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
main({ "debugEnabled": "true" });
