// import { useState } from "react"

// const Map = () => {
//   const Fruit=["mango","banana","lichi"]
//   const[Iteam,setIteam]=useState("")
//   let newValue;
//   const fun=(e)=>{
//     if (Iteam==e){
//     newValue=""
//   }
//   else{
//     newValue=e
//   }
//   setIteam(newValue)

//   }


//   return (
//     <>
//       <ul>
//          {Fruit.map((e,index)=>(
//           <li key={index} onClick={()=> fun(e)}>
//             {Iteam==e ? "hidden":e}

//           </li>
//          ))}
//     </ul>


//     </>
//   )
// }

// export default Map















































// import React, { useState } from 'react'


// const Fruit = () => {
//     const fruit=["apple","baana", "mango"]
//     const[ hidden,setHidden,]=useState("")
//     const fun =(e)=>{
//         let newvalue;
//         if (hidden==e){
//             newvalue=""

//         }
//         else{
//             newvalue=e
//         }
//         setHidden(newvalue)

//     }

//   return (
//     <>
    
//     <ul>
       
//         {fruit.map((e,index)=>(
//             <li key={index} onClick={()=>fun(e) }>
//                             {hidden==e? "hidden":e}

//             </li>
//         ))}
//          <h2>{hidden}</h2>
//     </ul>
//     </>
//   )
// }

// export default Fruit
























// import React, { useState } from "react";

// const ListClick = () => {
//   const items = ["Apple", "Mango", "Banana", "Orange"];


//   const [selected, setSelected] = useState("");

//   return (
//     <div>
//       <h1>Fruits</h1>
//       <ul>
//         {items.map((fruit, index) => (
//           <li
//             key={index}
//             onClick={() => setSelected(fruit)}
//           >
//             {fruit}
//           </li>
//         ))}
//       </ul>

//       <h2>You selected: {selected}</h2>
//     </div>
//   );
// };

// export default ListClick;

// // import React, { useState } from "react";

// // const ToggleList = () => {
// //   const items = ["Apple", "Mango", "Banana", "Orange"];
// //   const [hidden, setHidden] = useState("");

// //   const handleClick = (fruit) => {
// //     setHidden(hidden === fruit ? "" : fruit);
// //   };

// //   return (
// //     <div>
// //       <h1>Fruits</h1>
// //       <ul>
// //         {items.map((fruit, index) => (
// //           <li key={index} onClick={() => handleClick(fruit)}>
// //             {hidden === fruit ? "" : fruit}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default ToggleList;



// import React, { useState } from 'react'

// const Map = () => {
//   const Student=[
//     {id:1,name:"pratima",age:34},
//     {id:3,name:"ram",age:24},
//     {id:4,name:"shyam",age:14},
//     {id:7,name:"nitin",age:64},
//     {id:2,name:"ajay",age:54},
//   ]
//   const[hidden,sethidden]=useState('')
//   const fun=(id)=>{
//     let newValue;
//     if(hidden === id){
//       newValue = ""

//     }
//     else{
//       newValue = id
//     }
//      sethidden(newValue)
//   }
  
 
//   return (
//     <>
//      <ul>
//       {Student.map((student)=>(
//         <li key={student.id} onClick={()=> fun(student.id)}>
//             {hidden === student.id ? "❌ Hidden" : `${student.name} (${student.age})`}
//         </li>
//       ))}
//      </ul>

//     </>
    
//   )
// }

// export default Map



import React, { useState } from 'react'

const Map = () => {
  const Student=["apple","mango","lichi"]
  const[hidden,sethidden]=useState()
  const fun= (e)=>{
    let newValue;
    if(hidden === e){
      newValue=" "
    }
    else{
      newValue=e
    }
    sethidden(newValue)
  }

  return (
    <>
    <ul>
      {Student.map((e,index)=>(
        <li  key ={index} onClick={()=> fun(e)}>
          {hidden === e ? "hidden":e}
        </li>
      ))}
    </ul>

    </>
  )
}

export default Map