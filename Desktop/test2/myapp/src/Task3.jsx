import React from 'react'

const Task3 = () => {
    const Number=[1,2,3,4,5,6,7]
  return (
    <>
     <ul>
        {Number.map((e,index)=>(
            <li key={index}> {e}</li>
        ))}
     </ul>


    
    
    </>
  )
}

export default Task3