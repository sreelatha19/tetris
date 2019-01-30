import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class Piece {

  public coordinates;
  public type;
  public rotation;
  public rotationCount;
  public nextPiece:any={};
  public nextPieceCords = [[4,5,6,7], //i-piece
  [4,5,6,10], //j-piece
  [6,5,4,8], //l-piece
  [5,6,9,10], //o-piece
  [6,5,9,8], //s-piece
  [4,5,6,9], //t-piece
  [4,5,9,10]]; //z-piece

  private defaultRotations = [[[2,11,20,29],[-2,-11,-20,-29]], //i-piece
  [[-9,0,9,-2],[11,0,-11,-20],[9,0,-9,2],[-11,0,11,20]], //j-piece
  [[9,0,-9,-20],[-11,0,11,2],[-9,0,9,20],[11,0,-11,-2]], //l-piece
  [[0,0,0,0]], //o-piece
  [[-11,0,-9,2],[11,0,9,-2]], //s-piece
  [[-9,0,9,-11],[9,0,-9,-9],[-9,0,9,11],[9,0,-9,9]], //t-piece
  [[-9,0,-11,-2],[9,0,11,2]]]; //z-piece
  private defaultTypes = ['i-piece','j-piece','l-piece','o-piece','s-piece','t-piece','z-piece'];
  private defaultCords = [[-7,-6,-5,-4], //i-piece
  [-6,-5,-4,6], //j-piece
  [-4,-5,-6,4], //l-piece
  [-6,-5,5,4], //o-piece
  [-4,-5,5,4], //s-piece
  [-6,-5,-4,5], //t-piece
  [-6,-5,5,6]]; //z-piece

  private nextPieceSource = new Subject();
  nextPiece$ = this.nextPieceSource.asObservable();

  /** assigns a new nextPiece
  assigns piece
  assigns new nextPiece
  **/
  public restart(){
      this.setNextPiece();
      this.setPiece();
      this.setNextPiece();
  }

  //sets current piece to next and sets new next
  replace(){
    this.setPiece();
    this.setNextPiece();
  }

  //sets current piece
  setPiece(){
    var shape = this.nextPiece.shape;
    this.coordinates = this.defaultCords[shape].slice();
    this.type = this.defaultTypes[shape];
    this.rotation = this.defaultRotations[shape];
    this.rotationCount = 0;
  }

  //sets next piece
  setNextPiece(){
    var shape = Math.floor(Math.random()*7);
    this.nextPiece.coordinates = this.nextPieceCords[shape];
    this.nextPiece.type = this.defaultTypes[shape];
    this.nextPiece.shape = shape;
    this.nextPieceSource.next(this.nextPiece);
  }

  clearNextPiece(){
    this.nextPiece = {};
    this.nextPieceSource.next(this.nextPiece);
  }

  /** rotates piece
  returns new rotated Cordinates
  **/
  rotate(){
    var rotation;
    rotation = this.rotation[Math.abs(this.rotationCount)%this.rotation.length];
    var newCords = [];
    for(let i = 0;i<this.coordinates.length;i++){
      newCords.push(this.coordinates[i] + rotation[i]);
    }
    return newCords;
  }

}
