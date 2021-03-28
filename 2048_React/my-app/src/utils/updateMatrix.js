const updateMatrix = (currentMatrix, action) => {
    let matrix = Object.assign([], currentMatrix);
    let grid = matrix.grid;
    let freeCellsCoords = matrix.freeCellsArray;
    let i, j, k;                
    
    const base = 2;
    const initCellsNumber = 2;
    const afterMoveCellsNumber = 1;

    let shouldNextCellMove = false,                        
        distance = 0,        
        lastSignificantCellProps,
        lastColumnIndex,        
        destinationColumn,
        newCell,
        didCellsMove = false;

    const invertMatrix = () => {                        
        for (i = 0; i < grid.length; i += 1) {          
            for (j = i + 1; j < grid[i].length; j += 1) {
                k = grid[i][j];                
                grid[i][j] = grid[j][i];                
                grid[j][i] = k;                
            }
        }
    }

    const updateFreeCellsArray = (row, column, destinationColumn, isMatrixTurned) => {
        if (isMatrixTurned) {
            freeCellsCoords.push([column, row]);
        } else {
            freeCellsCoords.push([row, column]); 
        }   
        let occupiedCell = !isMatrixTurned ? [row, destinationColumn] : [destinationColumn, row];        
        freeCellsCoords = freeCellsCoords.filter(function(cellCoords){            
            return cellCoords[0] !== occupiedCell[0] || cellCoords[1] !== occupiedCell[1];
        });
    }

    class Cell {
        constructor(props) {            
            this.properties = {
                value: grid[props.row][props.column],
                shouldCellMove: shouldNextCellMove,
                distance: distance,
                shouldCellMerge: false,
                coords: [props.row, props.column]
            };
            let cellProps = this.properties;

            if (cellProps.value === '') {
                distance += 1;
                cellProps.shouldCellMove = false;
                shouldNextCellMove = true;
            }

            if (lastSignificantCellProps) {
                if (cellProps.value === lastSignificantCellProps.value && !lastSignificantCellProps.shouldCellMerge) {
                    cellProps.shouldCellMerge = true;
                    distance += 1;
                    cellProps.distance = distance;
                    shouldNextCellMove = true;
                    cellProps.shouldCellMove = shouldNextCellMove;
                }
            }

            if (cellProps.value !== '') {
                lastSignificantCellProps = cellProps;
            }
        }
        moveCell(direction, isMatrixTurned) {
            let properties = this.properties;
            let row = properties.coords[0];
            let column = properties.coords[1];

            if (properties.shouldCellMove === true) {
                grid[row][column] = '';
                destinationColumn = direction === 'left' ? column - properties.distance : column + properties.distance;
                const newValue = properties.shouldCellMerge ? String(Number(properties.value) + Number(properties.value)) : properties.value;
                grid[row][destinationColumn] = newValue;
                didCellsMove = true;
                //increase totalScore                
                if (properties.shouldCellMerge) {
                    matrix.totalScore += Number(newValue);
                    if (matrix.bestScore < matrix.totalScore) {
                        matrix.bestScore = matrix.totalScore;
                        window.localStorage.setItem('bestScore', matrix.bestScore);
                    }
                }
                updateFreeCellsArray(row, column, destinationColumn, isMatrixTurned);
            }

            lastColumnIndex = direction === 'left' ? grid[row].length - 1 : 0;

            if (column === lastColumnIndex) {
                distance = 0;
                lastSignificantCellProps = null;
                shouldNextCellMove = false;
            }
        }
    }
                                      

    const addRandomValues = function(initCellsNumber, didCellsMove) {
        let row, column, i, j, freeCellIndex, randomValue, value;
        const chance = 0.5; //first value drop chance
        const randomRangeOffset = 1;                                  

        const getRandomFreeCellIndex = () => {   
            if (freeCellsCoords.length > 0) {
                return Math.round(Math.random() * (freeCellsCoords.length - 1));
            } else {            
                return -1;
            }        
        } 
        
        const checkPossibility = () => {            
            for (i = 0; i < grid.length; i += 1) {
                for (j = 0; j < grid[i].length ; j += 1) {
    
                    if (i < grid.length - 1) {
                        // checkVerticalNeighbour
                        if (grid[i][j] === grid[i + 1][j]) {
                            return true;
                        }
                    }
                    if (j < grid[i].length - 1) {
                        // checkHorizontalNeighbour
                        if (grid[i][j] === grid[i][j + 1]) {
                            return true;
                        }
                    }                                                
                }
            }
            return false;
        }
        //at least 1 cell moved or it is initial render        
        if (didCellsMove || didCellsMove === undefined) {
            const cellsNumber = didCellsMove === undefined ? initCellsNumber : afterMoveCellsNumber;            
            for (i = 0; i < cellsNumber; i += 1) {                
                freeCellIndex = getRandomFreeCellIndex();                
                //checking if there are free cells
                if (freeCellIndex >= 0) {                      
                    [row, column] = freeCellsCoords[freeCellIndex];                         
                    //generate some value to fill cell.                
                    randomValue = Math.random();
                    if (randomValue < chance) {
                        value = Math.floor(randomValue + randomRangeOffset) * base;
                    } else if (randomValue >= chance) {
                        value = Math.ceil(randomValue + randomRangeOffset) * base;
                    }
                
                    grid[row][column] = String(value);        
                    //delete 1 current item from freeCellsCoords array
                    freeCellsCoords.splice(freeCellIndex, 1);  
                }
            }
            //no more free cells
            if (freeCellsCoords.length === 0) {
                matrix.canContinue = checkPossibility();
            }        
        }        
    }    

    //clearing cells
    const clearMatrix = () => 
        grid = grid.map((row) => 
                    row.map(() => '')
        );

    const getInitialFreeCellsArray = () => {
        freeCellsCoords = new Array();
        grid.map((row, rowIndex) => {
            row.map((cell, columnIndex) => {
                if (!cell) freeCellsCoords.push([rowIndex, columnIndex]);                
            })
        });    
    };    
 
    switch (action) {
        case 'Init':            
            addRandomValues(initCellsNumber);
            break;
        case 'StartNewGame':
            clearMatrix();
            getInitialFreeCellsArray();
            addRandomValues(initCellsNumber);
            matrix.canContinue = true;
            matrix.totalScore = 0;
            break;                            
        case 'ArrowLeft':                        
            for (i = 0; i < grid.length; i += 1) {
                for (j = 0; j < grid[i].length; j += 1) {
                    newCell = new Cell({row: i, column: j});                                 
                    newCell.moveCell('left');
                }
            }
            addRandomValues(initCellsNumber, didCellsMove);        
            break;
        case 'ArrowRight':
            for (i = 0; i < grid.length; i += 1) {
                for (j = grid[i].length - 1; j > -1 ; j -= 1) {
                    newCell = new Cell({row: i, column: j});                                 
                    newCell.moveCell('right');
                }
            }
            addRandomValues(initCellsNumber, didCellsMove);
            break;
        case 'ArrowUp':  
            invertMatrix();
            for (i = 0; i < grid.length; i += 1) {
                for (j = 0; j < grid[i].length; j += 1) {
                    newCell = new Cell({row: i, column: j});                                 
                    newCell.moveCell('left', true);
                }
            }            
            invertMatrix();
            addRandomValues(initCellsNumber, didCellsMove);
            break;
        case 'ArrowDown':
            invertMatrix();
            for (i = 0; i < grid.length; i += 1) {
                for (j = grid[i].length - 1; j > -1 ; j -= 1) {
                    newCell = new Cell({row: i, column: j});                                 
                    newCell.moveCell('right', true);
                }
            }
            invertMatrix();
            addRandomValues(initCellsNumber, didCellsMove);
            break;                   
        default:
            console.error('wrong direction value!');
            console.error(action);
            break;
    }    
    didCellsMove = false;    

    matrix.grid = grid;
    matrix.freeCellsArray = freeCellsCoords;
    return matrix;
}

export default updateMatrix;