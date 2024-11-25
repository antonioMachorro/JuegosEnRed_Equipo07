class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.currentMusic = null;
    }

    playMusic(key, config = { loop: true }) {
        if (this.currentMusic && this.currentMusic.key === key) {
            return;
        }

        if (this.currentMusic) {
            this.currentMusic.stop();
        }

        this.currentMusic = this.scene.sound.add(key, config);
        this.currentMusic.play();
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    setVolume(volume) {
        if (this.currentMusic) {
            this.currentMusic.setVolume(volume);
        }
    }
}

export default AudioManager;
