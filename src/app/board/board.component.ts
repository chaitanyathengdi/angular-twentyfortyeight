import { Component, HostListener, OnInit } from '@angular/core';

const emptyValues = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

const keyBindings = {
  up: "KeyW",
  left: "KeyA",
  down: "KeyS",
  right: "KeyD"
}

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  // init values to empty based on emptyValues
  values = emptyValues.map(emptyRow => Object.assign(<number[]>[], emptyRow));

  constructor() { }

  ngOnInit(): void {
  }

  isBlank(rowIndex: number, columnIndex: number) {
    if(rowIndex < 0 || columnIndex < 0 || rowIndex > 3 || columnIndex > 3) return false;
    return this.values[rowIndex][columnIndex] === 0;
  }

  setBlank(rowIndex: number, columnIndex: number) {
    this.values[rowIndex][columnIndex] = 0;
  }

  @HostListener('document:keypress', ['$event'])
  onKeyPress(e: KeyboardEvent): void {
    switch(e.code) {
      case keyBindings.up:
        this.moveUp();
        break;
      case keyBindings.left:
        this.moveLeft();
        break;
      case keyBindings.down:
        this.moveDown();
        break;
      case keyBindings.right:
        this.moveRight();
        break;
    }
  }

  // 1. Start from the 2nd column(2nd leftmost column). For up/down/right it'll be
  //    2nd top/bottom/right column respectively.
  // 2. Can a tile in the column move to the 1st column? Is the tile that the current
  //    tile wants to occupy empty? If so, move the current tile to the target tile.
  //    Replace this tile with an empty one.
  // 3. Repeat the process for all four tiles in that column.
  // 4. Move to the third column. This time check for empty tiles in the 2nd and 1st
  //    columns. If all the tiles upto an ith column are empty, move current tile to
  //    the ith column. Replace with empty tile.
  // 5. Same for 4th column.
  moveLeft() {
    for(let currentColumn: number = 1; currentColumn <= 3; currentColumn++) {
      this.values.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
          if (columnIndex === currentColumn) {
            // j tracks the last blank tile in the current row
            let j: number = -1;
            for(let i = columnIndex - 1; i >= 0; i--) {
              if(this.isBlank(rowIndex, i)) {
                j = i;
              } else {
                break;
              }
            }
            if(j !== -1) {
              this.values[rowIndex][j] = this.values[rowIndex][columnIndex];
              this.setBlank(rowIndex, columnIndex);  
            }
          }
        });
      });
    }
  }

  moveUp() {
    for (let currentRow: number = 1; currentRow <= 3; currentRow++) {
      const row = this.values[currentRow];
      row.forEach((column, columnIndex) => {
        // j tracks the last blank tile in the current column
        let j: number = -1;
        for (let i = currentRow - 1; i >= 0; i--) {
          if (this.isBlank(i, columnIndex)) {
            j = i;
          } else {
            break;
          }
        }
        if(j !== -1) {
          this.values[j][columnIndex] = this.values[currentRow][columnIndex];
          this.setBlank(currentRow, columnIndex);
        }
      });
    }
  }

  moveRight() {
    for (let currentColumn: number = 2; currentColumn >= 0; currentColumn--) {
      this.values.forEach((row, rowIndex) => {
        // j tracks the last blank tile in the current row
        let j: number = -1;
        for (let i = currentColumn + 1; i <= 3; i++) {
          if (this.isBlank(rowIndex, i)) {
            j = i;
          } else {
            break;
          }
        }
        if(j !== -1) {
          this.values[rowIndex][j] = this.values[rowIndex][currentColumn];
          this.setBlank(rowIndex, currentColumn);
        }
      });
    }
  }

  moveDown() {
    for (let currentRow: number = 2; currentRow >= 0; currentRow--) {
      const row = this.values[currentRow];
      row.forEach((column, columnIndex) => {
        // j tracks the last blank tile in the current column
        let j: number = -1;
        for (let i = currentRow + 1; i <= 3; i++) {
          if (this.isBlank(i, columnIndex)) {
            j = i;
          } else {
            if (j == -1) {
              continue;
            } else {
              break;  
            }
          }
        }

        if(j !== -1) {
          this.values[j][columnIndex] = this.values[currentRow][columnIndex];
          this.setBlank(currentRow, columnIndex);
        }
      });
    }
  }

  getClassForValue (value:number | null): string {
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
