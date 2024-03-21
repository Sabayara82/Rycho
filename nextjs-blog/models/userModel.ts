import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    spotifyId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String
    },
    followers: {
        type: [String],
        default: []
    },
    following: {
        type: [String],
        default: []
    }
});

const connection = mongoose.createConnection(process.env.MONGO_URI!+'users');
const User = connection.models.users || connection.model("users", userSchema);

export default User;