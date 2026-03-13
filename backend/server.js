
import dotenv from 'dotenv';
dotenv.config({path:'backend/config/config.env'});
import app from './app.js';
import { connectMongoDatabase } from './config/db.js';
import {v2 as cloudinary} from 'cloudinary';
import Razorpay from 'razorpay'; 

// Handling uncaught exceptions errors
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);     
    process.exit(1);
})  

connectMongoDatabase();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})


export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
})

const port = process.env.PORT || 8000;

const server = app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})


process.on("unhandledRejection", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);     
    server.close(()=>{
        process.exit(1);
    })
})  