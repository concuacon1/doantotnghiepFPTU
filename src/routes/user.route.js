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

router.post('/change-password', checkSchema(validatorPasswordChange), authmiddleware, User.change_password);

router.post('/send-otp', User.send_otp);

router.post('/change-password-otp', checkSchema(validatorPasswordChangeOTP), errordatamiddleware, User.change_password_otp);

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'src/uploads');
   },
   filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
   },
});

const upload = multer({ storage: storage });

router.post('/upload-file', upload.single('file'), User.uploadFile);

router.get('/information-user', authmiddleware, User.informationController);

module.exports = router