import { Component, Input } from '@angular/core';

export enum CELL_STATUS {
  EMPTY = "empty",
  BLACK = "black",
  WHITE = "white"
};

@Component({
  selector: 'cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {

  @Input()
  status: CELL_STATUS = CELL_STATUS.EMPTY;
}
