import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, Typography } from '@mui/material'
import '../componentsCss/dogContent.css'



function DogContent() {
    const { _id } = useParams();
    const [ dogData, setDogData ]=useState(null);

    useEffect(()=>{
      async function dogFetchingData(){
        const response = await axios.get(`http://localhost:5000/api/dogs/${_id}`);
        const responseData = response.data.dogData;
        setDogData(responseData)
    }
    dogFetchingData();
    },[_id])

    console.log(_id)
    // console.log(dogData)

  return (
    <>
      { dogData && <Grid container className='dogcontent' >
        <Grid className='item dogContentImage' >
          <img src={dogData.message} alt={dogData.breed} />
        </Grid>
        <Grid className='item dogContentInfo' >
          <Typography variant='body1' >Breed:{dogData.breed.toLocaleUpperCase()}</Typography>
          <Typography variant='body1' >Price:{dogData.price}</Typography>
        </Grid>
      </Grid> }
    </>
  )
}

export default DogContent
