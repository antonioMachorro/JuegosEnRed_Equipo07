//import BootScene from './Scenes/BootScene.js';
import MainMenuScene from './Scenes/MainMenuScene.js';
import GameScene from './Scenes/GameScene.js';
import EndScene from './Scenes/EndScene.js';

window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: { gravity: { y: 0 }, debug: false }
        },
        scene: [MainMenuScene, GameScene, EndScene] // Orden de las escenas
    };
    const game = new Phaser.Game(config);
}

// Ahora me voy a correr