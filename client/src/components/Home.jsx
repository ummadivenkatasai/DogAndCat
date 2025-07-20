import React, { useEffect, useState } from 'react'
import '../componentsCss/home.css'
import Explore from './Explore';
import { Link } from 'react-router-dom'
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import Choose from './Choose';
import axios from 'axios'

function Home() {

    const [combineData,setCombineData] = useState([]);

    useEffect(()=>{
      fetchingImages()
    },[])

    

     async function fetchingImages() {
        try {
          const response= await axios.get('http://localhost:5000/');
          const dogResData = response.data.dog;
          const catResData = response.data.cat;
          let combine =[]
          const totalLength = dogResData.length+catResData.length;
          
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
              <Link to={ type === 'cat' ? `cat/${data._id}` : `dog/${data._id}` }  >
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
      <Choose/>
    </>
  )
}

export default Home