const express = require("express");
const router = express.Router();

const user = require('./user');
const myntra = require('./myntra');

router.use('/users', user);
router.use('/myntra', myntra);


module.exports = router;