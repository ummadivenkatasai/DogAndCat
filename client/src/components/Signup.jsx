import { Button, Card, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, OutlinedInput, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { NumericFormat } from 'react-number-format'
import React, { useState } from 'react'
import '../componentsCss/signup.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Signup() {
    const [formData,setFormData] = useState({ firstName:'', lastName:'', gender:'', dateOfBirth:{day:'',month:'',year:''}, mobileNumber:'', email:'', password:'' });
    const [formError,setFormError] = useState('');
    const [verification,setVerification] = useState('');
    const [showPassword,setShowPassword] = useState(false);

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
        // if(['mobileVerification','emailVerification'].includes(name)){

        // }
    }

    function otpValidation(){

    }

    function handleShowPassword(){

    }

    function submitData(e){
        e.preventDefault();
        if(formData.firstName === '' || formData.lastName === '' || formData.gender=== '' || formData.dateOfBirth.day === '' || formData.dateOfBirth.month === '' || formData.dateOfBirth.year === '' || formData.mobileNumber === '' || formData.email === '' || formData.password === ''  ){
            setFormError('requried');
        }
        console.log(formData)
    }

  return (
    <Grid className='signupForm' container >
       <Card className='card' >
         <form className='signupContent' onSubmit={submitData} >
           <Grid className='formType' >
                <Typography variant='body1' >Register</Typography>
           </Grid>
           <Grid className='content userName' >
                <Grid className='field firstName' >
                    <TextField variant='outlined' label='First Name' name='firstName' value={formData.firstName} onChange={handleChange} required />
                </Grid>
                <Grid className='field lastName' >
                    <TextField variant='outlined' label='Last Name' name='lastName' value={formData.lastName} onChange={handleChange} required />
                </Grid>
           </Grid>
            <Grid className='content gender' >
                <Grid className='field genderContent'  >
                    <Typography variant='body1' >Gender:</Typography>
                </Grid>
                <FormControl className='field genderOptions'  >
                    <RadioGroup name='gender' value={formData.gender} onChange={handleChange} row >
                        <FormControlLabel label='Male' value='male' control={<Radio/>} />
                        <FormControlLabel label='Female' value='female' control={<Radio/>} />
                        <FormControlLabel label='Other' value='other' control={<Radio/>} />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid className='content dob' >
                    <Grid className='field dobName' >
                        <Typography variant='body1' >Data of Birth:</Typography>
                    </Grid>
                    <Grid className='field dobOptions' >
                        <NumericFormat className='dobField day' placeholder='Day' name='day' value={formData.dateOfBirth.day} onChange={handleChange} required  />
                        <NumericFormat className='dobField month' placeholder='Month' name='damonthy' value={formData.dateOfBirth.month} onChange={handleChange} required  />
                        <NumericFormat className='dobField year' placeholder='Year' name='year' value={formData.dateOfBirth.year} onChange={handleChange} required  />
                    </Grid>
            </Grid>
            <Grid className='content mobile' >
                <Grid className='field mobileNumber' >
                    <NumericFormat id='phoneNumber' placeholder='Mobile Number' name='mobileNumber' value={formData.mobileNumber} onChange={handleChange} required />
                </Grid>
                <Grid className='field numberVerify verfication' >
                    <Button variant='contained' type='button' >Verify</Button>
                </Grid>
                {verification && <Grid className='verify phoneVerification' >
                    <NumericFormat placeholder='Enter OTP' name='mobileVerification' value={verification} onChange={handleChange} />
                </Grid>}
            </Grid>
            <Grid className='content mail' >
                <Grid className='field email' >
                    <TextField variant='outlined' label='Email' name='email' value={formData.email} onChange={handleChange} required />
                </Grid>
                <Grid className='field emailVerify verfication' >
                    <Button variant='contained' type='button' >Verify</Button>
                </Grid>
                {verification && <Grid className='verify phoneVerification' >
                    <NumericFormat placeholder='Enter OTP' name='mobileVerification' value={verification} onChange={handleChange} />
                </Grid>}
                {/* --> modify phoneverification to email verification */}
            </Grid>
            <Grid className='content passwordSetup' >
                <FormControl className='field passwordField' fullWidth >
                    <OutlinedInput placeholder='Password' type={showPassword ? 'text' : 'password' } endAdornment={
                        <InputAdornment position='end'> 
                            <IconButton onClick={handleShowPassword} >
                                {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                            </IconButton>
                        </InputAdornment>
                    } required />
                </FormControl>
            </Grid>
           <Grid className='submitBtn' >
                <Button variant='contained' type='submit' >Submit</Button>
           </Grid>
        </form>
       </Card>
    </Grid>
  )
}

export default Signup
