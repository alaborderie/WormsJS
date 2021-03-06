import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Player, Room} from "../../model";
import * as Phaser from "phaser";

class WormsScene extends Phaser.Scene {
  gameComponent: WormsGameComponent;
  blueWorms = [];
  redWorms = [];

  constructor(config, gameComponent) {
    super(config);
    this.gameComponent = gameComponent
  }

  preload() {
    console.log("prelaod");
    this.load.image('worm-left', 'assets/worm-left.png');
    this.load.image('worm-right', 'assets/worm-right.png');
  }

  create() {
    console.log("create");
    this.gameComponent.blueTeam.forEach((blueWorm) => {
      console.log("I'm blue tapetitapeta");
      this.blueWorms.push({
        player: blueWorm,
        image: this.add.image(blueWorm.position.x, blueWorm.position.y, 'worm-right'),
        text: this.add.text(blueWorm.position.x, blueWorm.position.y - 50, blueWorm.name)
      });
    });
    this.gameComponent.redTeam.forEach((redWorm) => {
      this.redWorms.push({
        player: redWorm,
        image: this.add.image(redWorm.position.x, redWorm.position.y, 'worm-left'),
        text: this.add.text(redWorm.position.x, redWorm.position.y - 50, redWorm.name)
      });
    });
  }

  update() {
  }

  public updateGameState(room: Room) {
    room.blueTeam.forEach((blueWorm: Player) => {
      const index = this.blueWorms.findIndex((bw) => {
        return bw.player.id === blueWorm.id;
      });
      if (index !== -1) {
        this.blueWorms[index].player = blueWorm;
      } else if (blueWorm.position.x !== 0 && blueWorm.position.y !== 0) {
        this.blueWorms.push({
          player: blueWorm,
          image: this.add.image(blueWorm.position.x, blueWorm.position.y, 'worm-right'),
          text: this.add.text(blueWorm.position.x, blueWorm.position.y - 50, blueWorm.name)
        });
      }
    });
    room.redTeam.forEach((redWorm: Player) => {
      const index = this.redWorms.findIndex((rw) => {
        return rw.player.id === redWorm.id;
      });
      if (index !== -1) {
        this.redWorms[index].player = redWorm;
      } else if (redWorm.position.x !== 0 && redWorm.position.y !== 0) {
        this.redWorms.push({
          player: redWorm,
          image: this.add.image(redWorm.position.x, redWorm.position.y, 'worm-left'),
          text: this.add.text(redWorm.position.x, redWorm.position.y - 50, redWorm.name)
        });
      }
    });
  }

}

@Component({
  selector: 'worms-game',
  templateUrl: './worms-game.component.html',
  styleUrls: ['./worms-game.component.css']
})
export class WormsGameComponent implements OnInit {

  @Input() player: Player;
  @Input() players: Player[];
  @Input() redTeam: Player[];
  @Input() blueTeam: Player[];
  @Input() gameStateUpdate: EventEmitter<any>;

  config: GameConfig = {};
  game: Phaser.Game;

  constructor() {
  }

  ngOnInit() {
    this.config = Object.assign(this.config, {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "WormsGame"
    });
    this.config.scene = new WormsScene(this.config, this);
    this.game = new Phaser.Game(this.config);
    this.gameStateUpdate.subscribe((room: Room) => {
      (this.config.scene as WormsScene).updateGameState(room);
    });
  }

}

interface PhaserConfig {
  type: number;
  width: number;
  height: number;
  parent: string;
  scene: Phaser.Scene;
}
