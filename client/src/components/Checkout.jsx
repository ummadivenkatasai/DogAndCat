import React, { useState } from 'react'
import '../componentsCss/checkout.css'
import { Button, Card, Grid, TextField, Typography } from '@mui/material'
import { NumericFormat } from 'react-number-format';
import axios from 'axios'

function Checkout() {
    const [isAddAdrdress,setIsAddAddress] = useState(false);

    const token = localStorage.getItem('token');


    function handleAddress(){
        setIsAddAddress(!isAddAdrdress)
    }

  return (
    <Grid className='checkoutContainer' >
      <Grid className='leftSideContent' >
        <Grid className='addressContainer' >
            <AddAddress changeFun={handleAddress} />
        </Grid>
         {isAddAdrdress ? 
            <Card className='newAddressContent' >
                <NewAddressForm userToken={token} />
            </Card> 
            : null }
      </Grid>
      <Grid className='rightSideContent' >

      </Grid>
    </Grid>
  )
}

function AddAddress({changeFun}){

    const [addressContnet,setAddressContent] = useState([]);
    



    


    return(
        <>
            <Grid className='addressContent' >
                <Typography variant='body1' style={{fontWeight:'bold'}} >DELIVERY ADDRESS</Typography>
            </Grid>
            <Grid className='addressBtn' >
                <Button type='button' variant='outlined' onClick={changeFun} >+ Add new address</Button>
            </Grid>
        </>
    )
}

 function NewAddressForm({userToken}){
    const [addressData,setAddressData]=useState({personName:'',mobilenumber:'',pincode:'',locality:'',address:'',city:'',state:'',landmark:'',alternate:''});

    async function handleAddressData({target}){
        const { name, value } = target
        setAddressData((prev)=> ({
            ...prev,
            [name]:value
        }))
        if(name === 'pincode' && value.length === 6){
            const response = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
            if(response.data[0].Status != 'Error'){
                const town = response.data.map(({PostOffice})=>{
                    const cityAndState = {city:PostOffice[0].Block, State:PostOffice[0].Circle}
                    return cityAndState  || null;
                })
                setAddressData((prev)=>({
                    ...prev,
                    city:town[0].city,
                    state:town[0].State
                }))
            }
        }
    }

    async function submit(e){
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/address',addressData,{headers:{Authorization:`Bearer ${userToken}`}})
            if(response.status === 200) setAddressData({personName:'',mobilenumber:'',pincode:'',locality:'',address:'',city:'',state:'',landmark:'',alternate:''})
        } catch (error) {
            console.log('submit form data error',error)
        }
        
    }

    return(
        <form onSubmit={submit} >
            <Grid className='inputData nameContent' >
                <TextField variant='outlined' label='Name' name='personName' onChange={handleAddressData} value={addressData.personName} required />
                <NumericFormat placeholder='Mobile Number' name='mobilenumber' onChange={handleAddressData} value={addressData.mobilenumber} isAllowed={(values)=> {const { floatValue } = values; return floatValue === undefined || floatValue<=9999999999 } } required />
            </Grid>
            <Grid className='inputData pincode' >
                <NumericFormat placeholder='Pincode' name='pincode' onChange={handleAddressData} value={addressData.pincode} isAllowed={(values)=> { const { floatValue } = values; return floatValue === undefined || floatValue<=999999 } } required />
                <TextField variant='outlined' label='Locality' name='locality' onChange={handleAddressData} value={addressData.locality} />
            </Grid>
            <Grid className='inputData inputAddress' >
                <TextField variant='outlined' id="filled-multiline-static" label='Address' required className='addressBox' multiline rows={5} name='address' value={addressData.address} onChange={handleAddressData} />
            </Grid>
            <Grid className='inputData city&State' >
                <TextField variant='outlined' label='city' name='city' onChange={handleAddressData} value={addressData.city} required />
                <TextField variant='outlined' label='State' name='state' onChange={handleAddressData} value={addressData.state} required />
            </Grid>
            <Grid className='inputData landmark' >
                <TextField variant='outlined' label='Landmark' name='landmark' onChange={handleAddressData} value={addressData.landmark} />
                <TextField variant='outlined' label='Alternate Phone Number' name='alternatePhoneNumber' onChange={handleAddressData} value={addressData.alternate} />
            </Grid>
            <Grid className='saveBtn' >
                <Button type='submit' variant='contained' >Save</Button>
            </Grid>
        </form>
    )
}

export default Checkout
