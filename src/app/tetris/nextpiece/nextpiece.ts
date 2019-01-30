import { Component,Input,ViewChildren,QueryList } from '@angular/core';
import { Cell } from '../cell/cell';
import { Piece } from '../piece/piece';

@Component({
  selector: 'next-piece',
  templateUrl: './nextpiece.html',
  styleUrls: ['./nextpiece.css']
})
export class NextPiece {

  @ViewChildren(Cell) cells:QueryList<Cell>;
  public height = 4;
  public width = 4;
  public grid = [];
  public nextPiece;

  constructor(private piece: Piece){
    var area = this.width * this.height;
    for(let i = 0;i<area;i++){
      this.grid.push(i);
    }
    piece.nextPiece$.subscribe((nextPiece)=>{
      this.unsetNextPiece();
      this.nextPiece = Object.assign({},nextPiece);
      this.setNextPiece();
    });
  }

  setNextPiece(){
    if(!this.nextPiece || !this.nextPiece.coordinates) return;
    var cells = this.cells.toArray();
    for(let i = 0;i<this.nextPiece.coordinates.length;i++){
      cells[this.nextPiece.coordinates[i]].fill(this.nextPiece.type);
    }
  }

  unsetNextPiece(){
    if(!this.nextPiece || !this.nextPiece.coordinates) return;
    var cells = this.cells.toArray();
    for(let i = 0;i<this.nextPiece.coordinates.length;i++){
      cells[this.nextPiece.coordinates[i]].unfill();
    }
  }

}
