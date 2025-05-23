import dotenv from 'dotenv';
import { connectToMongo } from './db.js';
import express from 'express'

dotenv.config()
connectToMongo();

const app = express()
const PORT = 8000

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.listen(PORT,()=>{
    console.log("App running on port 8000")
})

