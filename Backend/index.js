// Load environment variables from .env file
require('dotenv').config();

const connectToMongo = require('./db')
connectToMongo();

const express = require('express')
const app = express()
const port = 3001

const cors = require('cors')
const router = require('./Routes/router')
const authRoutes = require('./Routes/auth')

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


