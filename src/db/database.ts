import mongoose  from "mongoose"; 

import dotenv from "dotenv"
import { error, log } from "node:console";


dotenv.config() 


async function connectDb() : Promise<void>{
    try { 
        if(!process.env.MONGO_URI){
            throw new Error("Mongo uri is missing")
        }

        await mongoose.connect(process.env.MONGO_URI)
        
        console.log("Sucessfully connected to database")

    }catch (error) { 
        console.log("database connection error", error)
        throw error
    }
}


export default connectDb