import '../componentsCss/cat.css'
import { Button, Card, CardContent, CardMedia, Checkbox, FormControl, Grid, MenuItem, OutlinedInput, Radio, Select, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProducts } from '../reduxComponent/slice';

const checkBoxWidth={
  minWidth:250,
  maxWidth:250
}

const token = localStorage.getItem('token')

function CatData(){
  const [catData,setCatData] = useState([]);
  const [fliterOptions,setFliterOptions] = useState({ breedNames:[], temperament:[], country:[], lifeSpan:[], energy:[] })

  const [fliters,setFliters]=useState({
    breedNameSelected:[], temperamentSelected:[],countrySelected:'', lifeSpanSelected:[], energySelected:'' 
  })

  const dispatch = useDispatch()

  useEffect(()=>{
    fetchCatData()
  },[dispatch])

  async function fetchCatData() {
      const response = await fetch('http://localhost:5000/api/cats');
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cats`);
      const responseData = await response.json();
      setCatData(responseData);
      dispatch(setProducts(responseData))

      const nameSet = new Set();
      const temperamentSet = new Set();
      const countrySet = new Set();
      const lifeSpanSet = new Set();
      const energySet = new Set();

      responseData.forEach(({breeds})=>{
        nameSet.add(breeds[0].name)
        breeds[0].temperament.split(',').map((data)=>data.trim()).forEach((data)=>temperamentSet.add(data))
        countrySet.add(breeds[0].origin)
        breeds[0].life_span.split('-').map((data)=>data.trim()).forEach((data)=>lifeSpanSet.add(data))
        energySet.add(breeds[0].energy_level)
      })

      setFliterOptions({
        breedNames: Array.from(nameSet),
        temperament: Array.from(temperamentSet),
        country: Array.from(countrySet),
        lifeSpan: Array.from(lifeSpanSet).sort((x,y)=> x-y),
        energy: Array.from(energySet).sort((x,y)=> x-y)
      })

  }

  

  function handleChange({target}){
    const {name, value} = target
   setFliters((prev)=>({
    ...prev,
    [name]:value
   }))
  }
  
  async function fliterData(type) {
    if( type === 'apply' ){
      try {
        const requestedBody={
          category:'cat',
          data:fliters
        }
        // const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/products `,requestedBody,{headers:{Authorization:`Bearer ${token}`}})
        const response = await axios.post('http://localhost:5000/api/products',requestedBody,{headers:{Authorization:`Bearer ${token}`}})
        setCatData(response.data.message)
      } catch (error) {
        console.log('send fliter data error',error)
      }
    }else if ( type === 'reset' ){
      setFliters({breedNameSelected:[], temperamentSelected:[],countrySelected:'', lifeSpanSelected:[], energySelected:'' })
      fetchCatData()
    }
  }

  return (
    <Grid container className='catData' >
      <Grid container className='catFilters' >
        <CustomCheckBox containerClassName='fliters breedName' containerName='Breed' box={checkBoxWidth} selectLabel='Breed Name' itemName={fliters.breedNameSelected} changeFun={handleChange} itemNames={fliterOptions.breedNames} optionName='breedNameSelected' />

        <CustomCheckBox containerClassName='fliters Temperament' containerName='Temperament' box={checkBoxWidth} selectLabel='Temperament' itemName={fliters.temperamentSelected} changeFun={handleChange} itemNames={fliterOptions.temperament} optionName='temperamentSelected' />

        <CustomSingleCheckBox containerClassName='fliters origin' containerName='Country' box={checkBoxWidth} selectLabel='Country' itemName={fliters.countrySelected} changeFun={handleChange} itemNames={fliterOptions.country} optionName='countrySelected'  />

        <CustomCheckBox containerClassName='fliters lifeSpan' containerName='lifeSpan' box={checkBoxWidth} selectLabel='lifeSpan' itemName={fliters.lifeSpanSelected} changeFun={handleChange} itemNames={fliterOptions.lifeSpan} optionName='lifeSpanSelected' />

        <CustomSingleCheckBox containerClassName='fliters enegryLevel' containerName='Energy Level' box={checkBoxWidth} selectLabel='energy' itemName={fliters.energySelected} changeFun={handleChange} itemNames={fliterOptions.energy} optionName='energySelected' />

        <Grid className='fliterBtn' style={{  display:'flex', justifyContent:'space-around', marginTop:'2rem', width:'15rem' }} >
          <Button variant='contained' type='button' onClick={()=>{fliterData('apply')}} style={{backgroundColor:'orange'}} >Apply</Button>
          <Button variant='contained' type='button' onClick={()=>{fliterData('reset')}} style={{backgroundColor:'orange'}} >Reset</Button>
        </Grid>
      </Grid>
      <Grid container className='catImages' rowSpacing={5} >
        {catData.map((data)=>(
          <Grid size={4} key={data._id} className='images'  >
            <Link to={`/cat/${data._id}`} target='_blank' >
              <Card className='card' sx={{maxWidth:345}} >
                <CardMedia className='cargImage' component='img' image={data.url} alt={data.id} height='275' />
                <CardContent className='cardContent' >
                  <Typography variant='body1' >{data.breeds[0].name}</Typography>
                  <Typography variant='body1' >Price: {data.price}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

function CustomCheckBox({ containerClassName, containerName, box, selectLabel, itemName, changeFun, itemNames, optionName }){
  return(
    <Grid className={containerClassName} >
      <Typography variant='body1' >{containerName}</Typography>
      <FormControl className='checkbox' sx={box} >
        <Select className='select' input={<OutlinedInput/>} name={optionName} label={selectLabel} value={itemName} onChange={changeFun} renderValue={(select)=> select.join(',') } multiple >
          {itemNames.map((data)=>(
            <MenuItem className='menuItem' value={data} key={data} >
              <Checkbox checked={itemName.includes(data)} />
              {data}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  )
}

function CustomSingleCheckBox({ containerClassName, containerName, box, selectLabel, itemName, changeFun, itemNames, optionName }){
  return(
     <Grid className={containerClassName} >
      <Typography variant='body1' >{containerName}</Typography>
      <FormControl className='checkbox' sx={box} >
        <Select className='select'  input={<OutlinedInput/>} name={optionName} label={selectLabel} value={itemName} onChange={changeFun} renderValue={(select)=> select} >
          {itemNames.map((data)=>(
            <MenuItem className='menuItem' value={data} key={data} >
              <Checkbox checked={itemName === data} />
              {data}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  )
}


export default CatData