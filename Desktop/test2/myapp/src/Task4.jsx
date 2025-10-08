import React, { useState } from 'react'

const Task4 = () => {
    const[color,setcolor]=useState('white')
    const red=()=>{
        setcolor('red')
    }
    const green=()=>{
        setcolor('green')
    }
  return (
    <>
    <div style={{background:color}}>

        <button onClick={red} className='bg-red-500'>red</button>

        <button onClick={green} className='bg-green-500'>green</button>
    </div>
    
    
    </>
  )
}

export default Task4