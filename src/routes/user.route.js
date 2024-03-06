const router = require('express').Router()
const User = require('./../controllers/user.controller')
const { checkSchema } = require("express-validator")
const { createUserValidatorSchema, validatorPasswordChange, validatorPasswordChangeOTP } = require("../validator/user_validator")
const { authmiddleware } = require('../middleware/authmiddleware')
const { rolemiddleware } = require('../middleware/rolemiddleware');
const { errordatamiddleware } = require('../middleware/errordatamiddleware');
const multer = require('multer');
const path = require('path');
router.post('/register', checkSchema(createUserValidatorSchema), User.register_user)
router.route('/login_email').post(User.login_email)
router.route('/login_phone').post(User.login_phone)
router.get('/list_user_role_admin', authmiddleware, (req, res, next) => {
   req.dataRole = { list_role: ['ADMIN'] };
   next();
}, rolemiddleware, User.get_list_user);

router.post('/search_user_role_admin', authmiddleware, (req, res, next) => {
   req.dataRole = { list_role: ['ADMIN'] };
   next();
}, rolemiddleware, User.search_list_user);

router.delete('/delete_user/:id', authmiddleware, (req, res, next) => {
   req.dataRole = { list_role: ['ADMIN'] };
   next();
}, rolemiddleware, User.delete_user);
