import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  values = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getClassForValue (value:number | null) {
    type tClasses = {
      [key: number]: string
    }
  
    const classes:tClasses = {
      2: "two",
      4: "four",
      8: "eight",
      16: "sixteen",
      32: "thirty-two",
      64: "sixty-four",
      128: "one-twenty-eight",
      256: "two-fifty-six",
      512: "five-one-two",
      1024: "one-k",
      2048: "two-k",
      4096: "four-k",
      8192: "eight-k",
      16384: "sixteen-k",
      32768: "thirty-two-k",
      65536: "sixty-five-k",
      131072: "one-thirty-one-k"
    };

    const returnValue = value ? classes[value] : 'blank';
    return returnValue;
  }

}
