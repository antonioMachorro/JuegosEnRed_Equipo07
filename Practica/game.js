//import BootScene from './Scenes/BootScene.js';
import MainMenuScene from './Scenes/MainMenuScene.js';
import GameScene from './Scenes/GameScene.js';
import EndScene from './Scenes/EndScene.js';


const config = {
    type: Phaser.AUTO,
    width: 800, //Cambiar la ventana de juego aqui y en el archivo CSS
    height: 600,
    parent: 'gameContainer',  // Contenedor en el HTML
    scene: [MainMenuScene,GameScene, EndScene],  // Agrega todas tus escenas aquí
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    }
};

// Inicializar el juego
const game = new Phaser.Game(config);
