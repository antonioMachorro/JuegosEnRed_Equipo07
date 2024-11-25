//import BootScene from './Scenes/BootScene.js';
import MainMenuScene from './Scenes/MainMenuScene.js';
import GameScene from './Scenes/GameScene.js';
import CreditsScene from './Scenes/CreditsScene.js';
import RoleSelectScene from './Scenes/RoleSelectScene.js';
import VictoryScene from './Scenes/VictoryScene.js';
import PauseScene from './Scenes/PauseScene.js';
import GameModeScene from './Scenes/GameModeScene.js';


const config = {
    type: Phaser.AUTO,
    width: 1920, //Cambiar la ventana de juego aqui y en el archivo CSS
    height: 1080,
    parent: 'gameContainer',  // Contenedor en el HTML
    scene: [MainMenuScene, GameModeScene, RoleSelectScene, GameScene, PauseScene, VictoryScene, CreditsScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Inicializar el juego
const game = new Phaser.Game(config);
