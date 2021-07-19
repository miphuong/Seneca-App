const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

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
            let db = mongoose.connect("mongodb+srv://givemeaname:This1sAT3stPassword@senecaapp.qqfrq.mongodb.net/user?retryWrites=true&w=majority", { useNewUrlParser: true,  useUnifiedTopology: true });
        }catch(err){
            console.log("err", err);
        }

        User = mongoose.model('Users', userSchema );
        resolve();
    });
};
    