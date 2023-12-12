import mongoose from "mongoose";

export async function connect(){
    try {
        mongoose.connect(process.env.MONGO_URI!);
        
        const connection = mongoose.connection;

        connection.once('connected', () => {
            console.log('MongoDB connected');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error: Make sure MONGODB is Running ' + err);
            process.exit();
        })
    }catch (error) {
        console.log("Something goes wrong with the DB connection");
        console.log(error);
    }
}