const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const filterjs = require('./filter.js');
const dataService = require('./data-service.js');
const bodyParser = require('body-parser');
const clientSessions = require('client-sessions');
const serviceAuth = require('./service-auth.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./sub'));

app.set('view engine', 'jade');
app.set('views', './sub/jade');


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


app.get('/main', (req, res) => {
    dataService.getAll().then((data) => {
        res.render('filter', {data : data});
    }).catch((err) => {
        console.log(err)
    });
});

app.post('/filter', (req, res) => {
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

app.get('/', (req, res) => {
    res.redirect('/main');
});

app.get('*', (req, res) => {
    res.status(404).send("Page Not Found");
})

serviceAuth.initialize()
.then(serviceAuth.initialize)
.then(()=>{
    app.listen(port, function(){
        console.log("app listening on: " + port)
    });
}).catch((err)=>{
    console.log("unable to start server: " + err);
})

