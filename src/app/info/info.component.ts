import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  score: number = 0;
  highScore: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  setScore(score: number) {
    this.score = score;
  }

  setHighScore(score: number) {
    this.highScore = score;
  }
}
