import mongoose from 'mongoose';

export async function connect(database: 'feed'|'notifications'|'users'|'rycho') {
    try {
        mongoose.connect(`${process.env.MONGO_URI}${database}`);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connected error. ' + err);
            process.exit();
        })
        return connection;

    } catch (error) {
        console.log('Something went wrong!');
        console.log(error);
    }
    
}