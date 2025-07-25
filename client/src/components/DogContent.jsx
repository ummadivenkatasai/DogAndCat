import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, CardContent, CardMedia, Grid, IconButton, TextField, Typography } from "@mui/material";
import { NumericFormat } from "react-number-format";
import "../componentsCss/dogContent.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MinimizeIcon from '@mui/icons-material/Minimize';
import AddIcon from '@mui/icons-material/Add';

function DogContent({isAuthenticated}) { //onAddToCart
  const { _id } = useParams();
  const [dogData, setDogData] = useState(null);
  const [isWishList,setIsWishList]=useState(false);
  const [pincodevalue, setpincodeValue] = useState("");
  const [pincodePlace, setPincodePlace] = useState({pincode: "",pincodeTown: "",status: "",});
  const [invalidPincode,setInvalidPincode]= useState('');
  let [cartQty,setCartQty]=useState(1);
  const [carouselDogs,setCarouselDogs] = useState([]);
  const [isCartClick,setIsCartClick] = useState(false)
  

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async ()=>{
      try {
        await fetchingDogData();
        await dogContent();
      } catch (error) {
        console.log(error)
      }
    }
      if(isAuthenticated) checkWishListStatus()
        fetchData()
  }, [_id,isAuthenticated]);

  async function fetchingDogData() {
    
    // const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dogs/${_id}`);
      const response = await axios.get(`http://localhost:5000/api/dogs/${_id}`);
      const responseData = response.data.dogData;
      setDogData(responseData);
    }

   async function dogContent() {
    try {
      
      // const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dogs`);
      const response = await axios.get('http://localhost:5000/api/dogs');
      const dogs = response.data;
      const duplicate= new Set();
      while( duplicate.size<10 ){
        const randomReslut = Math.floor(Math.random()*dogs.length);
        if(!duplicate.has(randomReslut)){
          duplicate.add(randomReslut);
        }
      }
      const randomContainer = [...duplicate].map((index) => dogs[index] );
      setCarouselDogs(randomContainer)
    } catch (error) {
      console.log(error)
    }
  }

  async function checkWishListStatus() {
      try {
        const token = localStorage.getItem('token');
        // const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/wishlist/${_id}`,{ headers:{ Authorization:`Bearer ${token}` } })
        const response = await axios.get(`http://localhost:5000/api/wishlist/${_id}`,{ headers:{ Authorization:`Bearer ${token}` } })
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
          
          // const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/wishlist/dog`,{dogData},{headers:{ Authorization:`Bearer ${authoriseToken}` }});
          const result = await axios.post(`http://localhost:5000/api/wishlist/dog`,{dogData},{headers:{ Authorization:`Bearer ${authoriseToken}` }});
          setIsWishList(result.data.selected)
        }else if( type === 'cartBtn' ){
          setIsCartClick(true);
          
           const cartData = {...dogData,qty:cartQty};
          //  await axios.post(`${import.meta.env.VITE_API_URL}/api/cart`,cartData,{headers:{Authorization:`Bearer ${authoriseToken}`}})
          await axios.post(`http://localhost:5000/api/cart`,cartData,{headers:{Authorization:`Bearer ${authoriseToken}`}})
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
      // const respose = await axios.get(`${import.meta.env.VITE_API_URL}/pincode/${pincodevalue}`);
      const respose = await axios.get(`http://localhost:5000/pincode/${pincodevalue}`);
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
      {dogData && (
        <Grid container className="dogcontent">
          <Grid className="itemList">
            <Grid className="item dogContentImage">
              <img src={dogData.message} alt={dogData.breed} />
            </Grid>
            <Grid className="item dogContentData">
              <Grid className="sub-item dogContentInfo">
                <Typography variant="body1">Breed:{dogData.breed.toLocaleUpperCase()}</Typography>
                <Typography variant="body1">Price:{dogData.price}</Typography>
              </Grid>
              <Grid className="sub-item dogContentButtons">
                <Button className="wishlistIconBtn btnContent" type='button' variant="contained" onClick={()=>validatieAuthentication('wishListBtn')}> <FavoriteIcon className={isWishList ? 'selected' : 'unselected' } /> </Button>
                <Button className="addToCart btnContent" type="button" variant="contained" onClick={ ()=> validatieAuthentication('cartBtn') } href={isCartClick === true ? '/cart' : null } >{isCartClick === true ? 'Cart' : 'Add To Cart' }</Button>
              </Grid>
              <Grid className='sub-item dogQtyBtn' >
                <Button type="button" className="decrement qtyContent" onClick={()=> handleCartQty('decrement') } disabled={ cartQty === 1 } ><MinimizeIcon/></Button>
                <Typography variant="body1" className="qtyContent" >{cartQty}</Typography>
                <Button type="button" className="increment qtyContent" onClick={()=> handleCartQty('increment') } disabled={ cartQty === 5 } ><AddIcon/></Button>
              </Grid>
              <Grid className="pincodeContent">
                <NumericFormat placeholder="Pincode" value={pincodevalue} onChange={pincodeChange} decimalScale={0} allowNegative={false} isAllowed={(values) => {const { floatValue } = values;return floatValue === undefined || floatValue <= 999999; }}/>
                <Button type="button" variant="contained" onClick={checkingPincode}> Check</Button>
              </Grid>
              <Grid className="pincodePlace">
                {pincodePlace.status != "Error" && pincodePlace.pincode != "" && pincodePlace.pincodeTown != "" ? ( <Typography variant="body1">{pincodePlace.pincode} {pincodePlace.pincodeTown}</Typography>) : ( <Typography variant="body1" id="invalid" >{invalidPincode}</Typography> )}
              </Grid>
              <Grid className="delivery">{pincodePlace.status === "Success" ? (<Typography variant="body1">Delivery with in 3 days</Typography>) : null}
              </Grid>
            </Grid>
            
          </Grid>
          <Grid className='randomDogs' >
            <CarouselDogImages dogImagesData={carouselDogs} />
          </Grid>
        </Grid>
      )}
    </>
  );
}

function CarouselDogImages({ dogImagesData }){

  const [currentindex,setCurrentIndex] = useState(0);

  function handleLeft(){
    if(currentindex > 0 ){
      setCurrentIndex((prevalue)=> prevalue-1)
    }
  }

  function handleRight(){
    if(currentindex + 4 < dogImagesData.length){
      setCurrentIndex((prevalue)=> prevalue+1)
    }
  }

  return(
    <Grid id='randomDogsContent' >
      <IconButton onClick={handleLeft} disabled={currentindex === 0} className="letfBtn" > <ArrowBackIosIcon/> </IconButton>
      <Grid display="flex" overflow="hidden" width="100%" id='content' >
        {dogImagesData.slice(currentindex,currentindex+4).map((data)=>(
        <Grid className='dogimages' key={data._id}  >
          <Link to={`/dog/${data._id}`} >
            <Card className="card"  >
              <CardMedia component='img' className="cardImage" image={data.message} alt={data.breed} height="275"  />
              <CardContent className="cardContent">
                <Typography variant="body1">{data.breed}</Typography>
                <Typography variant="body1">Price:{data.price}</Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
      </Grid>
      <IconButton onClick={handleRight} disabled={currentindex === 6} className="rightBtn" > <ArrowForwardIosIcon/> </IconButton>
    </Grid>
  )
}

export default DogContent;
