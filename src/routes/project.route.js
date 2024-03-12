const router = require('express').Router()
const Project = require('./../controllers/project.controller')
const { authmiddleware } = require('../middleware/authmiddleware')
const { rolemiddleware } = require('../middleware/rolemiddleware');
const { errordatamiddleware } = require('../middleware/errordatamiddleware');


router.get('/get_project_type', authmiddleware, (req, res, next) => {
    req.dataRole = { list_role: ['ADMIN' , "STAFF"] };
    next();
}, rolemiddleware, Project.get_project_type);


router.post('/post_project_type', authmiddleware, (req, res, next) => {
    req.dataRole = { list_role: ['ADMIN' , "STAFF"] };
    next();
}, rolemiddleware, Project.create_project_type); 

router.post('/create_project', authmiddleware, (req, res, next) => {
    req.dataRole = { list_role: ['ADMIN' , "STAFF"] };
    next();
}, rolemiddleware, Project.create_project_category); 


router.post('/check_project_type', authmiddleware, (req, res, next) => {
    req.dataRole = { list_role: ['ADMIN' , "STAFF"] };
    next();
}, rolemiddleware, Project.check_project_type); 



module.exports = router  