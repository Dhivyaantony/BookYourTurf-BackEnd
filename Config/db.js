const mongoose =require('mongoose')
//const express = require('express');

const connectDb=async ()=>{
    try{
        const connection=await mongoose.connect('mongodb+srv://dhivyaantony778:fcIQSaa2dbfaARhO@cluster0.qwptlxc.mongodb.net/',{
            useNewUrlParser:"true"
            //useUnifiedTopology: "true"
        })
        console.log("Mongodb database connected");
       
    }
catch(err){
    console.log(err);
}
}
module.exports=connectDb