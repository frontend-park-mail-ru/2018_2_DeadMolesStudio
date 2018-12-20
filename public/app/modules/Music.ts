class Music {
    player;
    musicOn;

    constructor() {
        this.player = <HTMLAudioElement>document.getElementById('music');

        if (localStorage) {
            this.musicOn = localStorage.getItem('musicOn');
        } else {
            this.musicOn = true;
        }
    }

    isOn() {
        return this.musicOn;
    }

    play() {
        this.musicOn = true;

        if (localStorage) {
            localStorage.setItem('musicOn', this.musicOn);
        }

        this.player.play();
    }

    stop() {
        this.musicOn = false;

        if (localStorage) {
            localStorage.setItem('musicOn', this.musicOn);
        }

        this.player.pause();
    }

}

export default new Music();