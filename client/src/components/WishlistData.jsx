import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../componentsCss/wishlist.css'

function WishlistData({isAuthenticated}) {

  const [wishlistData,setWishListData]=useState([]);

  const navigate = useNavigate();

  useEffect(()=>{
    fectchingWishlistData();
  },[isAuthenticated]);

  async function fectchingWishlistData(){
    if(!isAuthenticated) {navigate('/login'); return}
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/wishlist`,{ headers:{ Authorization:`Bearer ${token}` } });
      // const response = await axios.get('http://localhost:5000/api/wishlist',{ headers:{ Authorization:`Bearer ${token}` } });
      setWishListData(response.data.message)
    } catch (error) {
      console.log('fetching wishlist data error',error)
    }
  }

  return (
    <Grid container className='wishlistContainer' columnSpacing={4}  > 
        { wishlistData.map((data)=>{
        return data.id ? <CatData key={data._id} value={data} /> : <DogData key={data._id} value={data} />
      }) }
    </Grid>
  )
}

function CatData({ value }){
 return(
  <Grid size={3} className='wishData' >
    <Link to={`/cat/${value._id}`} >
      <Card className='card' >
        <CardMedia component='img' className='cardImage' image={value.url} alt={value.id} height='275' />
        <CardContent className='cardContent' >
          <Typography variant='body1' >{value.breeds[0].name}</Typography>
          <Typography variant='body1' >{value.price}</Typography>
        </CardContent>
      </Card>
    </Link>
  </Grid>
 ) 
}

function DogData({ value }){
 return(
  <Grid size={3} className='wishData' >
    <Link to={`/dog/${value._id}`} >
      <Card className='card' >
        <CardMedia component='img' className='cardImage' image={value.message} alt={value.breed} height='275' />
        <CardContent className='cardContent' >
          <Typography variant='body1' >{value.breed}</Typography>
          <Typography variant='body1' >{value.price}</Typography>
        </CardContent>
      </Card>
    </Link>
  </Grid>
 )
}

export default WishlistData
