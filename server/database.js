const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function connectDB(col) {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db('DogAndCatApiData').collection(col);
}

async function connectToDatabase({db,col}) {
    try {
        await connectDB();
        const database = client.db(db);
        const collection = database.collection(col)
        const data = (await collection.find({}).toArray());
        return data;
    } catch (error) {
        console.log('Error on connecting database',error);
    }
}

async function connectToLimtDatabase({db,col,limit}) {
    try {
        await connectDB();
        const database = client.db(db);
        const collection = database.collection(col)
        const data = (await collection.find({}).limit(limit).toArray());
        return data;
    } catch (error) {
        console.log('Error on connecting database',error);
    }
}

async function insertToDatabase({ db, col, data }) {
    try {
        await connectDB();
        const database = client.db(db);
        const collection = database.collection(col);
        const result = await collection.insertOne(data);
        return result;
    } catch (error) {
        console.log('Error to send data to database',error)
        throw error;
    }
}

module.exports = { connectDB, connectToDatabase, insertToDatabase, client, connectToLimtDatabase }