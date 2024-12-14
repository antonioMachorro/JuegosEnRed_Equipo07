//import BootScene from './Scenes/BootScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import GameScene from './scenes/GameScene.js';
import CreditsScene from './scenes/CreditsScene.js';
import RoleSelectScene from './scenes/RoleSelectScene.js';
import VictoryScene from './scenes/VictoryScene.js';
import PauseScene from './scenes/PauseScene.js';
import GameModeScene from './scenes/GameModeScene.js';
import AudioManager from './AudioManager.js';
import OptionsScene from './scenes/OptionsScene.js';
import TitleMenu from './scenes/TitleMenu.js';


const config = {
    type: Phaser.AUTO,
    width: 1920, //Cambiar la ventana de juego aqui y en el archivo CSS
    height: 1080,
    parent: 'gameContainer',  // Contenedor en el HTML
    scene: [TitleMenu, MainMenuScene, GameScene, GameModeScene, RoleSelectScene, PauseScene, VictoryScene, CreditsScene, OptionsScene],
    pixelArt: true,
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

const game = new Phaser.Game(config);

game.audioManager = new AudioManager(game);