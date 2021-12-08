import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  @Input() score!: number;
  @Input() highScore!: number;

  constructor() { }

  ngOnInit(): void {
  }
}
