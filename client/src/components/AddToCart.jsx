import { Button, Card, Collapse, Grid, List, ListItemButton, ListItemText, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../componentsCss/cart.css'
import MinimizeIcon from '@mui/icons-material/Minimize';
import AddIcon from '@mui/icons-material/Add';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import axios from 'axios';

function AddToCart({isAuthenticated}) { 

  const [cartContent,setCartContent]=useState([]);
  const [cartQty,setCartQty]=useState(1);
  const [totalamt,setTotalamt]= useState(null);
  const [isopen,setisopen] = useState(true);


  const navigate = useNavigate();
  const token = localStorage.getItem('token')

  useEffect(()=>{
    if(!isAuthenticated) navigate('/login')
      fecthingCartData();
  },[isAuthenticated,cartQty]);

  useEffect(()=>{
    if( cartContent.length > 0 ){
      const value = cartContent.reduce((total,item)=>{
        return total + (item.price * item.qty);
      },0)
      setTotalamt(value);
    }
  },[cartContent])

  async function fecthingCartData(){
    try {
      const response = await axios.get('http://localhost:5000/api/cart',{headers:{Authorization:`Bearer ${token}`}});
      setCartContent(response.data.cartData)
    } catch (error) {
      console.log('feching data error',error)
    }
  }

  async function handleCart(event,type,item) {
    let newQty = item.qty;
    if( type === 'increment' && item.qty <5 ){
      newQty++;
      setCartQty(prev => prev + 1)
    }else if( type === 'decrement' && item.qty > 1 ){
      newQty--
      setCartQty(prev => prev - 1)
    }
    const updataItems = {...item,qty:newQty,updateType:type};

    try {
      await axios.post('http://localhost:5000/api/cart',updataItems,{headers:{Authorization:`Bearer ${token}`}})
    } catch (error) {
      console.log('update quantity sending error',error)
    }
  }

  function handleListBtn(){
    setisopen(!isopen);
  }
  
  return (
    <Grid  className='cartContainer' >
      <Grid className='cartContent' >
        {cartContent.map((data)=>(
      data.id ? <CatCart key={data._id} content={data} changeFun={handleCart} itemValue={data.qty} /> : <DogCart key={data._id} content={data} changeFun={handleCart} itemValue={data.qty} />
      ))}
      </Grid>
      <Grid className='totalPriceContent' >
        <List className='displayItems' >
          <ListItemButton onClick={handleListBtn} >
            <ListItemText className='heading' primary='Product Details' />
            {isopen ? <ExpandLess/> : <ExpandMore/> }
          </ListItemButton>
          <Collapse className='displayItemsCollapase' in={isopen} timeout='auto' unmountOnExit >
            <List component='div' disablePadding >
              {cartContent.map((data)=>(
                <ListItemText className='collapseItems' key={data._id} 
                primary={ data.url ? `${data.breeds[0].name.charAt(0).toUpperCase()+data.breeds[0].name.slice(1).toLowerCase()}` : `${data.breed.charAt(0).toUpperCase()+data.breed.slice(1).toLowerCase()}` }
                secondary={ data.url ? `${data.qty} x ${data.price} :${data.qty*data.price}` : `${data.qty} x ${data.price} :${data.qty*data.price}` } />
              ))}
            </List>
          </Collapse>
        </List>
        <Typography variant='body1' className='totalPrice' ><span className='priceText' >Total Price </span> <span className='pricevalue' >{totalamt}</span></Typography>
        <Grid className='checkoutContent' >
        <Button href='checkout' type='button' variant='contained' disabled={isAuthenticated ? null : '' } >ChcekOut</Button>
      </Grid>
      </Grid>
    </Grid>
  )
}


function CatCart({content,changeFun,itemValue}){

  const price = content.price;
  const qty=content.qty;
  const totalPrice = price*qty;

  return(
    <Card className='contentItem' >
      <Grid className='itemImage' >
        <img src={content.url} alt={content.id} />
      </Grid>
      <Grid className='itemDetails' >
        <Typography variant='body1' className='itemName' >{content.breeds[0].name}</Typography>
        <Typography variant='body1' className='itemPrice' >{content.price}</Typography>
        <Typography variant='body1' className='totalPrice' >Price:{price} * Qunatity:{qty} = {totalPrice}</Typography>
      </Grid>
      <Grid className='itemQty' >
        <Button type='button' className='decrement qtyContent' onClick={(e)=> changeFun(e,'decrement',content)  } disabled={ qty <=1 } >  
        <MinimizeIcon/>
        </Button>
        <Typography variant='body1' className='itemValue qtyContent' >{itemValue}</Typography>
        <Button type='button' className='increment qtyContent' onClick={(e)=> changeFun(e,'increment',content) } disabled={qty >=5} > <AddIcon/> </Button>
      </Grid>
    </Card>
  )
}

function DogCart({content,changeFun, itemValue}){
    const price = content.price;
  const qty=content.qty;
  const totalPrice = price*qty;
  return(
    <Card className='contentItem' >
      <Grid className='itemImage' >
        <img src={content.message} alt={content.breed} />
      </Grid>
      <Grid className='itemDetails' >
        <Typography variant='body1' className='itemName' >{content.breed}</Typography>
        <Typography variant='body1' className='itemPrice' >{content.price}</Typography>
        <Typography variant='body1' className='totalPrice' >Price:{price} * Qunatity:{qty} = {totalPrice}</Typography>
      </Grid>
      <Grid className='itemQty' >
        <Button type='button' className='decrement qtyContent' onClick={(e)=> changeFun(e,'decrement',content)  } disabled={ qty <=1 } >  
        <MinimizeIcon/>
        </Button>
        <Typography variant='body1' className='itemValue qtyContent' >{itemValue}</Typography>
        <Button type='button' className='increment qtyContent' onClick={(e)=> changeFun(e,'increment',content) } disabled={qty >=5} > <AddIcon/> </Button>
      </Grid>
    </Card>
  )
}

export default AddToCart