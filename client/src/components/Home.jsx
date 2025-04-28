import React, { useEffect, useState } from 'react'

function Home() {
    const [dogData,setDogData]=useState([]);
    const [catData,setCatData]=useState([]);
    const [combinedData,setCombinedData]=useState([]);

    useEffect(()=>{
      async function fetchingImages() {
        try {
          const [dogRes,catRes]= await Promise.all([
            fetch('http://localhost:5000/api/dogs'),
            fetch('http://localhost:5000/api/cats')
          ])
          const dogResData = await dogRes.json();
          const catResData = await catRes.json();
          setDogData(dogResData);
          setDogData(catResData)
          // catResData.map((data)=>{
          //   // console.log(data)
          //   setCatData(data);
          // })

          const combine = [];
          const totalLength = Math.max(dogResData.length + catResData.length );
          const maxLength = Math.max(totalLength)

          for(let i =0; i<maxLength; i++){
            if(i%2==0 && dogResData[i/2] ){
              combine.push({type:'dog',data:dogResData[i/2]});
            }else if(i%2==1 && catResData[Math.floor(i/2)]){
              combine.push({type:'cat',data:catResData[Math.floor(i/2)]})
            }
          }

          setCombinedData(combine);
          
        } catch (error) {
          console.log("rendering error",error)
        }
      }
      
      fetchingImages()

    },[])

  return (
    
      <div style={{display:'flex',flexWrap:'wrap', gap:'90px' }}  >
      {combinedData.map(({type,data})=> (
        type === 'dog' ? (<div key={data._id} >
          <img src={data.message} alt='dog Image' style={{height: '300px', width:'300px' }}  />
          <h2>{data.breead}</h2>
        </div>) 
        : 
        (<div key={data._id} >
          <img src={data.url} alt='cat Image' style={{height: '300px', width:'300px' }} />
          <h2>{data.breeds[0].name}</h2>
        </div>)
      ) )}
      </div>
    
  )
}

export default Home
