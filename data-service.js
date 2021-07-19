const Sequelize = require('sequelize');
require('dotenv').config();

// Heruo Postgres Connection: 
var sequelize = new Sequelize(process.env.SEQUELIZE_DATABASE,process.env.SEQUELIZE_USERNAME,process.env.SEQUELIZE_PASSWORD, {
    host: process.env.SEQUELIZE_HOST,
    dialect: 'postgres',
    operatorAliases: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false 
          }
    },
    pool:{
        max:5,
        min:0,
        acquire: 30000,
        idle:10000
    }
});


//Define Course Model/Table
const Course = sequelize.define('courses', { 
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

module.exports.getAll = () => {
    return new Promise((resolve,reject) => {
        Course.findAll()
            .then( courses => {
                global.arr = courses.map((element) => {
                    // Put data into array
                    let newarr = {};
                    newarr['code'] = element.code;
                    newarr['name'] = element.name;
                    newarr['semester'] = element.semester;
                    newarr['prerequisite'] = element.prerequisite;
                    newarr['required'] = element.required;
                    newarr['recommendedProfessor'] = element.recommendedProfessor;
                    newarr['isGeneral'] = element.isGeneral;
                    newarr['desc'] = element.desc;

                    return newarr;
                });

                resolve(arr);
            })
            .catch((err)=>{
                reject("data-sevice-unable to sync the database");
            });
    });
};
