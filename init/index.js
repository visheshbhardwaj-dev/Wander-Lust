const mongoose = require("mongoose");
const listing = require("../models/listing");
const initData = require("./data.js");


main().then(()=>{
    console.log("connection established");

}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const init = async()=>{
    await listing.deleteMany({});
   initData.data= initData.data.map((obj)=>({...obj,owner:"698384ab914238ad7c493fd4"}));
    await listing.insertMany(initData.data);
    console.log("data has been initted");
}

init();