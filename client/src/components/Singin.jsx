import React, {  useState } from 'react'
import { Button, Grid, Typography, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../componentsCss/signin.css'

function Signin() {

  const [formData,setFormData] = useState({email:'',password:''});
  const [fieldError,setFieldError] = useState('');
  const [error,setError] = useState('');
  const navigate = useNavigate();

  function handleChange ({target}){
   setFormData({...formData,[target.name]:target.value})
   setFieldError('');
  }

  async function sendData(event){
   event.preventDefault();
   if(formData.email ==='' || formData.password === '' ){
    setFieldError('All Field is required')
    setError('')
  }
   
   try {
    const response = await axios.post('http://localhost:5173/api/auth/signin',formData);
    localStorage.setItem("token",response.data.token);
    navigate('/')
   } catch (error) {
    // setError('Login Failed')
    setError(error.response.data.message || "Login failed")
   }
  }

  return (
    <Grid container className='signinForm' >
      <form className='signinContent' onSubmit={sendData} >
        <Typography variant='h5' >Singin</Typography>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Grid className='inputData email' size={8} >
          <TextField variant='outlined' name='email' value={formData.email} onChange={handleChange} placeholder='Email' sx={{minWidth:262,maxWidth:400}}  />
        </Grid>
        <Grid className='inputData password' size={8} >
          <TextField variant='outlined' name='password' value={formData.password} onChange={handleChange} type='password' placeholder='Password' sx={{minWidth:262,maxWidth:400}}  />
        </Grid>
        {fieldError && <p style={{ color: 'red' }}>{fieldError}</p>}
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