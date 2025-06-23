import { Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../componentsCss/cart.css'
import MinimizeIcon from '@mui/icons-material/Minimize';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

function AddToCart({isAuthenticated}) { //cartValue

  const [cartContent,setCartContent]=useState([]);
  const [cartQty,setCartQty]=useState(1);

  const navigate = useNavigate();

  // useEffect(()=>{
  //   setCartContent(cartValue);
  // },[cartValue])

  useEffect(()=>{
    if(!isAuthenticated) navigate('/login')
      fecthingCartData();
  },[isAuthenticated]);

  async function fecthingCartData(){
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('http://localhost:5000/api/cart',{headers:{Authorization:`Breaer ${token}`}});
      setCartContent(response.data.cartData)
    } catch (error) {
      console.log('feching data error',error)
    }
  }

  function handleCart(type){
    if( type === 'decrement' && cartQty >= 1 ){
      setCartQty(prev=> prev-1)
    }else if( type === 'increment' && cartQty <= 5 ){
      setCartQty(prev=> prev+1);
    }
  }

  return (
    <Grid  className='cartContainer' >
      {cartContent.map((data)=>(
      data.id ? <CatCart key={data._id} content={data} changeFun={handleCart} itemValue={data.qty} /> : <DogCart key={data._id} content={data} changeFun={handleCart} itemValue={data.qty} />
      ))}
    </Grid>
  )
}


function CatCart({content,changeFun,itemValue}){
  return(
    <Grid className='contentItem' >
      <Grid className='itemImage' >
        <img src={content.url} alt={content.id} />
      </Grid>
      <Grid className='itemDetails' >
        <Typography variant='body1' className='itemName' >{content.breeds[0].name}</Typography>
        <Typography variant='body1' className='itemPrice' >{content.price}</Typography>
      </Grid>
      <Grid className='itemQty' >
        <Button type='button' className='decrement qtyContent' onClick={()=> changeFun('decrement')  } disabled={ itemValue <=1 } >  
        <MinimizeIcon/>
        </Button>
        <Typography variant='body1' className='itemValue qtyContent' >{itemValue}</Typography>
        <Button type='button' className='increment qtyContent' onClick={()=> changeFun('increment') } disabled={itemValue >=5} > <AddIcon/> </Button>
      </Grid>
    </Grid>
  )
}

function DogCart({content,changeFun, itemValue}){
  return(
    <Grid className='contentItem' >
      <Grid className='itemImage' >
        <img src={content.message} alt={content.breed} />
      </Grid>
      <Grid className='itemDetails' >
        <Typography variant='body1' className='itemName' >{content.breed}</Typography>
        <Typography variant='body1' className='itemPrice' >{content.price}</Typography>
      </Grid>
      <Grid className='itemQty' >
        <Button type='button' className='decrement qtyContent' onClick={()=> changeFun('decrement')  } disabled={ itemValue <=1 } >  
        <MinimizeIcon/>
        </Button>
        <Typography variant='body1' className='itemValue qtyContent' >{itemValue}</Typography>
        <Button type='button' className='increment qtyContent' onClick={()=> changeFun('increment') } disabled={itemValue >=5} > <AddIcon/> </Button>
      </Grid>
    </Grid>
  )
}

export default AddToCart
