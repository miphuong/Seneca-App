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

console.log("1.1");
module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        //let db = mongoose.createConnection("mongodb+srv://givemeaname:<password>@senecaapp.qqfrq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true });
        //let db = mongoose.createConnection("mongodb://pure_kang:helloworld123@ds133262.mlab.com:33262/pure_seneca", { useNewUrlParser: true });
        //let db = mongoose.connect("mongodb://pure_kang:helloworld123@ds133262.mlab.com:33262/pure_seneca", { useNewUrlParser: true });
        console.log("1.2");
        try{
            let db = mongoose.connect("mongodb+srv://givemeaname:a47DxMn3NUBS@senecaapp.qqfrq.mongodb.net/user?retryWrites=true&w=majority", { useNewUrlParser: true,  useUnifiedTopology: true });
            console.log("1.3");
        }catch(err){
            console.log("err", err);
        }
        console.log("1.4");
        /*db.on('error', (err) => {
            reject(err);
        });

        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });*/

        //var userModel = mongoose.model('Users', userSchema );
        User = mongoose.model('Users', userSchema );
        resolve();
    });
};

module.exports.registerUser = (userData) => {
    // Assume userData has properties: .userName, userAgent, .email, 
    // .password, .password2
    console.log('1.5');
        return new Promise ((resolve, reject) => {
            console.log('1.6');
            if(userData.password !== userData.password2){
                reject("Passwords do not match");
                console.log('1.7');
            } else {
                console.log('1.8');
                bcrypt.genSalt(10, function(err, salt){
                    // generate a "salt" using 10 rounds
                    bcrypt.hash(userData.password, salt, function(err, hash){
                        // encrypt the password: userData.password
                        if(err){
                            reject("There was an error encrypting the password");
                        }
                        else {
                            userData.password = hash;
                            let newUser = new User(userData);
                            newUser.save((err) => {
                                if(err){
                                    if(err.code == 11000){
                                        reject("User Name already taken");
                                    }
                                    reject("There was an error creating the user: " + err);
                                }
                                else{
                                    resolve();
                                }
                            })
                        }
                    })
                    
                })
            }     
        });
    };
    
    module.exports.checkUser = (userData) => {
        console.log("checkUser part 1");
        return new Promise((resolve, reject) => {
            console.log("checkUser part 2,",userData.userName);
            User.find({userName: userData.userName})
            .exec().then((users) => {
                if(users[0].length == 0){
                    reject("Unable to find user: " + userData.userName);
                }
                else {
                    bcrypt.compare(userData.password, users[0].password).then((res) => {
                        if(res === true) // it matches
                        {
                            users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                            User.updateOne(//User.update(
                                { userName: users[0].userName },
                                { $set: {loginHistory: users[0].loginHistory }},
                                { multi: false }
                            ).exec().then((() => {
                                resolve(users[0]);
                                console.log("pw matches! 1");
                            })).catch((err) => {
                                reject("There was an error verifying the user: " + err);
                            });
                            console.log("pw matches! 2");
                        }
                        else {
                            reject("Incorrect Password for user: " + userData.userName);
                        }
                    }).catch(() => {
                        reject("Unable to find user: " + userData.userName);
                    })
                }
            });
            console.log("checkUser part 3");
        });
    }
    
    