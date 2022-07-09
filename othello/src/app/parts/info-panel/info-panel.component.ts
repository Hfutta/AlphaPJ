import { Component, Input } from '@angular/core';
import { CELL_STATUS } from '../parts.module';

@Component({
  selector: 'info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent {

  @Input()
  stoneColor: CELL_STATUS = CELL_STATUS.EMPTY;

  @Input()
  stoneNums: number = 0;
}
