import './bootstrap.css';
import './App.css';
import Summary from './components/summary/Summary';
import Matrix from './components/matrix/Matrix';

function App() {

  
  return (    
    <div className='container mx-auto mt-5 text-center'>
      <Summary />
      <Matrix />      
    </div>
  );
}

export default App;
