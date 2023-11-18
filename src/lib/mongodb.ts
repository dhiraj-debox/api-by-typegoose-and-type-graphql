import mongoose from "mongoose";
import config from 'config'

export async function connecToDB(){
    try {

        await mongoose.connect(config.get('dbUri'))
        console.log("connection established")
        
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}