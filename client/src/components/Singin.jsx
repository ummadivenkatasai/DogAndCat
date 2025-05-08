import React, {  useState } from 'react'
import { Button, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../componentsCss/singin.css'

function Singin() {

  const [formData,setFormData] = useState({email:'',password:''});
  const [error,setError] = useState('');
  const navigate = useNavigate();

  function handleChange ({target}){
   setFormData({...formData,[target.name]:target.value})
  }

  async function sendData(event){
   event.preventDefault();
   setError('');
   try {
    const response = await axios.post('http://localhost:5173/api/auth/singin');
    localStorage.setItem("token",response.data.token);
    navigate('/')
   } catch (error) {
    setError(error.response.data.message || "Login failed")
   }
  }

  return (
    <Grid container className='singinForm' >
      <Grid className='singinContent' >
        <Typography variant='h5' >Singin</Typography>
        <Grid className='inputData email' size={8} >
          <TextField variant='outlined' name='email' value={formData.email} onChange={handleChange} placeholder='Email' sx={{minWidth:262,maxWidth:400}} required />
        </Grid>
        <Grid className='inputData password' size={8} >
          <TextField variant='outlined' name='password' value={formData.password} onChange={handleChange} placeholder='Password' sx={{minWidth:262,maxWidth:400}} required />
        </Grid>
        <Grid className='inputData loginBtn' >
          <Button variant='contained' sx={{minWidth:200}} onSubmit={sendData} >Login</Button>
        </Grid>
        <Grid className='loginSingup' size={8} >
          <Typography variant='body1' >
          Already have Account?
          </Typography>
          <span><Link to="/singup">SingUp</Link></span>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Singin


{/* <Grid className='userName' size={12} >
          <Grid className='firstName' size={6} >
            <TextField variant='outlined' placeholder='First Name' name='firstName' value='' onChange='' />
          </Grid>
          <Grid className='lastName' >
            <TextField variant='outlined' placeholder='Last Name' name='lastName' value='' onChange='' />
          </Grid>
        </Grid>
        <Grid className='genderContent' size={12} >
          <FormControl className='genderForm' >
            <FormLabel>Gender</FormLabel>
            <RadioGroup name='gender' className='genderContent' >
              <FormControlLabel value='male' control={<Radio/>} label='Male' onChange='' />
              <FormControlLabel value='female' control={<Radio/>} label='Female' onChange='' />
              <FormControlLabel value='other' control={<Radio/>} label='Other' onChange='' />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid className='email' size={12} >
          <TextField variant='outlined' placeholder='Email' name='email' value='' onChange='' sx={{minWidth:543}} />
        </Grid>
        <Grid className='password' size={12} >
          <TextField variant='outlined' placeholder='Password' name='password' value='' onChange='' sx={{minWidth:543}} />
        </Grid> */}