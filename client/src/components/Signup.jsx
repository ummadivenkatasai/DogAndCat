import { Button, Card, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, OutlinedInput, Radio, RadioGroup, Snackbar, TextField, Typography } from '@mui/material';
import { NumericFormat } from 'react-number-format'
import React, { useState } from 'react'
import '../componentsCss/signup.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Signup() {

    const [formData,setFormData] = useState({firstName:'',lastName:'',gender:'',dateOfBirth:'',mobileNumber:'',email:'',password:''});

    const [verificationOtp,setVerificationOtp] = useState({mobileOtp:'',emailOtp:''});
    const [inputOtp,setInputOtp] = useState({mobileOtpVerify:'',emailOtpVerify:''});
    const [verifyField,setVerifyField] = useState({mobileVerify:false,emailVerify:false})
    const [showPassword,setShowPassword] = useState(false);

    const [snackBarOpen,setSnackBarOpen] = useState(false);

    function handleChange({target}){
        let {name,value} = target
        const trimmedValue = value.trim();
        setFormData((previousValue)=>({
            ...previousValue,
            [name]:trimmedValue
        }))
    }

    function handleOtpChange({target}){
        const {name,value} = target
        setInputOtp((previousValue)=>({
            ...previousValue,
            [name]:value
        }))
    }

    function generateOtp(name){
        const otp = Math.floor(100000+Math.random()*900000);
        if( name === 'mobile' && formData.mobileNumber.length == 10 ){
            setVerificationOtp((previousValue)=>({
                ...previousValue,
                mobileOtp:otp
            }));
            setSnackBarOpen(true)
        }else if( name === 'email' && formData.email.toLocaleLowerCase().endsWith('@gmail.com') ){
            setVerificationOtp((previousValue)=>({
                ...previousValue,
                emailOtp:otp
            }));
            setSnackBarOpen(true);
        }
    }

    function otpValidation(target){
        if( target === 'mobile' && verificationOtp.mobileOtp == inputOtp.mobileOtpVerify ){
            setVerifyField((previousValue)=>({
                ...previousValue,
                mobileVerify:true
            }));
            setVerificationOtp((previousValue)=>({
                ...previousValue,
                mobileOtp:''
            }))
        }else if( target === 'email' && verificationOtp.emailOtp == inputOtp.emailOtpVerify ){
            setVerifyField((previousValue)=>({
                ...previousValue,
                emailVerify:true
            }));
            setVerificationOtp((previousValue)=>({
                ...previousValue,
                emailOtp:''
            }))
        }else{
            console.log('wrong otp')
        }
    }

    function handlePassword(){
        setShowPassword(!showPassword);
    }

    function submitData(event){
        event.preventDefault()
        if( verifyField.mobileVerify && verifyField.emailVerify ){
            console.log(formData);
        }
    }

  return (
    <Grid className='signupForm' container >
        <Card className='card' >
         <form className='signupContent' onSubmit={submitData} method='post' >
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
                        <input type="date" className='dobField' name='dateOfBirth' value={formData.dateOfBirth} onChange={handleChange} />
                    </Grid>
            </Grid>
            <Grid className='content mobile' >
                <Grid className='field mobileNumber' >
                    <NumericFormat id='phoneNumber' placeholder='Mobile Number' name='mobileNumber' value={formData.mobileNumber} onChange={handleChange} required />
                </Grid>
                <Grid className='field numberVerify verfication' >
                    <Button variant='contained' type='button' disabled={ verificationOtp.mobileOtp !== '' || verifyField.mobileVerify == true } onClick={ ()=> generateOtp('mobile') } >Verify</Button>
                </Grid>
            </Grid>
             {verificationOtp.mobileOtp && <Grid className='content otpVerify mobileOtpVerify' >
                <Grid className='field verify phoneVerification' >
                    <NumericFormat placeholder='Enter OTP' name='mobileOtpVerify'  onChange={handleOtpChange} />
                </Grid>
                <Grid className='field verificationBtn' >
                    <Button variant='contained' type='button' name='mobileOtpVerify' onClick={()=>otpValidation('mobile')}   >Submit</Button>
                </Grid>
            </Grid>}
            {verificationOtp.mobileOtp && <Snackbar className='snackbar' open={snackBarOpen}  autoHideDuration={15000} message={verificationOtp.mobileOtp} />}
            <Grid className='content mail' >
                <Grid className='field email' >
                    <TextField variant='outlined' label='Email' name='email' value={formData.email} onChange={handleChange} required />
                </Grid>
                <Grid className='field emailVerify verfication' >
                    <Button variant='contained' type='button' disabled={ verificationOtp.mobileOtp !== '' || verifyField.emailVerify == true } onClick={ ()=> generateOtp('email') }  >Verify</Button>
                </Grid>
            </Grid>
            {verificationOtp.emailOtp && <Grid className='content otpVerify emailOtpVerify' >
                <Grid className='field verify emailVerification' >
                    <NumericFormat placeholder='Enter OTP' name='emailOtpVerify'  onChange={handleOtpChange} />
                </Grid>
                <Grid className='field verificationBtn' >
                    <Button variant='contained' type='button' name='emailOtpVerify' onClick={()=>otpValidation('email')}   >Submit</Button>
                </Grid>
            </Grid>}
            {verificationOtp.emailOtp && <Snackbar className='snackbar' open={snackBarOpen}  autoHideDuration={15000} message={verificationOtp.emailOtp} />}
            <Grid className='content passwordSetup' >
                <FormControl className='field passwordField' fullWidth >
                    <OutlinedInput placeholder='Password' name='password' type={showPassword ? 'text' : 'password' } value={formData.password} onChange={handleChange} endAdornment={
                        <InputAdornment position='end'> 
                            <IconButton onClick={handlePassword} >
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
