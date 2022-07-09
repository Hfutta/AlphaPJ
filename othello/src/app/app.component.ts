import { Component, ViewChild } from '@angular/core';
import { CELL_STATUS, BoardComponent } from './parts/parts.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'othello';

  CELL_STATUS = CELL_STATUS;

  @ViewChild('board') board!: BoardComponent

}
