import React, { useEffect, useState } from 'react'
import '../componentsCss/home.css'
import Explore from './Explore';

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
    <>
      <Explore/>
    </>
  )
}

export default Home