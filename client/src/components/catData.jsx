import React, { useEffect, useState } from 'react'

const CatData = () => {
  const [catData,setCatData] = useState([]);

  useEffect(()=>{
    async function fetchCatData() {
      const response = await fetch('http://localhost:5000/api/cats');
      const responseData = await response.json();
      setCatData(responseData);
    }
    fetchCatData()
  },[])

  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:'20px'}} >
      {catData.map((data)=>{
        return(
          <div key={data._id} >
            <img src={data.url} style={{height:'250px',width:'250px'}} />
            <h3>{data.breeds[0].name}</h3>
          </div>
        )
      })}
    </div>
  )
}

export default CatData
