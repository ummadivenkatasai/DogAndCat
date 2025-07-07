import { Button, Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import React from 'react'
import '../componentsCss/order.css'

function OrderSignIn(){
  return(
    <Container className='orderBody' >
      <Typography variant='h3' >To see orders. Please Login</Typography>
      <Button variant='contained' href='login' >Login</Button>
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

function Orders({isAuthenticated}) {
  // console.log('orders',isAuthenticated)
  return (
    <>
      {isAuthenticated ? <ListOfOrders/> : <OrderSignIn/> }
    </>
  )
}

export default Orders
