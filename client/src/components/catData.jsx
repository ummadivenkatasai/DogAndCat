import '../componentsCss/cat.css'
import { Checkbox, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, selectClasses, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'


const CatData = () => {
  const [catData,setCatData] = useState([]);
  const [breedNames,setBreedNames]=useState(new Set())
  const [alltemperament,setAllTemperament] = useState(new Set());
  const [country,setCountry] = useState(new Set());
  const [lifeSpan,setLifeSpan] = useState(new Set());
  const [energy,setEnergy] = useState(new Set());
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
      const origin = new Set();
      const span = new Set();
      const power = new Set();

      responseData.forEach(({breeds})=>{
        nameSet.add(breeds[0].name)
        breeds[0].temperament.split(',').map((data)=>data.trim()).forEach((data)=>temperamentSet.add(data))
        origin.add(breeds[0].origin)
        breeds[0].life_span.split('-').map((data)=>data.trim()).forEach((data)=>span.add(data))
        power.add(breeds[0].energy_level)
      })

      setBreedNames(nameSet);
      setAllTemperament(temperamentSet)
      setCountry(origin)
      const sortedLifeSpan = [...span].sort((a, b) => a-b)
      setLifeSpan(sortedLifeSpan)
      const sortedEnegry = [...power].sort((a,b)=>a-b)
      setEnergy(sortedEnegry)

    }
    fetchCatData()
  },[])

  function selectBreedName({target:{value}}){
    setBreedNameSeleted(value)
  }

  function selectTemperament({target:{value}}){
    setTemperamentSeleted(value)
  }

  function selectCountry({target:{value}}){
    setCountrySeleted(value);
  }

  function selectLifeSpan({target:{value}}){
    setLifeSpanSelected(value)
  }

  function selectEnergy({target:{value}}){
    setEnergySelected(value)
  }

  return (
    <Grid container className='catData' >
      <Grid container className='catFilters' >
        <Grid className='breedname' >
          <Typography variant='body1' >Breeds</Typography>
          <FormControl sx={{minWidth:250,maxWidth:250}} >
            <Select input={<OutlinedInput />} value={breedNameSeleted} label="Breed Name" onChange={selectBreedName} multiple renderValue={(selected) => selected.join(', ')} >
              {[...breedNames].map((data)=>(
                  <MenuItem value={data} key={data} >
                    <Checkbox checked={breedNameSeleted.indexOf(data) > -1} />
                    {data}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid className='Temperament' >
            <Typography variant='body1' >Temperament</Typography>
            <FormControl sx={{minWidth:250,maxWidth:250}} >
              <Select input={<OutlinedInput />} value={temperamentSeleted} label='Temperament' onChange={selectTemperament} multiple renderValue={(selected)=> selected.join(', ') } >
                {[...alltemperament].map((data)=>(
                  <MenuItem value={data} key={data} >
                    < Checkbox checked={temperamentSeleted.indexOf(data) > -1}  />
                    {data}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Grid>
        <Grid className='origin' >
          <Typography variant='body1' >Country</Typography>
          <FormControl sx={{minWidth:250,maxWidth:250}} >
            <Select input={<OutlinedInput/>} value={countrySelected} label='Country' onChange={selectCountry} renderValue={(selected)=> selected} >
                {[...country].map((data)=>(
                  <MenuItem value={data} key={data} >
                    < Checkbox checked={countrySelected === data} />
                    {data}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid className='lifeSpan' >
           <Typography variant='body1' >Life Span</Typography>
           <FormControl sx={{minWidth:250,maxWidth:250}} >
           <Select input={<OutlinedInput />} value={lifeSpanSelected} label='lifeSpan' onChange={selectLifeSpan} multiple renderValue={(selected)=> selected.join(', ') } >
           {[...lifeSpan].map((data)=>(
            <MenuItem value={data} key={data} >
            <Checkbox checked={lifeSpanSelected.indexOf(data) > -1} />
            {data}
          </MenuItem>
           ))}
           </Select>
            </FormControl>     
        </Grid>
        <Grid className='enegryLevel' >
            <Typography variant='body1' >Energy Level</Typography>
            <FormControl sx={{minWidth:250,maxWidth:250}} >
              <Select input={<OutlinedInput/>} value={energySelected} label='enegry' onChange={selectEnergy} renderValue={(selected)=> selected} >
                {[...energy].map((data)=>(
                  <MenuItem value={data} key={data} >
                    <Checkbox checked={energySelected === data} />
                    {data}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Grid>
      </Grid>
      <Grid container className='catImages' >

      </Grid>
    </Grid>
  )
}

export default CatData
