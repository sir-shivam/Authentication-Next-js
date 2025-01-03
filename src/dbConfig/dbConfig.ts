import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        //once connect it will return a connect id
        const connection = mongoose.connection;
        
        connection.on('connected' , ()=> {
            console.log("Mongo db connected successfully")
        })

        connection.on('error', ()=> {
            console.log("MongoDb connection error, please make sure Mongodb is running");
            process.exit();
        })


    } catch (error) {
        console.log("something went wrong ");
        console.log(error);
    }
}