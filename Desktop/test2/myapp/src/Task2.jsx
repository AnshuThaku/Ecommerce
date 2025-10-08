import React, { useState } from 'react'

const Task2 = () => {

    const[count,setcount]=useState(0)
    const increase=()=>{
        setcount(count+1)
    }
    const decrease=()=>{
        setcount(count-1)
    }
    const reset=()=>{
        setcount(' ')
    }
  return (
    <>
    <h2>{count}</h2>

    <button onClick={increase}>increase</button>
    <button onClick={decrease}>decrease</button>
    <button onClick={reset}>reset</button>
    </>
  )
}

export default Task2