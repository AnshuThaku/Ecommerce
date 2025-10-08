import React from 'react'

const Child = (props) => {
  return (
    <>
    <ul>
        <li>{props.home}</li>
        <li>{props.about}</li>
        <li>{props.contact}</li>
    </ul>
    </>
  )
}

export default Child