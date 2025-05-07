import '../componentsCss/cat.css'
import { Card, CardContent, CardMedia, Checkbox, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'


const CatData = () => {
  const [catData,setCatData] = useState([]);
  const [breedNames,setBreedNames]=useState([])
  const [alltemperament,setAllTemperament] = useState([]);
  const [country,setCountry] = useState([]);
  const [lifeSpan,setLifeSpan] = useState([]);
  const [energy,setEnergy] = useState([]);

  const [breedNameSeleted,setBreedNameSeleted]=useState([]);
  const [temperamentSeleted,setTemperamentSeleted] = useState([]);
  const [countrySelected,setCountrySeleted] = useState('');
  const [lifeSpanSelected,setLifeSpanSelected]=useState([]);
  const [energySelected,setEnergySelected] = useState('');

  useEffect(()=>{
    async function fetchCatData() {
      const response = await fetch('http://localhost:5000/api/cats');
      const responseData = await response.json();
      setCatData(responseData);

      const nameSet = new Set();
      const temperamentSet = new Set();
      const countrySet = new Set();
      const lifeSpanSet = new Set();
      const enegrySet = new Set();

      responseData.forEach(({breeds})=>{
        nameSet.add(breeds[0].name)
        breeds[0].temperament.split(',').map((data)=>data.trim()).forEach((data)=>temperamentSet.add(data))
        countrySet.add(breeds[0].origin)
        breeds[0].life_span.split('-').map((data)=>data.trim()).forEach((data)=>lifeSpanSet.add(data))
        enegrySet.add(breeds[0].energy_level)
      })

      setBreedNames([...nameSet]);
      setAllTemperament([...temperamentSet])
      setCountry([...countrySet])
      setLifeSpan([...lifeSpanSet].sort((x,y)=>x-y))
      setEnergy([...enegrySet].sort((x,y)=>x-y))

    }
    fetchCatData()
  },[])

  function handleChange(set){
    return function({target:{value}}){
      set(value)
    }
  }

  catData.map((data)=>{
    // console.log(data)
  })

  return (
    <Grid container className='catData' >
      <Grid container className='catFilters' >
        <Grid className='fliters breedname' >
          <Typography variant='body1' >Breeds</Typography>
          <FormControl className='checkbox' sx={{minWidth:250,maxWidth:250}} >
            <Select className='select' input={<OutlinedInput />} value={breedNameSeleted} label="Breed Name" onChange={handleChange(setBreedNameSeleted)} multiple renderValue={(selected) => selected.join(', ')} >
              {breedNames.map((data)=>(
                  <MenuItem className='menuItem' value={data} key={data} >
                    <Checkbox checked={breedNameSeleted.includes(data)} />
                    {data}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid className='fliters Temperament' >
            <Typography variant='body1' >Temperament</Typography>
            <FormControl className='checkbox' sx={{minWidth:250,maxWidth:250}} >
              <Select className='select' input={<OutlinedInput />} value={temperamentSeleted} label='Temperament' onChange={handleChange(setTemperamentSeleted)} multiple renderValue={(selected)=> selected.join(', ') } >
                {alltemperament.map((data)=>(
                  <MenuItem className='menuItem' value={data} key={data} >
                    < Checkbox checked={temperamentSeleted.includes(data)}  />
                    {data}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Grid>
        <Grid className='fliters origin' >
          <Typography variant='body1' >Country</Typography>
          <FormControl className='checkbox' sx={{minWidth:250,maxWidth:250}} >
            <Select className='select' input={<OutlinedInput/>} value={countrySelected} label='Country' onChange={handleChange(setCountrySeleted)} renderValue={(selected)=> selected} >
                {country.map((data)=>(
                  <MenuItem className='menuItem' value={data} key={data} >
                    < Checkbox checked={countrySelected === data} />
                    {data}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid className='fliters lifeSpan' >
           <Typography variant='body1' >Life Span</Typography>
           <FormControl className='checkbox' sx={{minWidth:250,maxWidth:250}} >
           <Select className='select' input={<OutlinedInput />} value={lifeSpanSelected} label='lifeSpan' onChange={handleChange(setLifeSpanSelected)} multiple renderValue={(selected)=> selected.join(', ') } >
           {lifeSpan.map((data)=>(
            <MenuItem className='menuItem' value={data} key={data} >
            <Checkbox checked={lifeSpanSelected.includes(data)} />
            {data}
          </MenuItem>
           ))}
           </Select>
            </FormControl>     
        </Grid>
        <Grid className='fliters enegryLevel' >
            <Typography variant='body1' >Energy Level</Typography>
            <FormControl className='checkbox' sx={{minWidth:250,maxWidth:250}} >
              <Select className='select' input={<OutlinedInput/>} value={energySelected} label='enegry' onChange={handleChange(setEnergySelected)} renderValue={(selected)=> selected} >
                {energy.map((data)=>(
                  <MenuItem className='menuItem'  value={data} key={data} >
                    <Checkbox checked={energySelected === data} />
                    {data}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Grid>
      </Grid>
      <Grid container className='catImages' rowSpacing={5} >
        {catData.map((data)=>(
          <Grid size={4} key={data._id} className='images'  >
            <Card className='card' sx={{maxWidth:345}} >
              <CardMedia className='cargImage' component='img' image={data.url} alt={data.id} height='275' />
              <CardContent className='cardContent' >
                <Typography variant='body1' >{data.breeds[0].name}</Typography>
                <Typography variant='body1' >Price: {data.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

export default CatData
