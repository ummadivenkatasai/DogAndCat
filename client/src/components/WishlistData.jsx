import { Grid, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
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
      const response = await axios.get('http://localhost:5000/api/wishlist',{ headers:{ Authorization:`Bearer ${token}` } });
      setWishListData(response.data.message)
    } catch (error) {
      console.log('fetching wishlist data error',error)
    }
  }

  wishlistData.map((data)=> console.log(data))

  return (
    <Grid className='wishlistContainer' >
      {wishlistData.map((data)=>{
        return data.id ? <h1 key={data.id} >{data.breeds[0].name}</h1> : <h1>dog</h1>
      })}
    </Grid>
  )
}

export default WishlistData
