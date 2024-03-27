import mongoose, { mongo } from 'mongoose';

export async function connect(database: 'feed'|'notifications'|'users') {
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
        console.log(error);
    }
    
}



// const DATABASE_URL = process.env.MONGO_URI;

// if (!DATABASE_URL) {
//   throw new Error("Please define the MONGO_URI environment variable inside .env.local");
// }

// // Assuming this part is correctly placed in a TypeScript definition file or similar context
// declare global {
//     var mongoose: {conn: any, promise: any}
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export async function connect(database: 'feed' | 'notifications' | 'users') {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(DATABASE_URL + database, opts).then((mongoose) => {
//       console.log('MongoDB connected successfully');
//       return mongoose;
//     });
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// };
