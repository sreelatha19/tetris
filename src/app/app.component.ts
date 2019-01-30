import { Component,ViewChild,HostListener} from '@angular/core';
import { Board } from './tetris/board/board';
import { NextPiece } from './tetris/nextpiece/nextpiece';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  @ViewChild(Board) gameboard:Board;
  @ViewChild(NextPiece) nextPiece:NextPiece;
  
  public score = 0;

  start(){
    this.gameboard.start();
  }

  end(){
    this.gameboard.end();
  }

  restart(){
    this.gameboard.end();
    this.gameboard.start();
  }

  onScore(score:number){
    this.score = score;
  }

  @HostListener('window:keydown',['$event'])
  keyboard(e){
      switch(e.keyCode){
        case 37:
        case 65:
        this.gameboard.moveLeft();
        break;
        case 39:
        case 68:
        this.gameboard.moveRight();
        break;
        case 40:
        case 83:
        this.gameboard.moveDown();
        break;
        case 38:
        case 87:
        this.gameboard.rotate();
        break;
      }
  }

}
