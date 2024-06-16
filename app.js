const express = require('express')
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys')
const PORT = 8000


let corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));

mongoose.connect(MONGOURI)

mongoose.connection.on('connected',async()=>{
    console.log('connected')
})

mongoose.connection.on('error',(error)=>{
    console.log('error',error)
})

require('./models/expense')

app.use(express.json())
app.use(require('./routes/expense'))

app.listen(PORT,()=>{
    console.log('server is running',PORT)
})