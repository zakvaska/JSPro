import React, { useState } from 'react';
import NewGameBtn from '../newGameBtn/NewGameBtn';

const Matrix = () => {
    const getInitialState = () =>         
            [
                ['2', '2', '4', '8']
                ,['2', '2', '4', '8']
                ,['2', '2', '4', '8']
                ,['2', '2', '4', '8']
                // ['', '', '', '']
                // ,['', '', '', '']
                // ,['', '', '', '']
                // ,['', '', '', '']
            ];            
    const [grid, setGrid] = useState(getInitialState);        
    // const clearMatrix = 
    //         [
    //             ['', '', '', '']
    //             ,['', '', '', '']
    //             ,['', '', '', '']
    //             ,['', '', '', '']
    //         ];
    
    const clearMatrix = (grid) => {
        let i, j;
        for (i = 0; grid.length; i += 1) {
            for (j = 0; grid[i].length; j += 1) {
                grid[i][j] = '';
            }
        }
        return grid;
    }
    const matrixCopy = Object.assign({}, grid);
    const clearedMatrix = clearMatrix(matrixCopy);

    const startNewGame = () => {              
        console.log('start');
        setGrid(clearedMatrix);
        
        
    }
    console.log(grid);
    console.log('render');
    return (
        <>
            <table className='mx-auto mt-4'>
                <tbody>
                    {
                        grid.map((row, rowIndex) => 
                            <tr>
                                {
                                    row.map((cell, cellIndex) => <td className='cell' key={String(rowIndex) + String(cellIndex)}>{cell}</td>)                                    
                                }
                            </tr>
                        )
                    }                
                </tbody>
            </table>
            <NewGameBtn clickHandler={startNewGame} />
        </>
    );
        
}

export default Matrix;