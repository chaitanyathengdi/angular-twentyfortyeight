import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {

  selectedClass:string = "";

  @Input() value!:number|null;
  constructor() {
  }

  ngOnInit(): void {
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

    this.selectedClass = this.value ? classes[this.value] : "blank";
  }

}
