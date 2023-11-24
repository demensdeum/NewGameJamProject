import { GameContext } from './gameContext.js';
import { InGameState } from './inGameState.js';
function main(argv) {
    var debugEnabled = argv["debugEnabled"] === "true";
    var initialState = new InGameState("In Game");
    var gameContext = new GameContext(initialState, debugEnabled);
    function step() {
        gameContext.step();
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
main({ "debugEnabled": "true" });
