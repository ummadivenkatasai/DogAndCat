import { Button, CardMedia, Grid, IconButton, Typography, Card, CardContent } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MinimizeIcon from '@mui/icons-material/Minimize';
import AddIcon from '@mui/icons-material/Add';
import { NumericFormat } from 'react-number-format'
import '../componentsCss/catContent.css'

function CatContent({isAuthenticated}) {

    const {_id} = useParams();
    const [catData,setCatData] = useState(null);
    const [catInfo,setCatInfo] = useState({ catName:null, description:null, country:null, weight:null  });
    const [isWishList,setIsWishList]=useState(false);
    const [pincodevalue, setpincodeValue] = useState("");
    const [pincodePlace, setPincodePlace] = useState({pincode: "",pincodeTown: "",status: "",});
    const [invalidPincode,setInvalidPincode]= useState('')
    let [cartQty,setCartQty]=useState(1);
    const [carouselcats,setCarouselCats] = useState([]);
    const [isCartClick,setIsCartClick] = useState(false)

    const navigate = useNavigate();

    useEffect(()=>{
        const fetchData = async ()=>{
          try {
            await fetchingCatData();
            await catContent();
          } catch (error) {
            console.log(error)
          }
        }
        if(isAuthenticated) checkWishListStatus()
        fetchData()
    },[_id,isAuthenticated])

    async function fetchingCatData(){
        // const response= await axios.get(`http://localhost:5000/api/cats/${_id}`)
        const response= await axios.get(`https://dogandcat-production.up.railway.app/api/cats/${_id}`) 
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
        const response = await axios.get('https://dogandcat-production.up.railway.app/api/cats')
        // const response = await axios.get('http://localhost:5000/api/cats');
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

    async function checkWishListStatus() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://dogandcat-production.up.railway.app/api/wishlist/${_id}`,{headers:{Authorization:`Bearer ${token}`}})
        // const response = await axios.get(`http://localhost:5000/api/wishlist/${_id}`,{ headers:{ Authorization:`Bearer ${token}` } })
        const userWishListItems = response.data.items || [];
        setIsWishList(userWishListItems.some((data)=> data._id === _id ))
      } catch (error) {
        console.log('checking wishlist status error',error)
      }
    }

    async function validatieAuthentication(type){
      if(isAuthenticated){
        const authoriseToken = localStorage.getItem("token");
        try {
        if(type === 'wishListBtn'){
          const result = await axios.post(`https://dogandcat-production.up.railway.app/api/wishlist/cat`,{catData},{headers:{ Authorization:`Bearer ${authoriseToken}` }});
          // const result = await axios.post(`http://localhost:5000/api/wishlist/cat`,{catData},{headers:{ Authorization:`Bearer ${authoriseToken}` }});
          setIsWishList(result.data.selected)
        }else if( type === 'cartBtn' ){
          setIsCartClick(true)
          const cartData = {...catData,qty:cartQty};
          await axios.post(`https://dogandcat-production.up.railway.app/api/cart`,cartData,{headers:{Authorization:`Bearer ${authoriseToken}`}})
          // const cartResult = await axios.post(`http://localhost:5000/api/cart`,cartData,{headers:{Authorization:`Bearer ${authoriseToken}`}})
        }
        } catch (error) {
         if(error) alert('quantity exceeds')
        }
      }else{
        navigate('/login')
      }
    }

    function handleCartQty(type){
      if( type === 'decrement' && cartQty >= 1 ){
        setCartQty(prev => prev-1);
      }else if( type === 'increment' && cartQty <= 5 ){
        setCartQty(prev => prev+1);
      }
    }

    function pincodeChange({ target: { value } }) {
      setpincodeValue(value);
    }

    async function checkingPincode() {
      try {
        // const respose = await axios.get(`http://localhost:5000/pincode/${pincodevalue}`);
        const response = await axios.get(`https://dogandcat-production.up.railway.app/pincode/${pincodevalue}`)
        if (response.data[0].Status != "Error") {
          const town = response.data.map(({ PostOffice }) => {return PostOffice[0].Block || null});
          setPincodePlace({pincode: pincodevalue,pincodeTown: town[0],status: response.data[0].Status,});
          setpincodeValue("");
        } else {
          setPincodePlace({pincode:'',pincodeTown:'',status:response.data[0].Status})
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

                      <CatWishListAndAddToCartBtn containerName='sub-item catContentButtons' wishClassname='wishListIconBtn btnContent' wishValidate={validatieAuthentication} wishIconClassname={isWishList ? 'selected' : 'unselected' } cartClassname='addToCart btnContent' cartValidate={validatieAuthentication} cartStatus={isCartClick}  />

                      <CatQuantityContent containerName='sub-item catQtyBtn' value={cartQty} contentHandle={handleCartQty} />

                      <CatPincodeContent containerName='pincodeContent' value={pincodevalue} handlePincodeChange={pincodeChange} validatePincode={checkingPincode} />

                      <PincodePlace containerName='pincodePlace' pincode={pincodePlace.pincode} town={pincodePlace.pincodeTown} status={pincodePlace.status} invalid={invalidPincode} />

                      <Grid className="delivery">
                        {pincodePlace.status === "Success" ? (<Typography variant="body1">Delivery with in 3 days</Typography>) : null}
                      </Grid>

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

function CatWishListAndAddToCartBtn({ containerName, wishClassname, wishValidate, wishIconClassname, cartClassname, cartValidate, cartStatus }){
  return(
    <Grid className={containerName} >
      <Button className={wishClassname} type='button' variant='contained' onClick={()=> wishValidate('wishListBtn') } > <FavoriteIcon className={wishIconClassname} /> </Button>
      <Button className={cartClassname} type='button' variant='contained' onClick={()=> cartValidate('cartBtn') } href={cartStatus === true ? '/cart' : null } >{cartStatus === true ? 'Cart' : 'Add To Cart' }</Button>
    </Grid>
  )
}

function CatQuantityContent({ containerName, value, contentHandle }){
  return(
    <Grid className={containerName} >
      <Button type='button' className='decrement qtyContent' onClick={ ()=> contentHandle('decrement')  } disabled={ value === 1 } ><MinimizeIcon/></Button>
      <Typography variant='body1' className='qtyContent' >{value}</Typography>
      <Button type='button' className='increment qtyContent' onClick={ ()=> contentHandle('increment') } disabled={ value === 5 } ><AddIcon/></Button>
    </Grid>
  )
}

function CatPincodeContent({ containerName, value, handlePincodeChange, validatePincode }){
  return(
    <Grid className={containerName} >
      <NumericFormat className='pincode' placeholder='Pincode' value={value} onChange={handlePincodeChange} decimalScale={0} allowNegative={false} isAllowed={(values)=> { const { floatValue } = values; return floatValue === undefined || floatValue<=999999 } } />
      <Button type='button' variant='contained' onClick={validatePincode} >Check</Button>
    </Grid>
  )
}

function PincodePlace({ containerName, pincode, town, status, invalid }){
  return(
    <Grid className={containerName} >
      { status != 'Error' && town !='' && pincode != ''? ( <Typography variant='body1' >{pincode} {town}</Typography> ) : ( <Typography variant='body1' className='invalid' >{invalid}</Typography> ) }
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