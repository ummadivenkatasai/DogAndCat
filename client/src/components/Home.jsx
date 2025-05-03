import React, { useEffect, useState } from 'react'
import { data } from 'react-router-dom';

function Home() {
    const [dogData,setDogData]=useState([]);
    const [catData,setCatData]=useState([]);
    const [combineData,setCombineData] = useState([]);

    useEffect(()=>{
      async function fetchingImages() {
        try {
          const response= await fetch('http://localhost:5000/')
          const responseData = await response.json();
          const dogResData = responseData.dog;
          const catResData = responseData.cat;
          let combine =[]
          const totalLength = Math.max(dogResData.length+catResData.length);
          
          for(let i=0;i<totalLength;i++){
            if(i%2==0 && dogResData[i/2] ){
              combine.push({type:'dog',data:dogResData[i/2]})
            }else if(i%2==1 && catResData[Math.floor(i/2)]){
              combine.push({type:'cat',data:catResData[Math.floor(i/2)]})
            }
          }
          setCombineData(combine)
        } catch (error) {
          console.log("rendering error",error)
        }
      }
      
      fetchingImages()

    },[])

  return (
    
      <div style={{display:'flex',flexWrap:'wrap', gap:'90px' }}  >
      {combineData.map(({type,data})=> (
        type === 'dog' ? (<div key={data._id} >
          <img src={data.message} alt='dog Image' style={{height: '300px', width:'300px' }}  />
          <h2>{data.breed}</h2>
          <p>Price: 2000 </p>
        </div>) 
        : 
        (<div key={data._id} >
          <img src={data.url} alt='cat Image' style={{height: '300px', width:'300px' }} />
          <h2>{data.breeds[0].name}</h2>
          <p>Price: 1500 </p>
        </div>)
      ) )}
      </div>
    
  )
}

export default Home
