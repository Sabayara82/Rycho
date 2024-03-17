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
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;