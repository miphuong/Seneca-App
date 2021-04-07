const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const filterjs = require('./filter.js');
const dataService = require('./data-service.js');
const bodyParser = require('body-parser');
const clientSessions = require('client-sessions');
const passport = require('passport'); // to use Federation Authentication
const googleAuth = require('./google-auth.js');
const serviceAuth = require('./service-auth.js');
const BearerStrategy = require('passport-http-bearer');


googleAuth(passport);
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./sub'));

app.set('view engine', 'jade');
app.set('views', './sub/jade');

passport.use(new BearerStrategy(
    function(token, done) {
      User.findOne({ token: token }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user, { scope: 'read' });
      });
    }
));

// Setup client-sessions
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "search_project_sgme2018", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use((req, res, next) => {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


//app.use('/main', (req, res) => {
app.get('/main', (req, res) => {
    //console.log("this is /main");
    //res.send("this is main pg");
    
    dataService.getAll().then((data) => {
        console.log("dataservice.getall fn");
        //console.log("data1111: ", data)
        res.render('filter', {data : data, userName : UN});
        //res.send("/main");
    }).catch((err) => {
        console.log("errrrrrrrrrrr:" , err);
    });
});


//app.use('/courses', require('./routes/courses'));


app.post('/filter', (req, res) => {
    console.log("filter post");
    var filteredArr = 
    [
        {
            code : [],
            name : [],
            semester : [],
            prerequisite : [],
            required : [],
            recommendedProfessor : [],
            isGeneral : [],
            desc : []
        }
    ];

    filterjs.filterfunction(req.body).then((data) => {
        var filteredSemester = data.semester;
        var filteredIsgeneral = data.isgeneral;
        var count = 0;

        if(filteredSemester[0] == null && filteredIsgeneral[0] == null){
            res.redirect('/main');
        }

        if(filteredSemester[0] != null){
            for(let i=0; i<arr.length; i++){
                for(let j=0; j<filteredSemester.length; j++){
                    if(filteredSemester[j] == arr[i].semester){
                        filteredArr[count] = arr[i]; 
                        count++;
                    }
                }
            }
            res.render('filter', {data : filteredArr});
        }

        if(filteredSemester[0] == null && filteredIsgeneral[0] != null){
            for(let i=0; i<arr.length; i++){
                if(filteredIsgeneral == String(arr[i].isGeneral)){
                    filteredArr[count] = arr[i];
                    count++;
                }
            }
            res.render('filter', {data : filteredArr});
        }
    }).catch((err) => {
        console.log(err);
    });
})

app.get('/filter/code/:code', (req, res) => {
    var code = req.params.code;

    for(let i=0; i<arr.length; i++){
        if(code == arr[i].code){
            res.render('result', {code : arr[i].code, name : arr[i].name, semester : arr[i].semester, prerequisite : arr[i].prerequisite,
            required : arr[i].required, recommendedProfessor : arr[i].recommendedProfessor, isGeneral : arr[i].isGeneral, desc : arr[i].desc});
        }
    }
})

// Route
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/auth/google', 
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login']}));

app.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/login'}), (req,res) =>{
    console.log(req.user.token);
    req.session.token = req.user.token;
    res.redirect('/main');
    
});

app.post('/login', (req, res) => {
    console.log("login part 1");
    req.body.userAgent = req.get('User-Agent');
    console.log("login part 2");
    serviceAuth.checkUser(req.body)
    .then((user) => {
        console.log("login part 2.111111111");
        req.session.user = {
            userName: user.userName,
            email: user.email,
            loginHistory: user.loginHistory
        }

        global.UN = req.session.user.userName;
        
        res.redirect('/main');
        //res.redirect('/courses');
        console.log("username and pw:", user.userName);
    }).catch((err) => {
        res.render('login', {errorMessage: err, userName: req.body.userName});
    });
    console.log("login part 3");
});

app.get('/api/me',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.json(req.user);
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session.reset();
    res.redirect('/');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/signup', (req, res) => {
    serviceAuth.registerUser(req.body)
    .then((value) => {
        res.render('signup', {successMessage: "User created"});
    }).catch((err) => {
        res.render('signup', {errorMessage: err, userName: req.body.userName});
    })
});


app.get('*', (req, res) => {
    res.status(404).send("Page Not Found");
})

console.log('1');
serviceAuth.initialize()
.then(serviceAuth.initialize)
.then(()=>{
    console.log('2');
    app.listen(port, function(){
        console.log("app listening on: " + port)
    });
}).catch((err)=>{
    console.log("unable to start server: " + err);
})

