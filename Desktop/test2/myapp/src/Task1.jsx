import React, { useState } from 'react'

const Task1 = () => {
    const[input,setinput]= useState('')
    const[btn,setbtn]= useState('')
    const fun =()=>{
        setbtn(input)
        setinput('')

    }


  return (
    <>
    <input type="text" value={input}  onChange={(e) => setinput(e.target.value)}/>
    <button onClick={fun}>add</button>
    <h1>{btn}</h1>

    </>
  )
}

export default Task1