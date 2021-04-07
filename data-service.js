const Sequelize = require('sequelize');

/*
// Heruo Postgres Connection:
var sequelize = new Sequelize('d2oonl7bomk6et','frthkwnymubqxq','7cbd858de5091c5d194abeede0f91a9bb7ee7fbac4e403106559dd0abca66f77', {
    host: 'ec2-54-83-17-151.compute-1.amazonaws.com',
    dialect: 'postgres',
    operatorAliases: false,
    pool:{
        max:5,
        min:0,
        acquire: 30000,
        idle:10000
    }
});
*/


// Local Connection:
var sequelize = new Sequelize('Courses','postgres','a47DxMn3NUBS', {
    host: 'localhost',
    dialect: 'postgres',
    operatorAliases: false,
    pool:{
        max:5,
        min:0,
        acquire: 30000,
        idle:10000
    }
});



//Define Course Model/Table
//var Courses = sequelize.define('courses', { // 'Courses' before
const Course = sequelize.define('courses', { // 'Courses' before
    code: {//courseCode
        type: Sequelize.TEXT,
        primaryKey: true
    },
    name: Sequelize.TEXT, //subjectTitle
    semester: Sequelize.INTEGER,//semester
    prerequisite: Sequelize.ARRAY(Sequelize.TEXT),//prerequisite 
    required: Sequelize.ARRAY(Sequelize.TEXT),//requiredCourse  
    recommendedProfessor: Sequelize.ARRAY(Sequelize.TEXT),//recommendedProf  
    isGeneral: Sequelize.BOOLEAN,//isGeneral
    desc: Sequelize.TEXT}/*,
    {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
    }*/
);

console.log("Course 1 is: " , Course);

/*
//Define Course Model/Table
var Courses = sequelize.define('Courses', {
    code: {//courseCode
        type: Sequelize.TEXT,
        primaryKey: true
    },
    name: Sequelize.TEXT, //subjectTitle
    semester: Sequelize.INTEGER,//semester
    prerequisite: Sequelize.ARRAY(Sequelize.TEXT),//prerequisite 
    required: Sequelize.ARRAY(Sequelize.TEXT),//requiredCourse  
    recommendedProfessor: Sequelize.ARRAY(Sequelize.TEXT),//recommendedProf  
    isGeneral: Sequelize.BOOLEAN,//isGeneral
    desc: Sequelize.TEXT},
    {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
});

//console.log("coursesSSSSSSSSSSSSSsssss: ", Courses);
*/



module.exports.getAll = () => {
    console.log("dataservice.getall fn 1");
    return new Promise((resolve,reject) => {
        console.log("dataservice.getall fn 2");
        Course.findAll()
            .then( courses => {
                //res.sendStatus(200);
                //console.log("Course 2 is: " , Course);
                console.log("data:", courses);
                //console.log("dataservice.getall fn 3");
                global.arr = courses.map((element) => {
                    console.log("dataservice.getall fn 3");
                    let newarr = {};
                    newarr['code'] = element.code;
                    newarr['name'] = element.name;
                    newarr['semester'] = element.semester;
                    newarr['prerequisite'] = element.prerequisite;
                    newarr['required'] = element.required;
                    newarr['recommendedProfessor'] = element.recommendedProfessor;
                    newarr['isGeneral'] = element.isGeneral;
                    newarr['desc'] = element.desc;
                    console.log("newarr.code:", newarr.code);

                    return newarr;
                });

                console.log("dataservice.getall fn 4");
                resolve(arr);
                consol.log("arr: ", arr);
                console.log("dataservice.getall fn 5");
            })
            .catch((err)=>{
                reject("data-sevice-unable to sync the database");
            });
            
        console.log("dataservice.getall fn 6");


        // THIS WORKS IF U COMMENT OUT THE ABOVE
        /*
        let newarr = {};
            newarr['code'] = "IPC144";
            newarr['name'] = "Fardad";
            newarr['semester'] = 1;
            newarr['prerequisite'] = "";
            newarr['required'] = "";
            newarr['recommendedProfessor'] = "fardad";
            newarr['isGeneral'] = "yes";
            newarr['desc'] = "this is a c course";
            //console.log("newarr.code:", newarr.code);
            console.log("dataservice.getall fn 3");
            console.log("arr:" , newarr);
            //return newarr;

            resolve(newarr);
        */
    });
};

