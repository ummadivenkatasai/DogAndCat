const { MongoClient } = require('mongodb');
const path = require('path');

let dogInterval, catInterval;

const url = process.env.MONGO_URL || 'mongodb+srv://venkatsaiking32:4ySMFz9LhCJKAhrW@cluster0.cabpz8c.mongodb.net/Petpals?retryWrites=true&w=majority&appName=Cluster0';
const database = 'DogAndCatApiData';

async function createCollection(collectionName) {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db(database);
        await db.createCollection(collectionName);
    } catch (error) {
        console.log('create collection error',error)
    } finally{
        await client.close();
    }
}

async function connectToDatabase({databaseCollection}){
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db(database);
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
        const existingData = await collection.find({}).toArray();
        const allMessages = existingData.map((data)=>data.message)
        

        if(existingData.length<250){
            if(!allMessages.includes(apiResponseData.message)){
                const extract = path.parse(apiResponseData.message);
                const breedName = extract.dir.slice(30);
                apiResponseData.breed=breedName;
                apiResponseData.stock=10;
                apiResponseData.price=1499;
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

        const exisitingData = await collection.find({}).toArray();
        const allMessages = exisitingData.map((data)=>data.url);
        if(exisitingData.length<250){
            if(dataExtension === '.jpg' || dataExtension === '.png'){
                if(!allMessages.includes(data.url)){
                    const response = await fetch(`https://api.thecatapi.com/v1/images/${data.id}`);
                    const responseData = await response.json();
                    if(responseData.breeds){
                        responseData.stock=10;
                        responseData.price=1299;
                        await collection.insertOne(responseData);
                    }else{
                        console.log(`data doesn't contain breeds`)
                    }
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
        console.log('cat data error : ',error)
    } finally{
        await client.close()
    }
}

dogInterval = setInterval(()=>{
    sendDogDataToDatabase()
},1000)

catInterval = setInterval(()=>{
    sendCatDataToDatabase()
},1000)


