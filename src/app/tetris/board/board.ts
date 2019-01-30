import { Component,ViewChildren,QueryList,HostListener,Output,EventEmitter } from '@angular/core';
import { Cell } from '../cell/cell';
import { Piece } from '../piece/piece';

@Component({
  selector: 'board',
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board {

  @ViewChildren(Cell) cells:QueryList<Cell>;

  public score = 0;
  public grid = [];
  public width = 10;
  public height = 20;
  public gameSpeed = 300;
  public gameInProgress = false;
  public inRestart = false;
  public inRotation = false;
  public timer;

  @Output() onScore = new EventEmitter<number>();

  //creates cells in grid
  initCells(){
      var area = this.width * this.height;
      for(let i = 0;i<area;i++){
        this.grid.push(i);
      }
  }

  constructor(private piece: Piece){
    this.initCells();
  }

  start(){
    if(!this.gameInProgress){
      this.gameInProgress = true;
      this.piece.restart();
      this.updateGrid();
    }
  }

  end(){
    clearTimeout(this.timer);
    this.gameInProgress = false;
    this.inRotation = false;
    this.inRestart = false;
    this.gameSpeed = 300;
    this.piece.clearNextPiece();
    this.cells.forEach((elem)=>{
      elem.unfill();
    });
  }

  //check if cells 3 to 6 are filled
  checkLoss(){
    var cells = this.cells.toArray();
    for(let i = 3;i<=6;i++){
      if(cells[i].filled){
        return true;
      }
    }
    return false;
  }

  //self calling function with timer to update piece
  updateGrid(){
    if(this.gameInProgress && !this.inRestart){
      this.timer = setTimeout(()=>{
        this.updateGrid();
      },this.gameSpeed);
      this.updatePiece(10);
    }
  }

  //moves piece by input amount
  updatePiece(amount){
    var cells = this.cells.toArray();
    this.unfillPiece(cells);
    for(let i = 0;i<this.piece.coordinates.length;i++){
        this.piece.coordinates[i]+=amount;
    }
    this.fillPiece(cells);
    this.checkCollision();
  }

  //unfills cells of current piece
  unfillPiece(cells){
    for(let i = 0;i<this.piece.coordinates.length;i++){
      if(this.piece.coordinates[i] > -1)cells[this.piece.coordinates[i]].unfill();
    }
  }

  //fills cells of current piece
  fillPiece(cells){
    for(let i = 0;i<this.piece.coordinates.length;i++){
        if(this.piece.coordinates[i] > -1)cells[this.piece.coordinates[i]].fill(this.piece.type);
    }
  }

  //checks for collision
  checkCollision(){
      for(let i = 0;i<this.piece.coordinates.length;i++){
        if(this.piece.coordinates[i] < 0) break; //skip if piece is invisible
        var cell = this.cells.find((element,index,array)=>{
          return index == this.piece.coordinates[i]+10;
        });
        //piece is bottom or touchs filled cell
        if(this.piece.coordinates[i] >= 190 || (cell.filled
          && this.piece.coordinates.indexOf(cell.index) == -1 ) ){
            if(!this.inRestart){
              //clear timer and set restart state
              clearTimeout(this.timer);
              this.inRestart = true;
              setTimeout(()=>{
                if(!this.checkCollision()){
                    this.inRotation = false;
                    this.inRestart = false;
                    this.updateGrid();
                    return;
                }
                if(this.checkLoss() && !this.inRotation){
                  this.end();
                  return;
                }
                this.checkScoring();
                this.inRotation = false;
                this.inRestart = false;
                this.piece.replace();
                this.updateGrid();
              },300);
            }
            return true;
        }
      }
      return false;
  }

  //check if rows has been filled
  checkScoring(){
      var filledRows = [];
      var cells = this.cells.toArray();
      //gets filled rows
      for(let i = 0;i<this.piece.coordinates.length;i++){
          var rowNum = Math.floor(this.piece.coordinates[i]/10) * 10;
          var filled = true;
          for(let i = 0;i<=9;i++){
            if(!cells[rowNum+i].filled){
              filled = false;
              break;
            }
          }
          if(filled && filledRows.indexOf(rowNum) == -1) filledRows.push(rowNum);
      }

      //sort rows from lowest to greatest
      filledRows.sort(this.sortNumber);

      for(let i = 0;i<filledRows.length;i++){
        //unfills row
        for(let j = 0;j<=9;j++){
          cells[filledRows[i]+j].unfill();
        }

        var hasFilled = false;
        //lowers cells above top filled row
        for(let j = filledRows[i]-1;j>=0;j--){
          if(j%10==0){
            if(!hasFilled) break;
            hasFilled = false;
          }
          if(cells[j].filled){
            cells[j+10].fill(cells[j].getType());
            cells[j].unfill();
            hasFilled = true;
          }
        }
      }

      this.gameSpeed = this.gameSpeed > 100 ? this.gameSpeed-- : 100;
      this.score += filledRows.length * filledRows.length;
      this.onScore.emit(this.score);
  }

  sortNumber(a,b){
    return a-b;
  }

  //rotation of piece
  rotate(){
    if(this.gameInProgress && !this.inRestart && !this.inRotation) {
      this.inRotation = true; //sets rotation state
      setTimeout(()=>{
        this.inRotation = false;
      },100);
      var cells = this.cells.toArray();
      var newCords = this.piece.rotate();
      /**validates new coordinates
        if newCords exists, if newCords doesn't end up on other side of grid
        if newCords isn't filled
      **/
      for(let i = 0;i<newCords.length;i++){
        if(cells[newCords[i]] == undefined || Math.abs((newCords[i]%10) - (this.piece.coordinates[i]%10)) > 6 ||
          (cells[newCords[i]].filled && this.piece.coordinates.indexOf(newCords[i]) == -1) ) return false;
      }
      this.piece.rotationCount++;
      this.unfillPiece(cells);
      this.piece.coordinates = newCords;
      this.fillPiece(cells);
      this.checkCollision();
    }
  }

  moveLeft(){
    if(this.gameInProgress && !this.leftEnd()) this.updatePiece(-1);
  }

  moveRight(){
    if(this.gameInProgress && !this.rightEnd()) this.updatePiece(1);
  }

  moveDown(){
    if(this.gameInProgress && !this.inRestart)this.updatePiece(10);
  }

  //check if piece is at left end of grid
  leftEnd(){
    for(let i = 0;i<this.piece.coordinates.length;i++){
      var cell = this.cells.find((element,index,array)=>{
        return index == this.piece.coordinates[i]-1;
      });
      if(Math.abs(this.piece.coordinates[i])%10 == 0 || (cell != undefined && cell.filled
        && this.piece.coordinates.indexOf(cell.index) == -1) ){
        return true;
      }
    }
    return false;
  }

  //check if piece is at right end of grid
  rightEnd(){
    for(let i = 0;i<this.piece.coordinates.length;i++){
      var cell = this.cells.find((element,index,array)=>{
        return index == this.piece.coordinates[i]+1;
      });
      //right end if visible
      if(this.piece.coordinates[i]%10 == 9 || (cell != undefined && cell.filled)
      && this.piece.coordinates.indexOf(cell.index) == -1 ){
        return true;
      }
      // right end if invisible
      else if(this.piece.coordinates[i] < 0 && Math.abs(this.piece.coordinates[i])%10 == 1) return true;
    }
    return false;
  }

}
