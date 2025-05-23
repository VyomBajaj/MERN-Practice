import dotenv from 'dotenv';
import { connectToMongo } from './db.js';
import express from 'express'
import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js'

dotenv.config()
connectToMongo();

const app = express()
const PORT = 8000

app.use('/api/auth',authRouter)
app.use('/api/notes',notesRouter)

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.listen(PORT,()=>{
    console.log("App running on port 8000")
})

