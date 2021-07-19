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
            let connectionString = "mongodb+srv://" + process.env.MONGOOSE_USERNAME + ":" + process.env.MONGOOSE_PASSWORD + "@" + process.env.MONGOOSE_HOST + "/user?retryWrites=true&w=majority";
            let db = mongoose.connect(connectionString, { useNewUrlParser: true,  useUnifiedTopology: true });
        }catch(err){
            console.log("err", err);
        }

        User = mongoose.model('Users', userSchema );
        resolve();
    });
};
    