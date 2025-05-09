import { Button, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import '../componentsCss/signup.css'

function Signup() {
    const [formData,setFormData] = useState({ firstName:'', lastName:'', gender:'', dateOfBirth:{day:'',month:'',year:''}, mobileNumber:'', email:'', password:'' });

    function handleChange({target}){
        const {name,value} = target;
        const trimmedValue = value.trim()
        if(['day','month','year'].includes(name)){
            setFormData((pre)=>({
                ...pre,
                dateOfBirth:{
                    ...pre.dateOfBirth,
                    [name]:trimmedValue
                }
            }))
        }else{
            setFormData((pre)=>({
                ...pre,
                [name]:trimmedValue
            }))
        }
    }

    function submitData(e){
        e.preventDefault();
        console.log(formData)
    }

  return (
    <Grid className='signupForm' container >
        <form className='signupContent' onSubmit={submitData} >
            <Typography variant='h5' className='input heading' >Register</Typography>
            <Grid className='input userName' >
                <Grid className='firstname' >
                    <TextField variant='outlined' label='First Name' name='firstName' value={formData.firstName} onChange={handleChange}  />
                </Grid>
                <Grid className='lastname' >
                    <TextField variant='outlined' label='Last Name' name='lastName' value={formData.lastName} onChange={handleChange} />
                </Grid>
            </Grid>
            <Grid className='input genderContent' size={12} >
                <FormControl className='genderForm' >
                    <FormLabel id='genderLabel' >Gender</FormLabel>
                    <RadioGroup name='gender' value={formData.gender} className='genderRadio' onChange={handleChange} row >
                        <FormControlLabel label='Male' value='male'  control={<Radio/>} />
                        <FormControlLabel label='Female' value='female'  control={<Radio/>} />
                        <FormControlLabel label='Other' value='other'  control={<Radio/>} />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid className='input dateOfBirth' >
                <Typography variant='body1' >Date Of Birth</Typography>
                <Grid container size={8} className='dobContent' columnSpacing={3}  >
                        <TextField variant='outlined' sx={{maxWidth:90}} type='number' name='day'  value={formData.dateOfBirth.day} onChange={handleChange} label='Day'  />
                        <TextField variant='outlined' sx={{maxWidth:90}} type='number' name='month'  value={formData.dateOfBirth.month} onChange={handleChange} label='Month'  />
                        <TextField variant='outlined' sx={{maxWidth:90}} type='number' name='year'  value={formData.dateOfBirth.year} onChange={handleChange} label='Year'  />
                    </Grid>
            </Grid>
            <Grid className='input mobileNumber' >
                <TextField variant='outlined' sx={{maxWidth:170}} name='mobileNumber' value={formData.mobileNumber} onChange={handleChange} label='Mobile Number' />
                <Button variant='contained' type='button' >Verify</Button>
            </Grid>
            <Grid className='input email' >
                <TextField sx={{minWidth:450}} variant='outlined' label='Email' name='email' onChange={handleChange} value={formData.email} />
            </Grid>
            <Grid className='input password' >
                <TextField sx={{minWidth:450}} variant='outlined' label='Password' name='password' type='password' value={formData.password} onChange={handleChange}  />
            </Grid>
            <Grid className='submitBtn' >
                <Button variant='contained' type='submit' >Register</Button>
            </Grid>
        </form>
    </Grid>
  )
}

export default Signup
