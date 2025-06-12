import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, CardContent, CardMedia, Grid, IconButton, TextField, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { NumericFormat } from "react-number-format";
import "../componentsCss/dogContent.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function DogContent({isAuthenticated}) {
  const { _id } = useParams();
  const [dogData, setDogData] = useState(null);
  const [carouselDogs,setCarouselDogs] = useState([]);
  const [pincodevalue, setpincodeValue] = useState("");
  const [pincodePlace, setPincodePlace] = useState({pincode: "",pincodeTown: "",status: "",});
  const [invalidPincode,setInvalidPincode]= useState('')
  const [wishList, setWishList] = useState({ data:[],status:false });

  const navigate = useNavigate();

  useEffect(() => {
    dogFetchingData();
    dogContent();
  }, [_id]);

  async function dogFetchingData() {
      const response = await axios.get(`http://localhost:5000/api/dogs/${_id}`);
      const responseData = response.data.dogData;
      setDogData(responseData);
    }

   async function dogContent() {
    try {
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


  function validatingAuthenication(type){
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
                <Button className="wishlistIconBtn btnContent" type="button" variant="contained" onClick={()=>validatingAuthenication('wishListBtn')}> <FavoriteIcon className={wishList.status ? 'selected' : 'unselected' } /> </Button>
                <Button className="addToCart btnContent" type="button" variant="contained" onClick={()=>validatingAuthenication('cart')}> Add To Cart</Button>
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
            <Grid className="wishlistContent">
              <Button href={isAuthenticated ? '/wishlist' : '/login'} type="button" onClick={()=>validatingAuthenication('wishlist')} >WishList</Button>
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
