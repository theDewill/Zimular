import mongoose from 'mongoose';

export default async function connect () {

    try {
        await mongoose.connect(process.env.MONGO_URL)
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("Database connected");
        })
        
        connection.on('error', (err) => {
            console.log("Error connecting to database", err);
            process.exit();
        })
    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
    }
}
