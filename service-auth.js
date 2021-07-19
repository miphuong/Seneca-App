const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

require('dotenv').config();

mongoose.set('useCreateIndex', true);

var userSchema = new Schema({
    "userName": {
        type: String,
        unique: true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
});

let User; 

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        try{
            //let db = mongoose.connect("mongodb+srv://givemeaname:This1sAT3stPassword@senecaapp.qqfrq.mongodb.net/user?retryWrites=true&w=majority", { useNewUrlParser: true,  useUnifiedTopology: true });
            let connectionString = "mongodb+srv://" + process.env.MONGOOSE_USERNAME + ":" + process.env.MONGOOSE_PASSWORD + "@" + process.env.MONGOOSE_HOST;
            let db = mongoose.connect(connectionString, { useNewUrlParser: true,  useUnifiedTopology: true });
        }catch(err){
            console.log("err", err);
        }

        User = mongoose.model('Users', userSchema );
        resolve();
    });
};
    