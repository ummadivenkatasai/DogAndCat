import React from 'react'
import '../componentsCss/choose.css'
import { Card, CardContent, Grid, Icon, Typography } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import PetsIcon from '@mui/icons-material/Pets';

function Choose() {
  return (
    <Grid container className='chooseContent' >
      <Grid size={12} className='heading' >
        <Typography variant='h3' >Why Choose PetPals?</Typography>
        <Typography variant='body2' >We're committed to connecting loving families with healthy, happy pets through a transparent and ethical process.</Typography>
      </Grid>
      <Grid container className='content' rowGap={5} columnSpacing={5}  >
        <Grid size={4} className='contentBox'  >
            <Card className='card' >
                <CardContent className='cardContent' >
                    <FavoriteBorderIcon  className='heart' />
                    <Typography variant='h5' >Ethical Breeding</Typography>
                    <Typography variant='body2' >
                        All our pets come from ethical breeders who prioritize health and well-being.
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={4} className='contentBox'  >
            <Card className='card' >
                <CardContent className='cardContent' >
                    <ShieldIcon className='shiled' />
                    <Typography variant='h5' >Health Guarantee</Typography>
                    <Typography variant='body2' >
                        Every pet comes with a comprehensive health guarantee and vaccination records.
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={4} className='contentBox'  >
            <Card className='card' >
                <CardContent className='cardContent' >
                    <LocalShippingIcon className='shipping' />
                    <Typography variant='h5' >Safe Transport</Typography>
                    <Typography variant='body2' >
                        We ensure safe and comfortable transportation to your home.
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={4} className='contentBox'  >
            <Card className='card' >
                <CardContent className='cardContent' >
                    < VerifiedUserIcon className='user' />
                    <Typography variant='h5' >Quality Assurance</Typography>
                    <Typography variant='body2' >
                        Our pets meet the highest standards of breed quality and temperament.
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={4} className='contentBox'  >
            <Card className='card' >
                <CardContent className='cardContent' >
                    < QueryBuilderIcon className='bulid' />
                    <Typography variant='h5' >Lifetime Support</Typography>
                    <Typography variant='body2' >
                        We provide ongoing supoort and advice throughout our and your pet's life.
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={4} className='contentBox'  >
            <Card className='card' >
                <CardContent className='cardContent' >
                    < PetsIcon className='pet' />
                    <Typography variant='h5' >Perfet Match</Typography>
                    <Typography variant='body2' >
                        We help you find the perfect pet that matches your lifestyle and preferences.
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Choose
