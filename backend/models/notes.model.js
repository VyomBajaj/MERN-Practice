import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tags:{
        type:String,
        default:"General"
    },
    date:{
        type:Date,
        default:Date.now
    }
});

export const Notes = mongoose.model('Notes',notesSchema);