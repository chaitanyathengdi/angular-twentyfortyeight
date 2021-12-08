import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  score: number = 0;
  highScore: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  setScore(score: number) {
    this.score = score;
    if(score > this.highScore) this.setHighScore(score);
  }

  setHighScore(score: number) {
    this.highScore = score;
  }

  addToScore(value: number) {
    this.setScore(this.score + value);

  }
}
