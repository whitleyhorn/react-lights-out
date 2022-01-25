import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
      nrows: 5,
      ncols: 5,
      chanceLightStartsOn: 0.2
  };

  constructor(props) {
    super(props);

    this.state = {
        hasWon: false,
        board: this.createBoard()
    };

    this.makeTableBody = this.makeTableBody.bind(this);
    this.makeCells = this.makeCells.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    for(let i = 0; i < this.props.nrows; i++) {
        let row = makeRow.call(this);
        board.push(row);
    }
    return board;

    // ****
    function makeRow() {
        const {ncols, chanceLightStartsOn} = this.props;

        let row = [];
        for(let i = 0; i < ncols; i++){
            // If chanceLightStartsOn is 0.6, or 60%, that's basically the same likelihood as Math.random being less than 0.6
            let cellIsLit = (Math.random() < chanceLightStartsOn); 
            row.push(cellIsLit); 
        }

        return row;
    }
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let board = JSON.parse(JSON.stringify(this.state.board));
    let [y, x] = coord.split("-").map(Number);
    let hasWon = true;
    // The cells that form a T/Cross Shape around this cell
    let toFlip = {
        thisCell: [y, x],
        topCell: [y-1, x],
        bottomCell: [y+1, x],
        leftCell: [y, x-1],
        rightCell: [y, x+1]
    };

    Object.values(toFlip).forEach(thisCoord => flipCell(...thisCoord));

    // Loop over board to check if player won
    for(let i = 0; i < board.length; i++){
        let hasCellOn = board[i].find(cell => cell === true);
        if(hasCellOn) {
            // Only win when every cell is turned off
            hasWon = false;
            break;
        }
    }

    this.setState({board, hasWon});

    // ****
    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }
  }

  makeCells(row, rIndex){
    let cells = row.map((cell, cIndex) => {
        return <Cell 
                    key={cIndex} 
                    isLit={cell} 
                    flipCellsAroundMe={this.flipCellsAround.bind(this, `${rIndex}-${cIndex}`)}
                />
    });

    return cells;
  }

  makeTableBody(){
    let tBody = this.state.board.map((row, rIndex) => {
      return (
        <tr 
          key={rIndex} 
          className="Board-row"
        >
          {this.makeCells(row, rIndex)}
        </tr>
      );                
    })
    return tBody;
  }


  /** Render game board or winning message. */

  render() {

    // TODO: Fix key=index anti-pattern

    return (
        <div className="Board">
            <h1>LIGHTS OUT!</h1>
            <table className="Board-table">
              <tbody className="Board-tbody">
                {this.state.hasWon
                 ? <h1>YOU WON!!!!</h1>
                 : this.makeTableBody()}
              </tbody>
            </table>
        </div>
    );
  }
}


export default Board;
