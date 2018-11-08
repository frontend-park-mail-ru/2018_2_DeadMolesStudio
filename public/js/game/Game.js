import GAME_MODES from './GameModes.js';
import OfflineGame from './Core/Offline.js';
import GameScene from "./GameScene/GameScene.js";
import GameController from "./GameController.js";

export default class Game {
    constructor(mode, canvas) {
        let GameConstructor = null;
        switch (mode) {
        case GAME_MODES.ONLINE_MULTI:
        case GAME_MODES.ONLINE_SINGLE:
        case GAME_MODES.OFFLINE:
            GameConstructor = OfflineGame;
            break;
        default:
            console.log(mode, ' NOT FOUND');
        }

        this.gameScene = new GameScene(canvas);
        this.gameController = new GameController(canvas);
        this.gameCore = new GameConstructor(this.gameController, this.gameScene);
    }

    start() {
        this.gameCore.start();
    }

    destroy() {
        this.gameCore.destroy();
    }
}