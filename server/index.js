const createServer = require('./server');

const app = createServer();
const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})