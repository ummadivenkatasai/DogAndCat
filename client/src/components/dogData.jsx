import '../componentsCss/dog.css'
import { Card, CardContent, CardMedia, Checkbox, FormControl, Grid, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom';

const DogData = () => {
    const [dogData,setDogData]=useState([]);
    const [breedName, setBreedName] = useState([]);

    const [selectedBreedName,setSelectedBreedName] = useState([]);

    useEffect(()=>{
        async function dogDataFetching() {
          const breedSet = new Set();
            try {
                const response = await fetch('http://localhost:5000/api/dogs');
                const responseData = await response.json();
                setDogData(responseData);
                responseData.map((data)=>{
                  breedSet.add(data.breed)
                })
                setBreedName([...breedSet].map((data)=>data))
            } catch (error) {
                console.log('dog data error:',error)
            }
        }
        dogDataFetching()
    },[])

    function selectBreed({target:{value}}){
      setSelectedBreedName(value)
    }
    

  return (
    <Grid container className='dogData' >
      <Grid container className='dogFilters' >
        <Grid className='breedName' >
          <Typography variant='body1' >Breed</Typography>
          <FormControl className='checkbox' sx={{minWidth:250,maxWidth:250}} >
            <Select className='select' input={<OutlinedInput/>} value={selectedBreedName} onChange={selectBreed} label="Breed Name" multiple renderValue={(selected) => selected.join(', ')} >
              {breedName.map((data)=>(
                <MenuItem className='menuItem' value={data} id={data} >
                  <Checkbox checked={selectedBreedName.includes(data)} />
                  {data}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container className='dogImages' rowSpacing={5} columnSpacing={4} >
        {dogData.map((data)=>(
          <Grid className='images' key={data._id} size={4} >
            <Link to={`/dog/${data._id}`} >
            <Card className='card' >
              <CardMedia component='img' className='cardImage' image={data.message} alt={data.breed} height='275' />
              <CardContent className='cardContent' >
                <Typography variant='body1' >{data.breed}</Typography>
                <Typography variant='body1' >Price:{data.price}</Typography>
              </CardContent>
            </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Outlet/>
    </Grid>
  )
}

export default DogData
