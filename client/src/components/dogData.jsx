import "../componentsCss/dog.css";
import {Card,CardContent,CardMedia,Checkbox,FormControl,Grid,MenuItem,OutlinedInput,Select,Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { setProducts } from "../reduxComponent/slice";
import { useSelector, useDispatch } from "react-redux";

function DogData (){
  const [dogData, setDogData] = useState([]);
  const [breedName, setBreedName] = useState([]);

  const [selectedBreedName, setSelectedBreedName] = useState([]);
  const token = localStorage.getItem('token');
  
  const products = useSelector((state)=> state.products.products );
  const dispatch = useDispatch();

  useEffect(() => {
    dogDataFetching();
  }, [dispatch]);

  async function dogDataFetching() {
      const breedSet = new Set();
      try {
        
        // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dogs`);
        const response = await fetch("http://localhost:5000/api/dogs");
        const responseData = await response.json();
          setDogData(responseData);
          dispatch(setProducts(responseData))
        responseData.map((data) => {
          breedSet.add(data.breed);
        });
        setBreedName([...breedSet]);
      } catch (error) {
        console.log("dog data error:", error);
      }
    }

  async function selectBreed({ target: { value } }) {
    setSelectedBreedName(value);
    const requestedBody={
      category:'dog',
      data:value
    }
    try {
      if( value.length == 0 ){
        console.log(value.length)
        dogDataFetching()
      }else{
        
        // const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`,requestedBody,{headers:{ Authorization:`Bearer ${token}` }})
        const response = await axios.post(`http://localhost:5000/api/products`,requestedBody,{headers:{ Authorization:`Bearer ${token}` }})
        setDogData(response.data.message)
      }
    } catch (error) {
      console.log('sending dog filters error',error)
    }
  }

  return (
    <Grid container className="dogData">
      <Grid container className="dogFilters">
        <Grid className="breedName">
          <Typography variant="body1">Breed</Typography>
          <FormControl
            className="checkbox"
            sx={{ minWidth: 250, maxWidth: 250 }}
          >
            <Select
              className="select"
              input={<OutlinedInput />}
              value={selectedBreedName}
              onChange={selectBreed}
              label="Breed Name"
              multiple
              renderValue={(selected) => selected.join(", ")}
            >
              {breedName.map((data) => (
                <MenuItem className="menuItem" value={data} id={data}>
                  <Checkbox checked={selectedBreedName.includes(data)} />
                  {data}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container className="dogImages" >
        {dogData.map((data) => (
          <Grid className="images" key={data._id} size={4}>
            <Link to={`/dog/${data._id}`} target="_blank">
              <Card className="card">
                <CardMedia component="img" className="cardImage" image={data.message} alt={data.breed} height="275"/>
                <CardContent className="cardContent">
                  <Typography variant="body1">{data.breed}</Typography>
                  <Typography variant="body1">Price:{data.price}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Outlet />
    </Grid>
  );
};

export default DogData;
