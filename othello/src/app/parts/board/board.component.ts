import { Component } from '@angular/core';
import { CELL_STATUS, CellComponent } from '../parts.module';

export type TURN_STONE = CELL_STATUS.BLACK | CELL_STATUS.WHITE;

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent {
  // 各マスの状態 (0 -> 63)
  matrix: CELL_STATUS[] = Array.from({length: 64}, () => CELL_STATUS.EMPTY);

  // どちらのターンか
  turn: TURN_STONE = CELL_STATUS.BLACK;

  // 全ての空マスの位置
  emptyCells = new Set<Number>();

  // 黒・白の数
  stoneNums: { [key: string]: number } = {};

  reset(): void {
    // 黒・白の石カウンターをリセット
    this.stoneNums[CELL_STATUS.BLACK] = 0;
    this.stoneNums[CELL_STATUS.WHITE] = 0;
  
    // 空マスの位置を記録
    for (let i: number = 0; i < 64; i++) {
      this.emptyCells.add(i);
    }
  
    // 初期配置の石だけ特別処理
    this.initStone(CELL_STATUS.BLACK, 28);
    this.initStone(CELL_STATUS.BLACK, 35);
    this.initStone(CELL_STATUS.WHITE, 27);
    this.initStone(CELL_STATUS.WHITE, 36);
  }
  
  constructor() { 
    this.reset();
  }

  initStone(stone: TURN_STONE, placeAt: number): void {
    // 石を配置する
    this.matrix[placeAt] = stone;

    // 空マスのセットから外す
    this.emptyCells.delete(placeAt);

    // 石の数をインクリメント
    this.stoneNums[stone] += 1;
  }

  /*
   * ゲーム中に石を置く処理
   *
   * @params stone - 置きたい石の色
   * @params placeAt - マスの番号
   */
  placeStone(stone: TURN_STONE, placeAt: number): void {
    // (1, 2) placeAtに石を配置したとして、
    const revPositions = this.findRevStones(stone, placeAt);
    //        反転可能な石の位置を取得する
    // (3) 反転可能な石がないときは置けない
    if (revPositions.length === 0) {
      return;
    }
  
    // (4a) 石を反転させる
    revPositions.forEach((idx: number) => this.flipStone(idx));

    // (4b) 石を配置する
    this.matrix[placeAt] = stone;
    this.emptyCells.delete(placeAt);
    this.stoneNums[stone] += 1;

    // (5) ターンを切り替える
    this.nextTurn();
  }

  /*
   * ボードがクリックされた時に呼び出される
   *
   */
  onBoardClick(idx: number): void {
    // (1-5) 石を置く
    this.placeStone(this.turn, idx);

    let canContinue: boolean = true;

    // (6) 空のマス、黒石、白石、いずれかが0？
    if ((this.emptyCells.size === 0) || (this.stoneNums[CELL_STATUS.BLACK] === 0) ||
      (this.stoneNums[CELL_STATUS.WHITE] === 0)) {
      canContinue = false;

    // (7) 残り1マス？
    } else if (this.emptyCells.size === 1) {

      // (8) 自動的に最後１マスに石を置く
      const lastPos: number = this.emptyCells.values().next().value;
      this.nextTurn();
      this.placeStone(this.turn, lastPos);

      canContinue = false;
    }

    if (!canContinue) {
      alert("ゲーム終了！");
    }
  }

  findRevStones(stone: TURN_STONE, idx: number): number[] {
    let positions: number[] | null = null;
    let results: number[] = [];
  
    // (1) 既に石がある場合は、新しい石を配置できない
    if (this.matrix[idx] !== CELL_STATUS.EMPTY) {
      return [];
    }
  
    // (2) 8方向を探索して石を反転できるか調べる
    const y: number = Math.floor(idx / 8);
    const x: number = idx % 8;
  
    let cx, cy: number;
    for (let dy: number = -1; dy < 2; dy++) {
      for (let dx: number = -1; dx < 2; dx++) {
        cx = x + dx;
        cy = y + dy;
        positions = this.findStone(stone, cx, cy, dx, dy);
        if (positions) {
          results = results.concat(positions);
        }
      }
    }
    return results;
  }
  
  findStone(stone: TURN_STONE, cx: number, cy: number, dx: number, dy: number): number[] | null {
    // ボード外
    if ((cx < 0) || (cy < 0) || (cx > 7) || (cy > 7)) {
      return null;
    }
  
    const idx: number = cy * 8 + cx;
  
    // セルがない場合 探索終了
    if (this.matrix[idx] === CELL_STATUS.EMPTY) {
      return null;
    }
  
    // 同じ色の石が見つかった場合、挟まれている石のインデックスを返すための空配列を返す
    if (this.matrix[idx] === stone) {
      return [];
    }
  
    // 異なる色の石が見つかった場合、探索を続ける
    const results = this.findStone(stone, cx + dx, cy + dy, dx, dy);
  
    // もし戻り値が配列なら、同じ色の石が見つかった
    if (results) {
      results.push(idx);
    }
    return results;
  }

  /*
  * 指定されたインデックスの石を反転させる
  *
  * @params idx - マスのインデックス(0-63)の整数
  */
  flipStone(idx: number): void {
    if (idx < 0 || idx > 63) {
      return;
    }
    switch(this.matrix[idx]) {
      case CELL_STATUS.WHITE:
        this.matrix[idx] = CELL_STATUS.BLACK;
        this.stoneNums[CELL_STATUS.BLACK]++;
        this.stoneNums[CELL_STATUS.WHITE]--;
        break;

      case CELL_STATUS.BLACK:
        this.matrix[idx] = CELL_STATUS.WHITE;
        this.stoneNums[CELL_STATUS.BLACK]--;
        this.stoneNums[CELL_STATUS.WHITE]++;
        break;
    }
  }

  /*
   * ターンを交代する
   */
  nextTurn(): void {
    switch(this.turn) {
      case CELL_STATUS.BLACK:
        this.turn = CELL_STATUS.WHITE;
        break;

      case CELL_STATUS.WHITE:
        this.turn = CELL_STATUS.BLACK;
        break;
    }
  }


}
