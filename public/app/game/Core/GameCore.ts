import EVENTS from './Events';
import bus from '../../modules/EventBus';

const KEYS = {
    JUMP: [' ', '__touch', 'ArrowUp', 'W', 'w', 'Ц', 'ц'],
    LEFT: ['a', 'A', 'ф', 'Ф', 'ArrowLeft', '__left_incline'],
    RIGHT: ['d', 'D', 'в', 'В', 'ArrowRight', '__right_incline'],
};

export default class GameCore {

    controller;
    scene;
    controllersLoopIntervalId;

    constructor(controller, scene) {
        this.controller = controller;
        this.scene = scene;
        this.controllersLoopIntervalId = null;

        this.onGameStarted = this.onGameStarted.bind(this);
        this.onGameStateChanged = this.onGameStateChanged.bind(this);
        this.onGameFinished = this.onGameFinished.bind(this);
        this.onControlsPressed = this.onControlsPressed.bind(this);
    }

    start(json) {
        console.log('GameCore.start()');
        bus.on(EVENTS.CONTROLS_PRESSED, this.onControlsPressed);
        bus.on(EVENTS.START_GAME, this.onGameStarted);
        bus.on(EVENTS.FINISH_GAME, this.onGameFinished);
        bus.on(EVENTS.GAME_STATE_CHANGED, this.onGameStateChanged);

        const { controller } = this;
        this.controllersLoopIntervalId = setInterval( () => {
            const actions = controller.diff();

            if (Object.keys(actions).some(key => actions[key]) ) {
                bus.emit(EVENTS.CONTROLS_PRESSED, actions);
            }
        }, 20);
    }

    destroy() {
        clearInterval(this.controllersLoopIntervalId);

        try {
            this.controller.destroy();
            this.scene.stop();
        } catch {
            console.error('game destroy error');
        }

        bus.off(EVENTS.START_GAME, this.onGameStarted);
        bus.off(EVENTS.FINISH_GAME, this.onGameFinished);
        bus.off(EVENTS.CONTROLS_PRESSED, this.onControlsPressed);
        bus.off(EVENTS.GAME_STATE_CHANGED, this.onGameStateChanged);
    }

    stopController() {
        bus.off(EVENTS.CONTROLS_PRESSED, this.onControlsPressed);
        this.controller.destroy();
    }

    pressed(name, data) {
        return KEYS[name].some( key => data[key.toLowerCase()] );
    }

    onControlsPressed(event) {
        console.error('this method must be overriden');
    }

    onGameStarted(event) {
        console.error('this method must be overriden');
    }

    onGameFinished(event) {
        console.error('this method must be overriden');
    }

    onGameStateChanged(event) {
        console.error('this method must be overriden');
    }
}
