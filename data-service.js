const Sequelize = require('sequelize');

// Heruo Postgres Connection: fixes oversized cookie error
var sequelize = new Sequelize('de3mftkc6qma2v','dsqowhaxsbagdl','14edb012ce3db049d134e5b31ccc0da8440c4abbeb2a4c015e582e23476caeae', {
    host: 'ec2-3-211-37-117.compute-1.amazonaws.com',
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
