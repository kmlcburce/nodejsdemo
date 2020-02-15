const express = require('express');
const app = express();
// Joi a validation module
const Joi = require('joi');
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

const courses = [
    {id: 1, name:'course1'},
    {id: 2, name:'course2'},
    {id: 3, name:'course3'}
];

app.get('/', function(req, res){
    res.send('Hello World');
});

app.get('/api/courses', function(req, res){
    res.send(courses);
    // res.json(courses);
});

// api/course/1
app.get('/api/courses/:id', function (req, res){
    // res.send(req.params.id);
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        return res.status(404).send('Course id not found');
    }
    res.send(course);
});

app.post('/api/courses', function(req, res){
    // Manunal Validation
    // if(!req.body.name  || req.body.name.length < 3){
    //     // 400 Bad Request
    //     res.status(400).send('Name is required and should be mininum of 3 characters');
    //     return;
    // }


    // const schema = {
    //     name: Joi.string().min(3).required() 
    // };

    // const result =  Joi.validate(req.body, schema);
    // if(result.error){
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // }
    
    // Making use of the validateCourse() 
    const { error } = validateCourse(req.body);

    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', function(req,res){
    // Look up the courses
    // if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        return res.status(404).send('Course id not found');
    }

    // Validate
    // If invalid, return 400

    // Redunduncy in validation
    // const schema = {
    //     name: Joi.string().min(3).required() 
    // };

    // const result = Joi.validate(req.body, schema);

    // Making use of validateCourse() 

    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body); // result.error --- object destructuring

    // result.error --- not using object destructuring
    if(error){ // Making use of  object destructuring /const { error } = validateCourse(req.body);/
        // res.status(400).send(result.error.details[0].message); --  not using object destructuring
        res.status(400).send(error.details[0].message);
        return;
    }
    
    // Update course
    course.name = req.body.name;

    // Return updated course
    res.send(course);
});


app.delete('/api/courses/:id', function(req, res){
    // Look up course id
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send('Course id not found');
        return;
    }

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});

// To avoid redunduncy in validation
function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required() 
    };

    return Joi.validate(course, schema);
}