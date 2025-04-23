const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

function createServer(){
    const app = express();
    app.use(cors());

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

app.get('/api/dogs',async (req,res)=>{
    try {
        await client.connect();
        const database = client.db('DogAndCatApiData');
        const collection = database.collection('DogData');
        const data = await collection.find({}).toArray();
        res.json(data)
    } catch (error) {
        console.log('dog data error : ',error)
        res.status(500).send('Error fetching data')
    }
})

app.get('/api/cats',async (req,res)=>{
    try {
        await client.connect();
        const database = client.db('DogAndCatApiData');
        const collection = database.collection('CatData');
        const data = await collection.find({}).toArray();
        res.json(data)
    } catch (error) {
        console.log('cat data error : ',error)
        res.status(500).send('Error fetching data');
    }
})

return app;

}

module.exports = createServer;