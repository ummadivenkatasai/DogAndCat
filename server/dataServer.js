const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

function createServer(){
    const app = express();
    app.use(cors());

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function connectToDatabase({db,col}) {
    try {
        await client.connect();
        const database = client.db(`${db}`);
        const collection = database.collection(`${col}`)
        const data = (await collection.find({}).limit(4).toArray());
        return data;
    } catch (error) {
        console.log('Error on connecting database',error);
    }
}

app.get('/',async(req,res)=>{
    try {
        const [dogRes,catRes]=await Promise.all([
            connectToDatabase({db:'DogAndCatApiData',col:'DogData'}),
            connectToDatabase({db:'DogAndCatApiData',col:'CatData'})
        ])
        res.status(200).json({dog:dogRes,cat:catRes})
    } catch (error) {
        console.log("main page error",error);
        res.status(500).send('Error fetching data');
    }
})

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