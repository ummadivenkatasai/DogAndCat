import { Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import React from 'react'

function OrderSignIn(){
  return(
    <Container className='orderBody' >
      <Typography variant='h3' >To see orders. Please Login</Typography>
      <Link to='login' >Signin</Link>
    </Container>
  )
}

function ListOfOrders(){
  return (
    <Container className='orderBody' >
      <Typography variant='h2' >List of orders</Typography>
    </Container>
  )
}

function Orders({prop}) {
  console.log('orders',prop)
  return (
    <>
      {prop ? <ListOfOrders/> : <OrderSignIn/> }
    </>
  )
}

export default Orders
