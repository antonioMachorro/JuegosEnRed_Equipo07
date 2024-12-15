class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.currentMusic = null;
        this.globalVolume = 1; // Volumen predeterminado (máximo)
    }

    playMusic(key, config = { loop: true }) {
        if (this.currentMusic && this.currentMusic.key === key) {
            return;
        }

        if (this.currentMusic) {
            this.currentMusic.stop();
        }

        this.currentMusic = this.scene.sound.add(key, config);
        this.currentMusic.setVolume(this.globalVolume); // Aplica el volumen global
        this.currentMusic.play();
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    setVolume(volume) {
        this.globalVolume = Phaser.Math.Clamp(volume, 0, 1);
    
        const adjustedVolume = Math.pow(this.globalVolume, 2);
    
        if (this.currentMusic) {
            this.currentMusic.setVolume(adjustedVolume);
        }
    }
    

    getVolume() {
        return this.globalVolume; // Devuelve el volumen actual
    }
}

export default AudioManager;
