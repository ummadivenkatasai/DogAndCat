const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const url = require('url')
require('dotenv').config();
const { connectDB, connectToDatabase, client, insertToDatabase } = require('./database');

function createServer(){
    const app = express();
    app.use(cors());
    app.use(express.json())

app.get('/',async(req,res)=>{
    try {
        const [dogRes,catRes]=await Promise.all([
            connectToDatabase({db:'DogAndCatApiData',col:'DogData',limit:4}),
            connectToDatabase({db:'DogAndCatApiData',col:'CatData',limit:4})
        ])
        res.status(200).json({dog:dogRes,cat:catRes})
    } catch (error) {
        console.log("main page error",error);
        res.status(500).send('Error fetching data');
    }
})

app.get('/api/dogs',async (req,res)=>{
    try {
        const data = await connectToDatabase({ db:'DogAndCatApiData', col:'DogData', limit:0 });
        res.json(data)
    } catch (error) {
        console.log('dog data error : ',error)
        res.status(500).send('Error fetching data')
    }
})

app.get('/api/cats',async (req,res)=>{
    try {
        const data = await connectToDatabase({ db:'DogAndCatApiData', col:'CatData', limit:0 });
        res.json(data)
    } catch (error) {
        console.log('cat data error : ',error)
        res.status(500).send('Error fetching data');
    }
})

app.post('/api/signup',async (req,res)=>{
    try {
        const result = await insertToDatabase({ db:'DogAndCatApiData', col:'Users', data:req.body })
        res.status(200).json({message:'user saved',id:result.insertedId})

    } catch (error) {
        res.status(500).json({error:'Serval Error'})
    }
})

app.post('/api/auth/signin', async (req,res)=>{
    const { email, password } = req.body;
    try {
        const users = await connectToDatabase({ db:'DogAndCatApiData', col:'Users', limit:0 });
        const user = users.find((value)=>value.email === email)
        if(!user) return res.status(400).json({ message: 'User not found' });
        if(user.password !== password){
            return res.status(400).json({ message:'Invalid credentials' })
        }
        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET,{ expiresIn:'1h' } )
        res.status(200).json({token})
    } catch (error) {
        res.status(500).send(error);
    }
})

return app;

}

module.exports = createServer;