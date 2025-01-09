//import BootScene from './scenes/BootScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import GameScene from './scenes/GameScene.js';
import CreditsScene from './scenes/CreditsScene.js';
import ConnectionError from './scenes/ConnectionError.js';
import RoleSelectScene from './scenes/RoleSelectScene.js';
import VictoryScene from './scenes/VictoryScene.js';
import PauseScene from './scenes/PauseScene.js';
import GameModeScene from './scenes/GameModeScene.js';
import AudioManager from './AudioManager.js';
import OptionsScene from './scenes/OptionsScene.js';
import TitleMenu from './scenes/TitleMenu.js';
import LobbyScene from './scenes/LobbyScene.js';
import LoginScene from './scenes/LoginScene.js';
import CreateAccScene from './scenes/CreateAccScene.js';
import ConnectionManager from './ConnectionManager.js';
import RoomScene from './scenes/RoomScene.js';
import RoomSelectScene from './scenes/RoomSelectScene.js';
import RoomCreateScene from './scenes/RoomCreateScene.js';
import OnlineGameScene from './scenes/OnlineGameScene.js';
import PlayerOutGameScene from './scenes/PlayerOutGameScene.js';





const config = {
    type: Phaser.AUTO,
    width: 1920, //Cambiar la ventana de juego aqui y en el archivo CSS
    height: 1080,
    parent: 'gameContainer',  // Contenedor en el HTML
    scene: [TitleMenu, LoginScene, MainMenuScene, GameScene, LobbyScene, GameModeScene, RoleSelectScene, RoomScene, 
            RoomSelectScene, RoomCreateScene, PauseScene, VictoryScene, CreditsScene, OptionsScene, CreateAccScene, ConnectionError, OnlineGameScene, PlayerOutGameScene],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

game.audioManager = new AudioManager(game);

game.connectionManager = new ConnectionManager(game);
//game.connectionManager.startPolling();