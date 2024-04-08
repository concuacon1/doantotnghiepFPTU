const router = require('express').Router()
const Contract = require('./../controllers/contract.controller')
const { authmiddleware } = require('../middleware/authmiddleware')
const { rolemiddleware } = require('../middleware/rolemiddleware');


router.post('/create_contract', authmiddleware, (req, res, next) => {
    req.dataRole = { list_role: ["ADMIN", "STAFF"] };
    next();
}, rolemiddleware, Contract.create_contract);


router.get('/contact_me', authmiddleware, (req, res, next) => {
    req.dataRole = { list_role: ["CUSTOMER"] };
    next();
}, rolemiddleware, Contract.contract_persion);

router.delete('/delete_contact/:id', authmiddleware, (req, res, next) => {
    req.dataRole = { list_role: ["ADMIN", "STAFF"] };
    next();
}, rolemiddleware, Contract.delete_contract);

router.get('/list_contract', authmiddleware, (req, res, next) => {
    req.dataRole = { list_role: ["ADMIN", "STAFF"] };
    next();
}, rolemiddleware, Contract.list_contract);

router.get('/check_contract', authmiddleware, (req, res, next) => {
    req.dataRole = { list_role: ["ADMIN", "STAFF"] };
    next();
}, rolemiddleware, Contract.check_contract);

router.get('/contract_detail/:id', authmiddleware, (req, res, next) => {
    req.dataRole = { list_role: ["ADMIN", "STAFF"] };
    next();
}, rolemiddleware, Contract.get_contract_detail);

module.exports = router  