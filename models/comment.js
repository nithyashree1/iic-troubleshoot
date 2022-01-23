const mongoose = require('mongoose');
const Schema=mongoose.Schema

const commentSchema=new Schema({
    uname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true
    },
    semester:{
        type:String,
        required:true
    },
    USN:{
        type:String,
        required:true
    },
    stu_file:{
        type:String,
        required:true
    }
  
 
},{timestamps:true})

const Comment=mongoose.model('Comment',commentSchema);
module.exports=Comment;
