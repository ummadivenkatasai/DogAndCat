const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { connectDB, connectToDatabase, client, insertToDatabase, connectToLimtDatabase } = require('./database');
const { ObjectId } = require('mongodb');
const userAuthentication = require('./userAuthentication');
const { User, Pets } = require('./user')

function createServer() {
    const app = express();
    app.use(cors());
    app.use(express.json())

    app.get('/', async (req, res) => {
        try {
            const [dogRes, catRes] = await Promise.all([
                connectToLimtDatabase({ db: 'DogAndCatApiData', col: 'DogData', limit: 4 }),
                connectToLimtDatabase({ db: 'DogAndCatApiData', col: 'CatData', limit: 4 })
            ])
            res.status(200).json({ dog: dogRes, cat: catRes })
        } catch (error) {
            console.log("main page error", error);
            res.status(500).send('Error fetching data');
        }
    })

    app.get('/api/dogs', async (req, res) => {
        try {
            const data = await connectToDatabase({ db: 'DogAndCatApiData', col: 'DogData', });
            res.json(data)
        } catch (error) {
            console.log('dog data error : ', error)
            res.status(500).send('Error fetching data')
        }
    })

    app.get('/api/dogs/:_id', async (req, res) => {
        const { _id } = req.params;
        const collection = await connectDB('DogData');
        const dogData = await collection.findOne({ _id: new ObjectId(_id) });
        return res.status(200).json({ dogData });
    })

    app.get('/api/cats', async (req, res) => {
        try {
            const data = await connectToDatabase({ db: 'DogAndCatApiData', col: 'CatData', });
            res.json(data)
        } catch (error) {
            console.log('cat data error : ', error)
            res.status(500).send('Error fetching data');
        }
    })

    app.get('/api/cats/:_id', async (req, res) => {
        const { _id } = req.params;
        const collection = await connectDB('CatData');
        const catData = await collection.findOne({ _id: new ObjectId(_id) });
        return res.status(200).json({ catData });
    })

    app.get('/api/wishlist', userAuthentication, async (req, res) => {
        const userInfo = req.user.userId;
        try {
            const collection = await connectDB('wishlists');
            const userWishlist = await collection.findOne({ userId: new ObjectId(userInfo) });
            const items = userWishlist.items;
            res.status(200).json({ message: items });
        } catch (error) {
            console.log('fecthing wishlist data error', error)
        }
    })

    app.get('/api/wishlist/:id', userAuthentication, async (req, res) => {
        const userInfo = req.user.userId;
        try {
            const collection = await connectDB('wishlists');
            const userWishlist = await collection.findOne({ userId: new ObjectId(userInfo) });
            if (!userWishlist) res.json({ message: 'user not found' });
            res.status(200).json({ items: userWishlist.items })
        } catch (error) {
            console.log('error on getting wishlist data', error);
            res.status(500).json({ message: 'internal server error' });
        }
    })

    app.get('/api/address', userAuthentication, async (req, res) => {
        const userInfo = req.user.userId;
        try {
            const collection = await connectDB('Address');
            const { address } = await collection.findOne({ userId: new ObjectId(userInfo) });
            res.status(200).json({ message: address })
        } catch (error) {
            console.log('sending address content error', error);
        }
    })

    app.get('/api/cart', userAuthentication, async (req, res) => {
        const userInfo = req.user.userId;
        try {
            const collection = await connectDB('userCart');
            const userCart = await collection.findOne({ userId: new ObjectId(userInfo) });
            const cartData = userCart.cart;
            if (!userCart) return res.json({ message: 'user not found' });
            res.status(200).json({ cartData })
        } catch (error) {
            console.log('cart fetching data error', error)
        }
    })

    app.get('/api/orders', userAuthentication, async (req, res) => {
        const userInfo = req.user.userId;
        try {
            const collection = await connectDB('orders')
            const { orders } = await collection.findOne({ userId: new ObjectId(userInfo) });
            return res.json({ message: orders })
        } catch (error) {
            console.log('fetching order error', error)
        }
    })

    app.post('/api/wishlist/cat', userAuthentication, async (req, res) => {
        const { catData } = req.body;
        const userInfo = req.user.userId;
        try {
            const collection = await connectDB('wishlists');
            const userWishlist = await collection.findOne({ userId: new ObjectId(userInfo) });
            if (!userWishlist) return res.json({ message: 'user not found' });
            const items = userWishlist.items || [];
            const alreadyExists = items.some((data) => data._id === catData._id)
            if (!alreadyExists) {
                await collection.updateOne({ userId: new ObjectId(userInfo) }, { $addToSet: { items: catData } })
                return res.status(200).json({ message: 'selected', selected: true })
            } else {
                await collection.updateOne({ userId: new ObjectId(userInfo) }, { $pull: { items: { _id: catData._id } } }) //
                return res.status(200).json({ message: 'unselected', selected: false });
            }
        } catch (error) {
            console.log(error)
        }
        res.status(500).json({ message: 'internal server error' });
    })

    app.post('/api/wishlist/dog', userAuthentication, async (req, res) => {
        const { dogData } = req.body;
        const userInfo = req.user.userId;
        try {
            const collection = await connectDB('wishlists');
            const userWishlist = await collection.findOne({ userId: new ObjectId(userInfo) });
            if (!userWishlist) return res.json({ message: 'user not found' });
            const items = userWishlist.items || [];
            const alreadyExists = items.some((data) => data._id === dogData._id)
            if (!alreadyExists) {
                await collection.updateOne({ userId: new ObjectId(userInfo) }, { $addToSet: { items: dogData } });
                return res.status(200).json({ message: 'selected', selected: true })
            } else {
                await collection.updateOne({ userId: new ObjectId(userInfo) }, { $pull: { items: { _id: dogData._id } } });
                return res.status(200).json({ message: 'unselected', selected: false })
            }
        } catch (error) {
            console.log('post dog wishlist error', error)
        }
    })

    app.post('/api/cart', userAuthentication, async (req, res) => {
        let cartData = req.body;
        const userInfo = req.user.userId;
        try {
            // console.log(cartData)
            const collection = await connectDB('userCart');
            const wishlistCollection = await connectDB('wishlists')
            const userCart = await collection.findOne({ userId: new ObjectId(userInfo) });
            if (!userCart) res.json({ message: 'user not found' });
            const alreadyExists = userCart.cart.findIndex((data) => data._id === cartData._id);

            if (alreadyExists === -1) {
                await collection.updateOne({ userId: new ObjectId(userInfo) }, { $addToSet: { cart: cartData } })
                return res.status(200).json({ message: 'product added to cart' })
            } else {
                let currentQty = userCart.cart[alreadyExists].qty || 0;
                let differnce = currentQty - cartData.qty;
                if (cartData.updateType === 'increment') {
                    let result = currentQty - differnce;
                    const key = `cart.${alreadyExists}.qty`;
                    await collection.updateOne({ userId: new ObjectId(userInfo) }, { $set: { [key]: result } })
                } else if (cartData.updateType === 'decrement') {
                    let result = currentQty - differnce
                    const key = `cart.${alreadyExists}.qty`;
                    await collection.updateOne({ userId: new ObjectId(userInfo) }, { $set: { [key]: result } })
                }else if (cartData.updateType === 'delete' ){
                    await collection.updateOne({ userId: new ObjectId(userInfo) },{ $pull:{ cart:{ _id:cartData._id } } })
                }else if( cartData.updateType === 'wishlist' ){
                    const { qty, updateType, ...rest }= cartData;
                    cartData = rest;
                    await wishlistCollection.updateOne({userId: new ObjectId(userInfo)},{$addToSet:{items:cartData }},{upsert:true})
                    await collection.updateOne({userId:new ObjectId(userInfo)},{$pull:{cart:{_id:cartData._id}}})
                }

                return res.status(200).json({ message: 'cart updated' })
            }
        } catch (error) {
            console.log('cat posting data error:', error)
        }
    })

    app.post('/api/cart/clear', userAuthentication, async (req, res) => {
        const receivedCartData = req.body;
        const userInfo = req.user.userId;
        try {
            const collection = await connectDB('userCart');
            const userCart = await collection.findOne({ userId: new ObjectId(userInfo) });
            if (!userCart) res.json({ message: 'user not found' });
            await collection.updateOne({ userId: new ObjectId(userInfo) }, { $set: { cart: receivedCartData } })
        } catch (error) {
            console.log('clear cart error', error)
        }
    })

    app.post('/api/orders', userAuthentication, async (req, res) => {
        const cartData  = req.body;
        const userInfo = req.user.userId;
        try {
            
            const collection = await connectDB('orders');
            const dogCollection = await connectDB('DogData');
            const catCollection = await connectDB('CatData');
            const user = await collection.findOne({ userId: new ObjectId(userInfo) });
            
            if (!user) res.json({ message: 'user not found' });
            await collection.updateOne({ userId: new ObjectId(userInfo) }, { $addToSet: { orders: cartData } }, { upsert: true })

            for( const item of cartData ){
                const isCat = 'url' in item;
                const db = isCat ? catCollection : dogCollection;
                await db.updateOne({ _id: new ObjectId(item._id)},{ $inc:{ stock: -item.qty } }) 
            }

        } catch (error) {
            console.log('posting order error', error)
        }
    })

    app.post('/api/address', userAuthentication, async (req, res) => {
        const data = req.body;
        const userInfo = req.user.userId;
        try {
            const collection = await connectDB('Address');
            const { address } = await collection.findOne({ userId: new ObjectId(userInfo) })
            await collection.updateOne({ userId: new ObjectId(userInfo) }, { $addToSet: { address: data } })
            res.status(200).json({ message: 'address received' })
        } catch (error) {
            console.log('geeting address data from frontend error', error)
        }

    })

    app.post('/api/products',userAuthentication,async(req,res)=>{
        const fliterData = req.body;
        const userInfo = req.user.userId;

        try {
            if(fliterData.category === 'dog'){
                const breedName = fliterData.data;
                const collection = await connectToDatabase({ db:'DogAndCatApiData', col:'DogData' })
                const breedcollection = collection.filter((currentvalue) => breedName.includes(currentvalue.breed) )
               res.status(200).json({message:breedcollection})
            }else if(fliterData.category === 'cat'){
                // const { breedNameSelected, temperamentSelected, countrySelected, lifeSpanSelected, energySelected } = fliterData.data;
                const { breedNameSelected=[], temperamentSelected=[], countrySelected=[], lifeSpanSelected=[], energySelected } = fliterData.data
                const collection = await connectToDatabase({ db:'DogAndCatApiData', col:'CatData' });
                
                let fliterContent = collection;

                if(breedNameSelected.length>0){
                    
                    fliterContent = fliterContent.filter((value) => {
                        const breed = value.breeds[0]
                        return breed && breedNameSelected.includes(breed.name)
                    } )
                }

                if(temperamentSelected.length>0){
                    fliterContent = fliterContent.filter((value)=>{
                        const breed = value.breeds[0]
                        if(!breed || !breed.temperament) return false
                        const temperamentData = breed.temperament.split(', ')
                        return temperamentData.some((data)=> temperamentSelected.includes(data) )
                    })
                }

                if(countrySelected.length !=0 ){
                    fliterContent = fliterContent.filter((value)=> {
                        const breed = value.breeds[0]
                        return breed && countrySelected.includes(breed.origin)
                    } )
                }

                if(lifeSpanSelected.length>0){
                    fliterContent = fliterContent.filter((value)=>{
                        const breed = value.breeds[0]
                        if(!breed || !breed.life_span) return false
                        const lifeSpanData = breed.life_span.split(' - ');
                        return lifeSpanData.some((data)=> countrySelected.includes(data) )
                    })
                }

                if(energySelected.length !=0 ){
                    fliterContent = fliterContent.filter((value)=>{
                        const breed = value.breeds[0];
                        return breed && breed.energy_level === energySelected
                    })
                }
                
                return res.status(200).json({message: fliterContent })

            }else{
                return res.status(400).json({message:'invalid category'})
            }
        } catch (error) {
            console.log('fliter error',error);
        }
    })

    app.post('/api/mobileNumber', async (req, res) => {
        const { mobileNumber } = req.body;
        if (mobileNumber.length == 10) {
            const usersData = await connectToDatabase({ db: 'DogAndCatApiData', col: 'Users', })
            const userMobileNumber = usersData.map((data) => { return data.mobileNumber });
            if (!userMobileNumber.includes(mobileNumber)) {
                return res.status(200).json({ message: 'new user' });
            } else {
                return res.status(200).json({ message: 'existing user' });
            }
        } else {
            return res.status(201).json({ message: 'Invalid moblie number' })
        }
    })

    app.post('/api/email', async (req, res) => {
        const { email } = req.body;
        if (email.toLocaleLowerCase().endsWith('@gmail.com')) {
            const userData = await connectToDatabase({ db: 'DogAndCatApiData', col: 'Users', });
            const userEmail = userData.map((data) => { return data.email });
            if (!userEmail.includes(email)) {
                return res.status(200).json({ message: 'new user' })
            } else {
                return res.status(200).json({ message: 'existing user' });
            }
        } else {
            return res.status(201).json({ message: 'Invalid mail' })
        }
    })

    app.post('/api/auth/signin', async (req, res) => {
        const { email, password } = req.body;
        try {
            const users = await connectToDatabase({ db: 'DogAndCatApiData', col: 'Users', });
            const user = users.find((value) => value.email === email);
            if (!user) return res.status(400).json({ message: 'User not found' });

            if (user.password !== password) {
                return res.status(400).json({ message: 'Invalid credentials' })
            }
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' })
            res.status(200).json({ token })
            
        } catch (error) {
            res.status(500).send(error);
        }
    })

    app.post('/api/signup', async (req, res) => {
        const userData = {...req.body}
        try {
            const result = await insertToDatabase({ db: 'DogAndCatApiData', col: 'Users', data: userData })
            const userId = result.insertedId;
            await insertToDatabase({ db: 'DogAndCatApiData', col: 'wishlists', data: { userId, items: [] } })
            await insertToDatabase({ db: 'DogAndCatApiData', col: 'orders', data: { userId, orders: [] } })
            await insertToDatabase({ db: 'DogAndCatApiData', col: 'userCart', data: { userId, cart: [] } })
            await insertToDatabase({ db: 'DogAndCatApiData', col: 'Address', data: { userId, address: [] } })
            res.status(200).json({ message: 'User registered successfully', id: userId })

        } catch (error) {
            res.status(500).json({ error: 'Server Error' })
        }
    })

    return app;

}

module.exports = createServer;









// line num 193
// else{
//     const newQty = currentQty+cartData.qty;
//     if(newQty>5) return res.status(400).json({message:'product limit exceeds'});
//     const key = `cart.${alreadyExists}.qty`;
//     await collection.updateOne({ userId: new ObjectId(userInfo) },{$inc:{[key]:cartData.qty}})
// }