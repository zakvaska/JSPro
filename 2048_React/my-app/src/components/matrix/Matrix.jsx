const Matrix = ({ grid }) => {
    
    

    return (
        <>
            <table className='mx-auto mt-4'>
                <tbody>
                    {
                        grid.map((row, rowIndex) => 
                            <tr>
                                {
                                    row.map((cell, cellIndex) => <td className={`cell appear-${cell}`} key={String(rowIndex) + String(cellIndex)}>{cell}</td>)                                                       
                                }
                            </tr>
                        )
                    }                
                </tbody>
            </table>                        
        </>
    );
        
}

export default Matrix;