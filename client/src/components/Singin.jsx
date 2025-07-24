import React, { useState } from 'react'
import { Button, Grid, Typography, TextField, FormControl, OutlinedInput, InputAdornment, IconButton } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../componentsCss/signin.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


function Signin({prop}) {
  
  const [formData,setFormData] = useState({email:'',password:''});
  const [showPassword,setShowpassword] = useState('');
  const [fieldError,setFieldError] = useState('');
  const [error,setError] = useState('');
  const navigate = useNavigate();

  function handleChange ({target}){
   setFormData({...formData,[target.name]:target.value.trim()})
   setFieldError('');
  }

  function handlePassword(){
    setShowpassword(!showPassword);
  }

  async function sendData(event){
   event.preventDefault();
   if(formData.email ==='' || formData.password === '' ){
    setFieldError('All Field is required')
    setError('')
  }else{
    try {
      
    const response = await axios.post('https://dogandcat-production.up.railway.app/api/auth/signin',formData);
    // const response = await axios.post('http://localhost:5000/api/auth/signin',formData);
    localStorage.setItem("token",response.data.token);
    prop(true);
    navigate('/');
    setTimeout(()=>{
      localStorage.removeItem('token')
      navigate('/login');
      alert('session expired. please login');
    },60*60*1000)
   } catch (error) {
    setError( "Login failed");
    console.log(error);
   }
  }
} 


  return (
    <Grid container className='signinForm' >
      <form className='signinContent' onSubmit={sendData} >
        <Typography variant='h5' >Signin</Typography>
        {fieldError && error ? <></> : <span style={{ color: "red" }}>{error}</span> }
        <Grid className='inputData email' size={8} >
          <TextField variant='outlined' name='email' value={formData.email} onChange={handleChange} placeholder='Email' sx={{minWidth:262,maxWidth:400}}  />
          {formData.email === '' && fieldError ? <span style={{ color: 'red' }} >{fieldError}</span> : '' }
        </Grid>
        <Grid className='inputData password' size={8} >
          <FormControl className='field passwordField' fullWidth >
                    <OutlinedInput placeholder='Password' name='password' type={showPassword ? 'text' : 'password' } value={formData.password} onChange={handleChange} endAdornment={
                        <InputAdornment position='end'> 
                            <IconButton onClick={handlePassword} >
                                {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                            </IconButton>
                        </InputAdornment>
                    } required />
                </FormControl>
          {/* <TextField variant='outlined' name='password' value={formData.password} onChange={handleChange} type='password' placeholder='Password' sx={{minWidth:262,maxWidth:400}}  /> */}
          {formData.password === '' && fieldError ? <span style={{ color: 'red' }} >{fieldError}</span> : '' }
        </Grid>
        <Grid className='inputData loginBtn' >
          <Button variant='contained' sx={{minWidth:200}} type='submit' >Login</Button>
        </Grid>
        <Grid className='loginSignup' size={12} >
          <Typography variant='body1' >
          Already have Account?
          </Typography>
          <span><Link to="/signup">Create an Account</Link></span>
        </Grid>
      </form>
    </Grid>
  )
}

export default Signin