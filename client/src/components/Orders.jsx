import { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button, CardMedia, Grid, Typography, Stepper, Step, StepLabel, StepConnector } from '@mui/material';
import { styled } from "@mui/material/styles";
import '../componentsCss/order.css'

const GreenConnector = styled(StepConnector)(({theme})=>({
  '& .MuiStepConnector-line': {
    borderColor: "green",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}))

const CustomStepIcon = styled('div')(({ theme, ownerState }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: ownerState.active || ownerState.completed ? 'green' : '#ccc',
}));

const GreenStepLabel = (props) => {
  return (
    <StepLabel StepIconComponent={CustomStepIcon}>
      {props.children}
    </StepLabel>
  );
};

function OrderSignIn(){
  return(
    <Grid className='orderBody loginBody' >
      <Typography variant='h3' >To see orders. Please Login</Typography>
      <Button variant='contained' href='login' >Login</Button>
    </Grid>
  )
}

function ListOfOrders(){

  const [orderContent,setOrderContent] = useState([])

  const token = localStorage.getItem('token');

  useEffect(()=>{
    fetchingOrders()
  },[])

  async function fetchingOrders(){
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`,{headers:{Authorization:`Bearer ${token}`}});
    // const response = await axios.get('https://dogandcat-production.up.railway.app/api/orders',{headers:{Authorization:`Bearer ${token}`}});
    // const response = await axios.get('http://localhost:5000/api/orders',{headers:{Authorization:`Bearer ${token}`}});
    const ordersData = response.data.message;
    const reverseOrder = ordersData.reverse();
    setOrderContent(reverseOrder)
  }

  return (
    <Grid className='orderBody' >
      {orderContent.map((data,index)=>(
        <DisplayData key={index} content={data} />
      ))}
    </Grid>
  )
}

function DisplayData({content}){
  
  const dataLenght = content.length;
  return(
    <Grid className='orderItem' container >
      {content.map((data,index)=>(
        <Box key={index} className='card' >
          <CardMedia className='cardImage' component='img' image={data.id ? `${data.url}` : `${data.message}` } alt={data.id ? `${data.id}` : `${data.breed}` } />
          <Grid className='productDetails' >
           <Grid className='productBreed product' >
             <Typography variant='body1' className='details breedName' >{data.id ? `${data.breeds[0].name}` : `${data.breed}` }</Typography>
           </Grid>
            <Grid className='productPrice product' >
              <Typography variant='body1' className='details price' >Price: {data.price}</Typography>
              <Typography variant='body1' className='details qty' >Qauntity: {data.qty}</Typography>
              <Typography variant='body1' className='details total' >Total: {data.total}</Typography>
            </Grid>
            <Typography variant='body1' className='payment' >Payment: Cash on delivery (COD)</Typography>
          </Grid>
          <Grid className='productShipping' >
              <ShippingDetails order={data.ordered} />
          </Grid>
        </Box>
      ))}
    </Grid>
  )
}

function getStepIndex(orderDate){
  const now = new Date();
  const orderedDate = new Date(orderDate);
  const diffMs = now - orderedDate;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) return 0;                
  if (diffHours < 48) return 1;                
  if (diffHours < 79) return 2;                
  if (diffHours < 82) return 3;                
  if (diffHours < 85) return 3;                
  return 4;                                  
};

function ShippingDetails({order}){

  const orderDate = `${order.slice(8, 10)}-${order.slice(4,7)}-${order.slice(11,15)}`

  const activeStep = getStepIndex(orderDate);
  const steps = ["Ordered", "Shipped", 'in Tranist',"Out for Delivery", "Delivered"];

  return(
    <Box>
      <Stepper alternativeLabel activeStep={activeStep} connector={<GreenConnector/>} >
        {steps.map((label,index)=>(
          <Step key={label} completed={index < activeStep } >
            <GreenStepLabel>{label}</GreenStepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}


function Orders({isAuthenticated}) {
  return (
    <>
      {isAuthenticated ? <ListOfOrders/> : <OrderSignIn/> }
    </>
  )
}

export default Orders