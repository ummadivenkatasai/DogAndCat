const { MongoClient } = require('mongodb');
const path = require('path');

let dogInterval, catInterval;

async function connectToDatabase({databaseCollection}){
    const url = 'mongodb://localhost:27017/';
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db('DogAndCatApiData');
        const col = db.collection(databaseCollection);
        return { collection:col,client } 
    } catch (error) {
        throw  error
    }
}

async function sendDogDataToDatabase() {
    const { collection, client } = await connectToDatabase({databaseCollection: 'DogData'});
    try {
        const apiResponse = await fetch('https://dog.ceo/api/breeds/image/random');
        const apiResponseData = await apiResponse.json();
        // await collection.insertOne(apiResponseData)
        const existingData = await collection.find({}).toArray();
        const allMessages = existingData.map((data)=>data.message)
        
        if(existingData.length<250){
            if(!allMessages.includes(apiResponseData.message)){
                await collection.insertOne(apiResponseData)
                
            }else{
                console.log('dog data already exists')
            }
        }else{
            clearInterval(dogInterval);
            console.log('dog limit over')
        } 
    } catch (error) {
        throw error
    } finally{
        await client.close()
    }
}

async function sendCatDataToDatabase(){
    const { collection, client } = await connectToDatabase({ databaseCollection:'CatData' });
    try {
        const apiResponse = await fetch('https://api.thecatapi.com/v1/images/search');
        const apiResponseData = await apiResponse.json();
        const [data] = apiResponseData.map((output)=>output);
        const dataExtension = path.extname(data.url);
        
        // if(dataExtension == '.jpg'){
        //     await collection.insertOne(data)
        // }else{
        //     console.log('noobject')
        // }

        const exisitingData = await collection.find({}).toArray();
        const allMessages = exisitingData.map((data)=>data.url);
        if(exisitingData.length<250){
            if(dataExtension == '.jpg'){
                if(!allMessages.includes(data.url)){
                    await collection.insertOne(data);
                    console.log('cat data inserted')
                }else{
                    console.log('cat data already exists')
                }
            }else{
                console.log('product is not jpg format')
            }
        }else{
            clearInterval(catInterval);
            console.log('cat limit over');
        }
    } catch (error) {
        throw error
    } finally{
        await client.close()
    }
}


dogInterval = setInterval(()=>{
    sendDogDataToDatabase()
},5000)

catInterval = setInterval(()=>{
    sendCatDataToDatabase()
},5000)