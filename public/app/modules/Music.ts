class Music {
    player;
    musicOn;

    constructor() {
        this.player = <HTMLAudioElement>document.getElementById('music');

        this.musicOn = false;
    }

    isOn() {
        return this.musicOn;
    }

    play() {
        this.musicOn = true;

        this.player.play();
    }

    stop() {
        this.musicOn = false;
        this.player.pause();
    }

}

export default new Music();