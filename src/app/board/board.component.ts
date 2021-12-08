import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

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
  // Indicates if the board is full and so no new value is to be generated
  // Depends on the generateNewValue function so is one step behind the actual
  // fullness of the board
  boardIsFull = false;

  constructor() { }

  ngOnInit(): void {
    // call generateNewValue twice to have two new values on the board initially
    this.generateNewValue();
    this.generateNewValue();
  }

  @Output() addToScore: EventEmitter<any> = new EventEmitter();

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

    if(!this.boardIsFull) {
      this.boardIsFull = !this.generateNewValue();
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
              if (j <= 1) {
                if(this.values[rowIndex][j] === this.values[rowIndex][j - 1]) {
                  this.combineValues("left", rowIndex, j - 1);
                }
              }
            } else {
              // if j is -1 then the square to the left of this square is not blank
              if(this.values[rowIndex][columnIndex] === this.values[rowIndex][columnIndex - 1]) {
                this.combineValues("left", rowIndex, columnIndex - 1);
              }
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
          if(j >= 1) {
            if(this.values[j][columnIndex] === this.values[j - 1][columnIndex]) {
              this.combineValues("up", j - 1, columnIndex);
            }  
          }
        } else {
          // if j is -1 then the square above this square is not blank
          if(this.values[currentRow][columnIndex] === this.values[currentRow - 1][columnIndex]) {
            this.combineValues("up", currentRow - 1, columnIndex);
          }
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
          if(j <= 2) {
              if(this.values[rowIndex][j] === this.values[rowIndex][j + 1]) {
              this.combineValues("right", rowIndex, j + 1);
            }
          }
        } else {
          // if j is -1 then the square to the right of this square is not blank
          if(this.values[rowIndex][currentColumn] === this.values[rowIndex][currentColumn + 1]) {
            this.combineValues("right", rowIndex, currentColumn + 1);
          }
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
          if(j <= 2) {
            if(this.values[j][columnIndex] === this.values[j + 1][columnIndex]) {
              this.combineValues("down", j + 1, columnIndex);
            }
          }
        } else {
          // if j is -1 then the square below this square is not blank
          if(this.values[currentRow][columnIndex] === this.values[currentRow + 1][columnIndex]) {
            this.combineValues("down", currentRow + 1, columnIndex);
          }
        }
      });
    }
  }

  // (Inefficient) method for generating a random 2 or 4 at a blank location
  // returns true if a new value is generated, else returns false(i.e. the board is full)
  generateNewValue() : boolean {
    const emptyPlaces: number[][] = [];
    // 1 in 10 chance to generate a 4 instead of a 2
    const generateA4 = Math.random() > 0.9 ? true : false;
    this.values.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        if(column === 0) emptyPlaces.push([rowIndex, columnIndex]);
      });
    });

    if (emptyPlaces.length > 0) {
      const newValueIndex = Math.floor(Math.random() * emptyPlaces.length);
      const rowIndex = emptyPlaces[newValueIndex][0];
      const columnIndex = emptyPlaces[newValueIndex][1];
      if (generateA4) {
        this.values[rowIndex][columnIndex] = 4;
      } else {
        this.values[rowIndex][columnIndex] = 2;
      }
      return true;
    } else {
      return false;
    }
  }

  addScore(value: number) {
    this.addToScore.emit(value);
  }

  combineValues (direction: string, rowIndex: number, columnIndex: number) {
    if(direction === "left") {
      // rowIndex would be the same, columnIndex would be one higher, all tiles to the right to be shifted one left
      this.values[rowIndex][columnIndex] = 2 * this.values[rowIndex][columnIndex];
      this.addScore(this.values[rowIndex][columnIndex]);
      for(let i = columnIndex + 1; i < 3; i++) {
        this.values[rowIndex][i] = this.values[rowIndex][i + 1];
      }
      this.setBlank(rowIndex, 3);
    } else if(direction === "up") {
      // columnIndex would be the same, rowIndex would be one higher, all tiles below should be shifted one up
      this.values[rowIndex][columnIndex] = 2 * this.values[rowIndex][columnIndex];
      this.addScore(this.values[rowIndex][columnIndex]);
      for(let i = rowIndex + 1; i < 3; i++) {
        this.values[i][columnIndex] = this.values[i + 1][columnIndex];
      }
      this.setBlank(3, columnIndex);
    } else if(direction === "right") {
      // rowIndex would be the same, columnIndex would be one lower, all tiles to the left to be shifted one right
      this.values[rowIndex][columnIndex] = 2 * this.values[rowIndex][columnIndex];
      this.addScore(this.values[rowIndex][columnIndex]);
      for(let i = columnIndex - 1; i > 0; i--) {
        this.values[rowIndex][i] = this.values[rowIndex][i - 1];
      }
      this.setBlank(rowIndex, 0);
    } else if(direction === "down") {
      // columnIndex would be the same, rowIndex would be one lower, all tiles above to be shifted one down
      this.values[rowIndex][columnIndex] = 2 * this.values[rowIndex][columnIndex];
      this.addScore(this.values[rowIndex][columnIndex]);
      for(let i = rowIndex - 1; i > 0; i--) {
        this.values[i][columnIndex] = this.values[i - 1][columnIndex];
      }
      this.setBlank(0, columnIndex);
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

// Issue with seamless integration of move and combine - sometimes when two equal values are farther than
// one square apart, the values, instead of combining directly, would move adjacent to one another and
// then combine. These should combine directly.