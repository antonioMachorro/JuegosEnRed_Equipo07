//import BootScene from './Scenes/BootScene.js';
import MainMenuScene from './Scenes/MainMenuScene.js';
import GameScene from './Scenes/GameScene.js';
import PoliceVictoryScene from './Scenes/PoliceVictoryScene.js';
import ThiefVictoryScene from './Scenes/ThiefVictoryScene.js';


const config = {
    type: Phaser.AUTO,
    width: 1920, //Cambiar la ventana de juego aqui y en el archivo CSS
    height: 1080,
    parent: 'gameContainer',  // Contenedor en el HTML
    scene: [MainMenuScene,GameScene, ThiefVictoryScene, PoliceVictoryScene, ],  // Agrega todas tus escenas aquí
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
