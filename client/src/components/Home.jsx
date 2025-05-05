import React, { useEffect, useState } from 'react'
import '../componentsCss/home.css'
import Explore from './Explore';
import { Link } from 'react-router-dom'
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

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
      <Grid container className='displayImages'>
        <Grid className='heading' >
          <Typography variant='h4'>Featured Pets</Typography>
        </Grid>
        <Grid container className='images' rowGap={6} >
          {combineData.map(({ type, data }) => (
            <Grid className='cardContent' key={data._id} size={{ xs: 2, sm: 4, md: 4 }}  >
              <Link to="">
              <Card className='card'>
                <CardMedia component='img' alt={type} image={type === 'dog' ? data.message : data.url} className='cardImage'/>
                <CardContent className='content'>
                  <Typography variant='body1'>
                    {type === 'dog' ? data.breed : data.breeds[0].name}
                  </Typography>
                  <Typography variant='body1'>Price: {data.price}</Typography>
                </CardContent>
              </Card>
              </Link>
              </Grid>
            ))}
        </Grid>
      </Grid>

    </>
  )
}

export default Home

// sx={{maxWidth:250,maxHeight:250}}
// sx={{maxWidth:250,maxHeight:250}}