

const Summary = () => {

const totalScore = 1000;
const bestScore = 2000;
  return (
    <header className='row justify-content-center'>
      <h1 className='col-5 logo fw-bold text-end '>
        2048
      </h1>
      <section className='col-6 row py-3 ps-4'>
        <div className='col-3'>
          <div className='fs-5 fw-bold text-light bg-secondary rounded-3 py-2 px-2 text-center'>
            Score
            <div className='text-white'>{totalScore}</div>
        </div>
        </div>
        <div className='col-3'>
          <div className='fs-5 fw-bold text-light bg-secondary rounded-3 py-2 px-2 text-center'>
            Best
            <div className='text-white'>{bestScore}</div>
          </div>
        </div>                    
      </section>
    </header>
  );          
}

export default Summary;

