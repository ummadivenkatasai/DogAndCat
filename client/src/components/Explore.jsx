import React from 'react'
import { Button, Container, Grid, Typography } from '@mui/material';
import '../componentsCss/explore.css'

function Explore() {
  return (
    <div className='coverContent'  >
        <section className='coverImage' ></section>
        <Grid container className='content' >
          <Grid size={6} className='contentHeading' >
            <Typography variant='h3' >Find Your Perfect Furry Companion</Typography>
          </Grid>
          <Grid size={8} className='contentPara' >
            <Typography>Premium cats and dogs from ethical breeds, complete with health certificates and lifetime support</Typography>
          </Grid>
        </Grid>
        <Container className="explore" >
          <Button variant='contained' href='dog' className='dogBtn' >Explore Dogs</Button>
          <Button variant='contained' href='cat' className='catBrn' >Explore Cats</Button>
        </Container>
      </div>
  )
}

export default Explore
