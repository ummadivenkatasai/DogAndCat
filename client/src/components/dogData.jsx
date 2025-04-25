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

    // dogData.map((value)=>{
    //     console.log(value)
    //     // id, message, breead
    // })

  return (
    <>
      {dogData.map(({id,message,breead})=>{
        return(
            <>
                <div key={id} >
                    <img src={message} />
                    <p>{breead}</p>
                </div>
            </>
        )
      })}
    </>
  )
}

export default DogData
