

const NewGameBtn = ({ clickHandler }) => {
        
    return (
        <button className='btn btn-secondary text-light btn-lg mt-5 mx-auto' onClick={clickHandler}>New Game</button>
    );
};

export default NewGameBtn;