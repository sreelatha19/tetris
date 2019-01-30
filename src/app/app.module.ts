import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { Board } from './tetris/board/board';
import { Cell } from './tetris/cell/cell';
import { NextPiece } from './tetris/nextpiece/nextpiece';
import { Piece } from './tetris/piece/piece';

@NgModule({
  declarations: [
    AppComponent,Board,Cell,NextPiece
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [Piece],
  bootstrap: [AppComponent]
})
export class AppModule { }
