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

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;