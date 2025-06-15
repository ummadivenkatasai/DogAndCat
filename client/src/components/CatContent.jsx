import { Button, CardMedia, Grid, IconButton, Typography, Card, CardContent } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { NumericFormat } from 'react-number-format'
import '../componentsCss/catContent.css'

function CatContent({isAuthenticated}) {

    const {_id} = useParams();
    const [catData,setCatData] = useState(null);
    const [catInfo,setCatInfo] = useState({ catName:null, description:null, country:null, weight:null  });
    const [carouselcats,setCarouselCats] = useState([]);
    const [wishList, setWishList] = useState({ data:[],status:false });
    const [pincodevalue, setpincodeValue] = useState("");
      const [pincodePlace, setPincodePlace] = useState({pincode: "",pincodeTown: "",status: "",});
      const [invalidPincode,setInvalidPincode]= useState('')

    const navigate = useNavigate();

    useEffect(()=>{
        fetchingCatData();
        catContent()
    },[_id])

    async function fetchingCatData(){
        const response= await axios.get(`http://localhost:5000/api/cats/${_id}`)
        const breedInfo = response.data.catData.breeds[0];
        const catName = breedInfo.name
        const description = breedInfo.description
        const country = breedInfo.origin;
        const weight = breedInfo.weight.imperial
        setCatData(response.data.catData);
        setCatInfo({ catName, description, country, weight })
    }

    async function catContent() {
      try {
        const response = await axios.get('http://localhost:5000/api/cats');
        const cats = response.data;
        const duplicate = new Set();
        while( duplicate.size<10 ){
          const randomReslut = Math.floor(Math.random()*cats.length);
           if(!duplicate.has(randomReslut)){
          duplicate.add(randomReslut);
          }
        }
        const randomContainer = [...duplicate].map((index) => cats[index] );
      setCarouselCats(randomContainer)
      } catch (error) {
        console.log(error)
      }
    }

    function validatieAuthentication(type){
      if( type === 'wishListBtn' || type === 'wishlist' ){
      if( isAuthenticated === true ){
        wishListData();
      }else{
        navigate('/login')
      }
    }else if( type === 'cart' ){
      if( isAuthenticated === true ){
        // addToCart()
      }else{
        navigate('/login');
      }
    }
    }

    function wishListData(){
    setWishList((previousValue)=>({...previousValue,status:!previousValue.status}))
  }

  function pincodeChange({ target: { value } }) {
    setpincodeValue(value);
  }

  async function checkingPincode() {
    try {
      const respose = await axios.get(`https://api.postalpincode.in/pincode/${pincodevalue}`);
      if (respose.data[0].Status != "Error") {
        const town = respose.data.map(({ PostOffice }) => {return PostOffice[0].Block || null});
        setPincodePlace({pincode: pincodevalue,pincodeTown: town[0],status: respose.data[0].Status,});
        setpincodeValue("");
      } else {
        setPincodePlace({pincode:'',pincodeTown:'',status:respose.data[0].Status})
        setInvalidPincode('Invalid Pincode')
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
        {catData && (
           <Grid className='catContent' >
              <Grid className='itemList' >
                    <Grid className='item catContentImage' >
                      <img src={catData.url} alt={catData.id} />
                    </Grid>
                    <Grid className='item catContentData' >

                      <CatContentData containerName='sub-item catContentInfo' breedName={catInfo.catName} value={catData.price} description={catInfo.description} origin={catInfo.country} catWeight={catInfo.weight}  />

                      <CatWishListAndAddToCartBtn containerName='sub-item catContentButtons' wishClassname='wishListIconBtn btnContent' wishValidate={validatieAuthentication} wishIconClassname={wishList.status ? 'selected' : 'unselected' } cartClassname='addToCart btnContent' cartValidate={validatieAuthentication}  />

                      <CatPincodeContent containerName='pincodeContent' value={pincodevalue} handlePincodeChange={pincodeChange} validatePincode={checkingPincode} />

                      <PincodePlace containerName='pincodePlace' pincode={pincodePlace.pincode} town={pincodePlace.pincodeTown} status={pincodePlace.status} invalid={invalidPincode} />

                      <Grid className="delivery">
                        {pincodePlace.status === "Success" ? (<Typography variant="body1">Delivery with in 3 days</Typography>) : null}
                      </Grid>

                    </Grid>
                  <Grid className='wishlistContent' >
                    <Button href={ isAuthenticated ? '/wishlist' : '/login' } type='button' onClick={()=> validatieAuthentication('wishlist') } >WishList</Button>
                  </Grid>  
              </Grid>
                <Grid className='randomCats' >
                  <CarouselCatImages containerName='randomCatsContent' contentData={carouselcats} />
                </Grid>
           </Grid>
        ) }
    </>
  )
}

function CatContentData({ containerName, breedName, value, description, origin, catWeight  }){
  return(
    <Grid className={containerName} >
      <Typography variant='body1' className='info' id='breed' >Breed: {breedName.toLocaleUpperCase()}</Typography>
      <Typography variant='body1' className='info' id='price' >Price: {value}</Typography>
      <Typography variant='body2' className='info' >{description}</Typography>
      <Typography variant='body2' className='info' id='country' >Country: {origin}</Typography>
      <Typography variant='body2' className='info' id='weight' >Weight: {catWeight}</Typography>
    </Grid>
  )
}

function CatWishListAndAddToCartBtn({ containerName, wishClassname, wishValidate, wishIconClassname, cartClassname, cartValidate }){
  return(
    <Grid className={containerName} >
      <Button className={wishClassname} type='button' variant='contained' onClick={()=> wishValidate('wishListBtn') } > <FavoriteIcon className={wishIconClassname} /> </Button>
      <Button className={cartClassname} type='button' variant='contained' onClick={()=> cartValidate('cart') } >Add To Cart</Button>
    </Grid>
  )
}

function CatPincodeContent({ containerName, value, handlePincodeChange, validatePincode }){
  return(
    <Grid className={containerName} >
      <NumericFormat id='pincode' placeholder='Pincode' value={value} onChange={handlePincodeChange} decimalScale={0} allowNegative={false} isAllowed={(values)=> { const { floatValue } = values; return floatValue === undefined || floatValue<=999999 } } />
      <Button type='button' variant='contained' onClick={validatePincode} >Check</Button>
    </Grid>
  )
}

function PincodePlace({ containerName, pincode, town, status, invalid }){
  return(
    <Grid className={containerName} >
      { status != 'Error' && town !='' && pincode != ''? ( <Typography variant='body1' >{pincode} {town}</Typography> ) : ( <Typography variant='body1' id='invalid' >{invalid}</Typography> ) }
    </Grid>
  )
}

function CarouselCatImages( { containerName, contentData } ){
  const [currentindex,setCurrentIndex] = useState(0);
  
    function handleLeft(){
      if(currentindex > 0 ){
        setCurrentIndex((prevalue)=> prevalue-1)
      }
    }
  
    function handleRight(){
      if(currentindex + 4 < contentData.length){
        setCurrentIndex((prevalue)=> prevalue+1)
      }
    }
  
    return(
      <Grid id={containerName} >
        <IconButton onClick={handleLeft} disabled={ currentindex === 0 } id='leftBtn' > <ArrowBackIosIcon/> </IconButton>
        <Grid display='flex' overflow='hidden' width='100%' id='content' >
          { contentData.slice(currentindex, currentindex+4).map((data)=>(
            <Grid className='catImages' key={data._id} >
              <Link to={`/cat/${data._id}`} >
                <Card className='card' >
                  <CardMedia component='img' className='cardImage' image={data.url} alt={data.id} height='275' />
                  <CardContent className='cardContent' >
                    <Typography variant='body1' >{data.breeds[0].name}</Typography>
                    <Typography variant='body1' >{data.price}</Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          )) }
        </Grid>
        <IconButton onClick={handleRight} disabled={currentindex === 6} id='rightBtn' ><ArrowForwardIosIcon/></IconButton>
      </Grid>
    )
}

export default CatContent
