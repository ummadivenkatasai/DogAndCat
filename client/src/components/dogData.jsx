import React, { useEffect, useState } from 'react'

const DogData = () => {
    const [dogData,setDogData]=useState([]);
    useEffect(()=>{
        async function dogDataFetching() {
            try {
                const response = await fetch('http://localhost:5000/api/dogs');
                const responseData = await response.json();
                setDogData(responseData);
            } catch (error) {
                console.log('dog data error:',error)
            }
        }
        dogDataFetching()
    },[])
    

  return (
    <div style={{display:'flex',flexWrap:'wrap', gap:'50px'}} >
      {dogData.map(({_id,message,breed})=>{
        return(
          <div key={_id} >
        <img src={message} alt='dog Image' style={{height:'250px',width:'250px'}} />
        <p>{breed}</p>
    </div>
        )
      })}
    </div>
  )
}

export default DogData
