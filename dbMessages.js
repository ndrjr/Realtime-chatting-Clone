import mongoose, { mongo } from "mongoose";

const chatSchema=mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
});

export default mongoose.model('messagecontents',chatSchema);