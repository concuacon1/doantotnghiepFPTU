const router = require('express').Router();
const Designer = require('./../controllers/designer.controller');
const { checkSchema } = require("express-validator");
const { createDesignerValidatorSchema, updateDesignerValidatorSchema } = require("../validator/designer_validator");
const { authmiddleware } = require('../middleware/authmiddleware');
const { rolemiddleware } = require('../middleware/rolemiddleware');
const { errordatamiddleware } = require('../middleware/errordatamiddleware');
const multer = require('multer');
const path = require('path');

router.post('/create', checkSchema(createDesignerValidatorSchema), authmiddleware, Designer.create);

router.get('/', authmiddleware, Designer.getAll);

router.get('/:id', authmiddleware, Designer.getById);

router.patch('/:id/update', checkSchema(updateDesignerValidatorSchema), authmiddleware, Designer.update);

router.delete('/:id/delete', authmiddleware, Designer.delete);

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

router.post('/:id/upload-avatar', upload.single('avatar'), authmiddleware, Designer.uploadAvatar);

module.exports = router;
