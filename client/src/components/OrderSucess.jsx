import React from 'react'
import '../componentsCss/orderSucess.css'
import { Button, Grid, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { CatCart, DogCart } from './AddToCart';

function OrderSucess() {

  const location = useLocation();
  const cartItems = location.state?.cartData || [];

  return (
    <Grid className='orderSuccess' >
      <Grid className='successContent' >
        <CheckCircleOutlineIcon className='successIcon' />
        <Typography variant='body1' >Order placed successfully</Typography>
      </Grid>
      <Grid className='orderList' >
        {cartItems.map((data)=> data.id ? 
        (<CatCart key={data._id} content={data} display='true' options='false'  />) 
        :
        (<DogCart key={data._id} content={data} display='true' options='false' />)  )}
      </Grid>
      <Grid className='navigateBtn' >
        <Button variant='contained' type='button' href='/' >Home</Button>
        <Button variant='contained' type='button' href='/orders' >Orders</Button>
        <Button variant='contained' type='button' href='/dog' >Dogs</Button>
        <Button variant='contained' type='button' href='/cat' >Cats</Button>
      </Grid>
    </Grid>
  )
}

export default OrderSucess
