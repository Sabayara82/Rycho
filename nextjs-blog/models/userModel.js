import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provie a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provie an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provie a password"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
})

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;