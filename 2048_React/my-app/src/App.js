import React, { useState } from 'react';
import './bootstrap.css';
import './App.css';
import Summary from './components/summary/Summary';
import Matrix from './components/matrix/Matrix';
import NewGameBtn from './components/newGameBtn/NewGameBtn';
import updateMatrix from './utils/updateMatrix';

function App() {

    const createMatrix = () => {
      const height = 4, width = 4;
      let newMatrix = new Object();
      newMatrix.totalScore = 0;
      newMatrix.bestScore = window.localStorage.getItem('bestScore');
      newMatrix.canContinue = true;

      newMatrix.grid = new Array(height);
      for (var i = 0; i < newMatrix.grid.length; i += 1) {
          newMatrix.grid[i] = new Array(width);
          for (var j = 0; j < newMatrix.grid[i].length; j += 1) {
              newMatrix.grid[i][j] = '';
          }
      }

      let freeCellsArray = new Array();
      newMatrix.grid.map((row, rowIndex) => {
          row.map((cell, columnIndex) => {
              if (!cell) freeCellsArray.push([rowIndex, columnIndex]);                
          })
      });
      newMatrix.freeCellsArray = freeCellsArray;
      newMatrix = updateMatrix(newMatrix, 'Init');      
      
      return newMatrix;
  }    
  const [matrix, setMatrix] = useState(createMatrix());        


  const onKeyPress = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' 
    || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      const newMatrix = updateMatrix(matrix, event.key);
      setMatrix(newMatrix);
    }    
  };

  window.onkeydown = onKeyPress;    

  const startNewGame = () => {                    
      const newMatrix = updateMatrix(matrix, 'StartNewGame');      
      setMatrix(newMatrix);
  } 
        

  return (    
    <div className='container mx-auto mt-5 text-center'>
      <Summary totalScore={matrix.totalScore} bestScore={matrix.bestScore}/>
      <Matrix grid={matrix.grid} />
      <NewGameBtn clickHandler={startNewGame} />
      <div id='defeat-modal' className={matrix.canContinue ? 'inActive' : 'active'}>Defeat!</div>
    </div>
  );
}

export default App;
